use candid::Principal;
use ic_cdk::{call, caller, update};

use crate::types::BalanceOfArgs;


#[update]
pub async fn get_caller_balance() -> Result<u128, String> {
    let caller_principal = caller(); // Get the caller's principal

    // Fetch the canister ID from the environment
    let ledger_canister_id = option_env!("CANISTER_ID_TEST_SIPNPLAY")
        .ok_or("Environment variable `CANISTER_ID_TEST_SIPNPLAY` not set")?;

    let args = BalanceOfArgs {
        owner: caller_principal,
        subaccount: None, // No subaccount provided
    };

    // Make the call to the ledger canister
    match ic_cdk::call::<_, (u128,)>(
        Principal::from_text(ledger_canister_id).unwrap(),
        "icrc1_balance_of",
        (args,),
    )
    .await
    {
        Ok((balance,)) => Ok(balance),
        Err(e) => Err(format!("Failed to fetch balance: {:?}", e)),
    }
}

#[update]
pub async fn get_backend_balance() -> Result<u128, String> {
    // Fetch the ledger canister ID from the environment
    let ledger_canister_id = option_env!("CANISTER_ID_TEST_SIPNPLAY")
        .ok_or("Environment variable `CANISTER_ID_TEST_SIPNPLAY` not set")?;

    // Fetch the backend canister ID from the environment (this is the owner principal)
    let backend_canister_id = option_env!("CANISTER_ID_SIPNPLAY_ICP_BACKEND")
        .ok_or("Environment variable `CANISTER_ID_SIPNPLAY_ICP_BACKEND` not set")?;

    // Convert backend canister ID to Principal
    let owner_principal = Principal::from_text(backend_canister_id)
        .map_err(|_| "Invalid backend canister ID format".to_string())?;

    let args = BalanceOfArgs {
        owner: owner_principal, // Use backend canister ID as the owner
        subaccount: None,       // No subaccount provided
    };

    // Make the call to the ledger canister
    match call::<_, (u128,)>(
        Principal::from_text(ledger_canister_id).unwrap(),
        "icrc1_balance_of",
        (args,),
    )
    .await
    {
        Ok((balance,)) => Ok(balance),
        Err(e) => Err(format!("Failed to fetch balance: {:?}", e)),
    }
}

#[update]
pub fn create_user(email: String) -> String {
    let caller = ic_cdk::caller();
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if state.user_data.contains_key(&caller) {
            "User already exists".to_string()
        } else {
            let new_user = UserCreationInput {
                id: caller,
                email,
            };
            state.user_data.insert(caller, new_user).unwrap();
            "User created!".to_string()
        }
    })
}

#[update]
async fn icrc2_transfer_from(
    ledger_id: Principal,         // Ledger canister ID as a Principal
    transfer_from: Principal,     // Sender's Principal
    transfer_to: Principal,       // Recipient's Principal
    amount: Nat,                  // Amount to transfer
) -> Result<Nat, String> {
    let transfer_args = TransferFromArgs {
        spender_subaccount: None,
        from: Account {
            owner: transfer_from,
            subaccount: None,
        },
        to: Account {
            owner: transfer_to,
            subaccount: None,
        },
        amount,
        fee: None,
        memo: None,
        created_at_time: None,
    };

    let response: CallResult<(TransferFromResult,)> =
        call(ledger_id, "icrc2_transfer_from", (transfer_args,)).await;

    match response {
        Ok((TransferFromResult::Ok(block_index),)) => Ok(block_index),
        Ok((TransferFromResult::Err(error),)) => Err(format!("Ledger transfer error: {:?}", error)),
        Err((code, message)) => Err(format!("Failed to call ledger: {:?} - {}", code, message)),
    }
}

#[update]
async fn deduct_money(amount: Nat) -> Result<String, String> {
    let caller_principal = caller();

    // Check if the user exists in `user_data`
    let user_exists = STATE.with(|state| {
        let state = state.borrow();
        state.user_data.contains_key(&caller_principal)
    });

    if !user_exists {
        return Err("User not found".to_string());
    }

    // Fetch backend canister ID from the environment variable
    let backend_canister_id_str = option_env!("CANISTER_ID_SIPNPLAY_ICP_BACKEND")
        .ok_or("Backend canister ID not found in environment variables")?;

    let backend_canister_id = Principal::from_text(backend_canister_id_str)
        .map_err(|_| "Invalid backend canister ID".to_string())?;

    // Create transfer arguments
    let transfer_args = TransferFromArgs {
        spender_subaccount: None,
        from: Account {
            owner: caller_principal,
            subaccount: None,
        },
        to: Account {
            owner: backend_canister_id,
            subaccount: None,
        },
        amount: amount.clone(),
        fee: None,
        memo: None,
        created_at_time: None,
    };

    // Perform the inter-canister call to transfer money
    let response: CallResult<(TransferFromResult,)> =
        call(backend_canister_id, "icrc2_transfer_from", (transfer_args,)).await;

    match response {
        Ok((TransferFromResult::Ok(_block_index),)) => {
            // Add (caller, amount) to `blackjack_bet` map
            STATE.with(|state| {
                let mut state = state.borrow_mut();
                state.blackjack_bet.insert(
                    caller_principal,
                    BlackjackData {
                        id: caller_principal, // Use Principal ID
                        amount: amount.0.to_u64().unwrap_or_default(), // Convert Nat to u64
                    },
                )
                .expect("Failed to insert into blackjack_bet map");
            });

            Ok(format!(
                "Points deducted successfully: {}",
                amount.to_string()
            ))
        }
        Ok((TransferFromResult::Err(error),)) => Err(format!("Ledger transfer error: {:?}", error)),
        Err((code, message)) => Err(format!("Failed to call ledger: {:?} - {}", code, message)),
    }
}

#[update]
async fn withdraw_money_from_default(amount: Nat) -> Result<String, String> {
    let caller_principal = caller();

    // Check if the caller is approved
    if !is_approved(caller_principal) {
        return Err("You are not approved".to_string());
    }

    // Fetch backend canister ID from the environment variable
    let backend_canister_id_str = option_env!("CANISTER_ID_SIPNPLAY_ICP_BACKEND")
        .ok_or("Backend canister ID not found in environment variables")?;

    let backend_canister_id = Principal::from_text(backend_canister_id_str)
        .map_err(|_| "Invalid backend canister ID".to_string())?;

    // Perform the inter-canister call to transfer tokens
    let transfer_args = TransferArgs {
        to: Account {
            owner: caller_principal, // Transfer to the caller
            subaccount: None,
        },
        fee: None,
        memo: None,
        from_subaccount: None,
        created_at_time: None,
        amount: amount.clone(),
    };

    let response: CallResult<(TransferResult,)> =
        call(backend_canister_id, "icrc1_transfer", (transfer_args,)).await;

    match response {
        Ok((TransferResult::Ok(value),)) => {
            Ok(format!(
                "Tokens withdrawn from backend successfully: {}",
                value.to_string()
            ))
        }
        Ok((TransferResult::Err(error),)) => Err(format!("Ledger transfer error: {:?}", error)),
        Err((code, message)) => Err(format!("Failed to call ledger: {:?} - {}", code, message)),
    }
}

#[update]
async fn game_lost() -> Result<String, String> {
    let caller_principal = caller();

    // Check if the caller exists in `user_data` map
    let user_exists = STATE.with(|state| {
        let state = state.borrow();
        state.user_data.contains_key(&caller_principal)
    });

    if !user_exists {
        return Err("User not found".to_string());
    }

    // Check if the caller exists in `blackjack_bet` map
    let bet_exists = STATE.with(|state| {
        let state = state.borrow();
        state.blackjack_bet.contains_key(&caller_principal)
    });

    if !bet_exists {
        return Err("User not found in the bet record".to_string());
    }

    // Update the user's blackjack bet record to 0
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.blackjack_bet.insert(
            caller_principal,
            BlackjackData {
                id: caller_principal,
                amount: 0, // Reset the amount to 0
            },
        )
        .expect("Failed to update bet record");
    });

    Ok("Bet Record updated successfully".to_string())
}

#[update]
async fn add_money(amount: Nat) -> Result<String, String> {
    let caller_principal = caller();

    // Check if the caller exists in `user_data`
    let user_exists = STATE.with(|state| {
        let state = state.borrow();
        state.user_data.contains_key(&caller_principal)
    });

    if !user_exists {
        return Err("User not found".to_string());
    }

    // Check if the caller exists in `blackjack_bet`
    let bet_record = STATE.with(|state| {
        let state = state.borrow();
        state.blackjack_bet.get(&caller_principal).cloned()
    });

    let bet_data = match bet_record {
        Some(data) => data,
        None => return Err("User not found in the bet record".to_string()),
    };

    // Ensure the amount is not more than 2.5 times the bet amount
    let bet_amount = Nat::from(bet_data.amount);
    let threshold = bet_amount.clone() * Nat::from(25) / Nat::from(10); // 2.5x threshold

    if amount > threshold {
        return Err("fraud".to_string());
    }

    // Fetch backend canister ID from environment variable
    let backend_canister_id_str = option_env!("CANISTER_ID_SIPNPLAY_ICP_BACKEND")
        .ok_or("Backend canister ID not found in environment variables")?;

    let backend_canister_id = Principal::from_text(backend_canister_id_str)
        .map_err(|_| "Invalid backend canister ID".to_string())?;

    // Perform the inter-canister call to transfer tokens
    let transfer_args = TransferArgs {
        to: Account {
            owner: caller_principal, // Transfer to the caller
            subaccount: None,
        },
        fee: None,
        memo: None,
        from_subaccount: None,
        created_at_time: None,
        amount: amount.clone(),
    };

    let response: CallResult<(TransferResult,)> =
        call(backend_canister_id, "icrc1_transfer", (transfer_args,)).await;

    match response {
        Ok((TransferResult::Ok(_block_index),)) => {
            // Reset the user's blackjack bet amount to 0
            STATE.with(|state| {
                let mut state = state.borrow_mut();
                state.blackjack_bet.insert(
                    caller_principal,
                    BlackjackData {
                        id: caller_principal,
                        amount: 0, // Reset amount to 0
                    },
                )
                .expect("Failed to update bet record");
            });

            Ok(format!(
                "Points added successfully: {}",
                amount.to_string()
            ))
        }
        Ok((TransferResult::Err(error),)) => Err(format!("Ledger transfer error: {:?}", error)),
        Err((code, message)) => Err(format!("Failed to call ledger: {:?} - {}", code, message)),
    }
}

#[update]
async fn send_message(name: String, email: String, message: String) -> Result<String, String> {
    // Validate input fields
    if name.is_empty() || email.is_empty() || message.is_empty() {
        return Err("All fields must be filled".to_string());
    }

    // Create a new `MessageData` entry
    let new_message = MessageData {
        date: time() as i64, // Use current time in nanoseconds
        name,
        email: email.clone(),
        message,
    };

    // Insert into stable memory
    let insert_result = STATE.with(|state| {
        let mut state = state.borrow_mut();
        state
            .message_data
            .insert(email.clone(), new_message)
            .map_err(|_| "Failed to add message to stable memory".to_string())
    });

    // Return appropriate message
    match insert_result {
        Ok(_) => Ok("Message sent successfully!".to_string()),
        Err(e) => Err(e),
    }
}

#[update]
async fn join_waitlist(name: String, email: String, icp_address: String) -> Result<String, String> {
    // Validate input fields
    if name.is_empty() || email.is_empty() {
        return Err("Name and email must be filled".to_string());
    }

    // Create a new WaitlistData entry
    let new_waitlist_entry = WaitlistData {
        date: time() as i64, // Use current time in nanoseconds
        name,
        email: email.clone(),
        icp_address,
    };

    // Add to stable memory
    let insert_result = STATE.with(|state| {
        let mut state = state.borrow_mut();
        state
            .waitlist_data
            .insert(email.clone(), new_waitlist_entry)
            .map_err(|_| "Failed to add waitlist entry to stable memory".to_string())
    });

    // Return appropriate message
    match insert_result {
        Ok(_) => Ok("Joined the waitlist successfully!".to_string()),
        Err(e) => Err(e),
    }
}