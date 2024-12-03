use candid::{Nat, Principal};
use ic_cdk::api::time;
use ic_cdk::{api::call::CallResult, call, caller, update};
use ic_cdk_timers::set_timer_interval;
use ic_ledger_types::TransferResult;
use icrc_ledger_types::icrc1::transfer::{NumTokens, TransferArg};
use icrc_ledger_types::{icrc1::account::Account, icrc2::transfer_from::TransferFromArgs};
use std::time::Duration;

use aes::Aes128; // AES-128 (16-byte key)
use block_modes::{BlockMode, Ecb};
use block_modes::block_padding::Pkcs7;
use base64::{decode};
use std::str;

use crate::api_query::{is_approved, is_authenticated};
use crate::state_handler::{mutate_state, read_state};
use crate::{state_handler::STATE, types::BalanceOfArgs, UserCreationInput};
use crate::{
    BlackjackData, MessageData, RewardedPlayers, TetrisData, TetrisLeaderboardData,
    TransferFromResult, WaitlistData,
};

// Your secret key must be 16 bytes long for AES-128, so ensure it's exactly 16 bytes.
const SECRET_KEY: &[u8] = b"vgsi7uhIHKL2b2GK"; // 16-byte secret key for AES-128

type Aes128Ecb = Ecb<Aes128, Pkcs7>;

// Decrypt function
fn decrypt_score(encrypted_score: String) -> String {
    let encrypted_data = decode(&encrypted_score).expect("Failed to decode base64");

    // Decrypt using AES ECB mode
    let cipher = Aes128Ecb::new_from_slices(SECRET_KEY, Default::default()).unwrap();
    let decrypted_data = cipher.decrypt_vec(&encrypted_data).expect("Decryption failed");

    str::from_utf8(&decrypted_data).expect("Invalid UTF-8").to_string()
}

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
            let new_user = UserCreationInput { id: caller, email };
            state.user_data.insert(caller, new_user);
            "User created!".to_string()
        }
    })
}

// #[update]
// async fn icrc2_transfer_from(
//     ledger_id: Principal,     // Ledger canister ID as a Principal
//     transfer_from: Principal, // Sender's Principal
//     transfer_to: Principal,   // Recipient's Principal
//     amount: Nat,              // Amount to transfer
// ) -> Result<Nat, String> {
//     let transfer_args = TransferFromArgs {
//         spender_subaccount: None,
//         from: Account {
//             owner: transfer_from,
//             subaccount: None,
//         },
//         to: Account {
//             owner: transfer_to,
//             subaccount: None,
//         },
//         amount,
//         fee: None,
//         memo: None,
//         created_at_time: None,
//     };

//     let response: CallResult<(TransferFromResult,)> =
//         call(ledger_id, "icrc2_transfer_from", (transfer_args,)).await;

//     match response {
//         Ok((TransferFromResult::Ok(block_index),)) => Ok(block_index),
//         Ok((TransferFromResult::Err(error),)) => Err(format!("Ledger transfer error: {:?}", error)),
//         Err((code, message)) => Err(format!("Failed to call ledger: {:?} - {}", code, message)),
//     }
// }

#[update]
async fn deduct_money(amount: Nat) -> Result<String, String> {
    use num_traits::ToPrimitive;
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

    let ledger_canister_id_str = option_env!("CANISTER_ID_TEST_SIPNPLAY")
        .ok_or("Ledger canister ID not found in environment variables")?;

    let ledger_canister_id = Principal::from_text(ledger_canister_id_str)
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
        call(ledger_canister_id, "icrc2_transfer_from", (transfer_args,)).await;

    match response {
        Ok((TransferFromResult::Ok(_block_index),)) => {
            // Add (caller, amount) to `blackjack_bet` map
            STATE.with(|state| {
                let mut state = state.borrow_mut();
                state.blackjack_bet.insert(
                    caller_principal,
                    BlackjackData {
                        id: caller_principal,                          // Use Principal ID
                        amount: amount.0.to_u64().unwrap_or_default(), // Convert Nat to u64
                    },
                );
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
pub async fn withdraw_money_from_default(amount: u64) -> Result<Nat, String> {
    use ic_cdk::caller;

    let user_principal = caller();
    let ledger_canister_id_str = option_env!("CANISTER_ID_TEST_SIPNPLAY")
        .ok_or("Ledger canister ID not found in environment variables")?;

    let ledger_canister_id = Principal::from_text(ledger_canister_id_str)
        .map_err(|_| "Invalid ledger canister ID".to_string())?;

    // Convert the amount to NumTokens (ensure NumTokens supports your scale)
    let amount_as_u64 = amount * 100_000_000; // Adjust for token precision
    let amount_tokens = NumTokens::from(amount_as_u64);
    ic_cdk::println!("{}", amount_tokens);
    let args = TransferArg {
        from_subaccount: None, // Omitted by default
        to: Account {
            owner: user_principal,
            subaccount: None,
        },
        fee: None, // Default
        memo: None, // Default
        created_at_time: None, // Default
        amount: amount_tokens,
    };

    // Make the call
    let (result,): (Result<Nat, String>,) = ic_cdk::call(
        ledger_canister_id,
        "icrc1_transfer",
        (args,),
    )
    .await
    .map_err(|e| format!("Transfer failed: {:?}", e))?;

    // Handle response
    result.map_err(|err| format!("Transfer failed: {:?}", err))
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
        state
            .blackjack_bet
            .insert(
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
    let user_exists = read_state(|state| state.user_data.contains_key(&caller_principal));
    if !user_exists {
        return Err("User not found".to_string());
    }

    // Fetch the caller's blackjack bet data
    let bet_data = read_state(|state| state.blackjack_bet.get(&caller_principal));

    // Handle missing bet record
    let bet_data = match bet_data {
        Some(data) => data,
        None => return Err("User not found in the bet record".to_string()),
    };

    // Ensure the amount is not more than 2.5 times the bet amount
    let bet_amount = Nat::from(bet_data.amount);
    let threshold = bet_amount.clone() * Nat::from(25u32) / Nat::from(10u32); // 2.5x threshold

    if amount > threshold {
        return Err("fraud".to_string());
    }

    let ledger_canister_id_str = option_env!("CANISTER_ID_TEST_SIPNPLAY")
        .ok_or("Ledger canister ID not found in environment variables")?;

    let ledger_canister_id = Principal::from_text(ledger_canister_id_str)
        .map_err(|_| "Invalid ledger canister ID".to_string())?;

    // Create transfer arguments
    let transfer_args = TransferArg {
        to: Account {
            owner: caller_principal, // Transfer to the caller
            subaccount: None,
        },
        fee: None,              // Optional fee
        memo: None,             // Optional memo
        from_subaccount: None,  // Default subaccount
        created_at_time: None,  // No timestamp
        amount: amount.clone(), // Transfer amount
    };

    // Perform the inter-canister call to transfer tokens
    let response: CallResult<(TransferResult,)> =
        ic_cdk::api::call::call(ledger_canister_id, "icrc1_transfer", (transfer_args,)).await;

    match response {
        // Successful transfer
        Ok((TransferResult::Ok(_block_index),)) => {
            // Reset the user's blackjack bet amount to 0
            mutate_state(|state| {
                state.blackjack_bet.insert(
                    caller_principal,
                    BlackjackData {
                        id: caller_principal,
                        amount: 0, // Reset amount to 0
                    },
                )
            });

            Ok(format!("Points added successfully: {}", amount.to_string()))
        }
        // Transfer failed with a specific error
        Ok((TransferResult::Err(error),)) => Err(error.to_string()),
        // Inter-canister call failed
        Err((code, message)) => Err(format!(
            "Failed to call ledger canister: Code: {:?}, Message: {}",
            code, message
        )),
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
        match state.message_data.insert(email.clone(), new_message) {
            None => Ok(()), // Insertion was successful
            Some(_) => Err("Failed to add message to stable memory".to_string()),
        }
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
        match state
            .waitlist_data
            .insert(email.clone(), new_waitlist_entry)
        {
            None => Ok(()), // Successfully inserted
            Some(_) => Err("Already joined the Waitlist".to_string()),
        }
    });

    // Return appropriate message
    match insert_result {
        Ok(_) => Ok("Joined the waitlist successfully!".to_string()),
        Err(e) => Err(e),
    }
}

// Functions of Tetris LeaderBoard:

// Function to Start the game and transfer the tokens to the users
#[update]
async fn tetris_game_start() -> Result<String, String> {
    use num_traits::ToPrimitive;
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

    let ledger_canister_id_str = option_env!("CANISTER_ID_TEST_SIPNPLAY")
        .ok_or("Ledger canister ID not found in environment variables")?;

    let ledger_canister_id = Principal::from_text(ledger_canister_id_str)
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
        amount: Nat::from(3000000000u64), // Transfer 30 tokens
        fee: None,
        memo: None,
        created_at_time: None,
    };

    // Clone the amount field before the `call` consumes `transfer_args`
    let transfer_amount = transfer_args.amount.clone();

    // Perform the inter-canister call to transfer money
    let response: CallResult<(TransferFromResult,)> =
        call(ledger_canister_id, "icrc2_transfer_from", (transfer_args,)).await;

    match response {
        Ok((TransferFromResult::Ok(_block_index),)) => {
            // Add (caller, amount) to `tetris_data` map
            STATE.with(|state| {
                let mut state = state.borrow_mut();
                state.tetris_data.insert(
                    caller_principal.to_text(),
                    TetrisData {
                        id: caller_principal,                        // Use Principal ID
                        amount: transfer_amount.0.to_u64().unwrap(), // Convert Nat to u64
                    },
                );
            });
            Ok(format!(
                "Points deducted successfully: {}",
                transfer_amount.to_string()
            ))
        }
        Ok((TransferFromResult::Err(error),)) => Err(format!("Ledger transfer error: {:?}", error)),
        Err((code, message)) => Err(format!("Failed to call ledger: {:?} - {}", code, message)),
    }
}

// Approach 2 Insert the score when user exits then firstly remove the previous entry and then add new entry
#[update]
fn tetris_game_over(encrypted_score: String) -> Result<String, String> {

    ic_cdk::println!("tetris_game_over");
    ic_cdk::println!("Encrypted Score : {}", encrypted_score);

    let decrypted_score = decrypt_score(encrypted_score);
    ic_cdk::println!("Decrypted: {}", decrypted_score);
    
    // Parse the decrypted score
    let input_score = match decrypted_score.parse::<u32>() {
        Ok(score) => score,
        Err(e) => return Err(format!("Error parsing decrypted score: {}", e)),
    };

    ic_cdk::println!("Input Score : {}", input_score);
    
    // Only approved callers can add scores
    if !is_authenticated() {
        return Err("You are not authenticated".to_string());
    }
    // Use the caller's Principal as the player ID
    let player_id = ic_cdk::caller();

    // Update or add the player's score
    STATE.with(|state| {
        let mut state = state.borrow_mut(); // Mutably borrow the state
        let leaderboard = &mut state.tetris_leaderboard_data; // Get mutable reference to the leaderboard

        // Check if the player already exists in the leaderboard
        if leaderboard.contains_key(&player_id.to_text()) {
            // If the player exists, fetch and update the score
            let mut player_data = leaderboard.remove(&player_id.to_text()).unwrap(); // Remove existing entry

            // Update the high score
            let high_score = player_data.high_score;
            if input_score > high_score {
                player_data.high_score = input_score;
            } else {
                player_data.high_score = high_score;
            }

            // Add points
            player_data.points += input_score;

            // Re-insert the updated player data
            leaderboard.insert(player_id.to_text(), player_data);
        } else {
            // If the player doesn't exist, add them with their score
            leaderboard.insert(
                player_id.to_text(),
                TetrisLeaderboardData {
                    owner: player_id,
                    high_score: input_score,
                    points: input_score,
                },
            );
        }
    });

    Ok("Score added successfully".to_string())
}

// Reset the Tetris Leaderboard
#[update]
fn tetris_game_reset() -> Result<String, String> {
    // Check if the caller is approved
    if !is_approved() {
        return Err("You are not approved".to_string());
    }

    // Clear the leaderboard
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.tetris_leaderboard_data.clear_new();
        state.sorted_leaderboard.0.clear();
    });

    Ok("reset successful".to_string())
}

// Function for Destribution of the points to top ten players
#[ic_cdk::update]
pub async fn reward_distributionre(
    rewarded_players: Vec<RewardedPlayers>,
) -> Result<Nat, String> {
    // Check if the caller is approved
    if !is_approved() {
        return Err("You are not approved".to_string());
    }

    let ledger_canister_id_str = option_env!("CANISTER_ID_TEST_SIPNPLAY")
        .ok_or("Backend canister ID not found in environment variables")?;

    let ledger_canister_id = Principal::from_text(ledger_canister_id_str)
        .map_err(|_| "Invalid backend canister ID".to_string())?;

    // Keep track of successful transfers and errors
    let mut total_rewards_transferred = Nat::from(0u64);
 // Track total successfully transferred rewards
    let mut error_messages = Vec::new();

    // Distribute the rewards to all rewarded players one by one
    for rewarded_player in rewarded_players {
        // Create transfer arguments for each player
        let amount_as_u64 = rewarded_player.amount * 100_000_000; // Adjust for token precision
        let amount_tokens = NumTokens::from(amount_as_u64);
        let transfer_args = TransferArg {
            to: Account {
                owner: rewarded_player.owner,
                subaccount: None,
            },
            fee: None,
            memo: None,
            from_subaccount: None,
            created_at_time: None,
            amount: amount_tokens,
        };

        // Perform the inter-canister call to transfer tokens
        match ic_cdk::call::<_, (Result<Nat, String>,)>(
            ledger_canister_id,
            "icrc1_transfer",
            (transfer_args,),
        )
        .await
        {
            Ok((Ok(amount_transferred),)) => {
                total_rewards_transferred += amount_transferred;
            }
            Ok((Err(err_message),)) => {
                error_messages.push(format!(
                    "Failed for player {}: {}",
                    rewarded_player.owner, err_message
                ));
            }
            Err(err) => {
                error_messages.push(format!(
                    "Inter-canister call failed for player {}: {:?}",
                    rewarded_player.owner, err
                ));
            }
        }
    }

    // Final result based on whether there were errors
    if error_messages.is_empty() {
        Ok(total_rewards_transferred) // All transfers succeeded
    } else {
        Err(format!(
            "Some rewards distribution failed. Errors: {}",
            error_messages.join(", ")
        ))
    }
}

// Function provide the sorted data where firstly sort the data and store it into the vector & then clear all the BTreeMap and then store the data into it.
#[ic_cdk::update]
pub async fn get_crown_job_leaderboard() -> Result<String, String> {
    // Retrieve the leaderboard data and sort it
    let mut leaderboard = STATE.with(|state| {
        state
            .borrow()
            .tetris_leaderboard_data
            .iter()
            .map(|(_, data)| data.clone()) // Collect all leaderboard data
            .collect::<Vec<_>>()
    });

    // Sort the leaderboard by points in descending order
    leaderboard.sort_by(|a, b| b.points.cmp(&a.points));

    ic_cdk::println!("Sorted leaderboard data: {:#?}", leaderboard);

    // Check if the leaderboard is empty after sorting
    if leaderboard.is_empty() {
        return Err("No leaderboard data found".to_string());
    }

    // Clear the Vector sorted leaderboard
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.sorted_leaderboard.0.clear();
    });

    // Insert the sorted leaderboard data into the Vector
    let sorted_leaderboard = STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.sorted_leaderboard.0.extend(leaderboard);
    });

    ic_cdk::println!("Inserted leaderboard data: {:#?}", sorted_leaderboard);

    if !STATE.with(|state| state.borrow().sorted_leaderboard.0.is_empty()) {
        Ok("Leaderboard data has been sorted and updated successfully.".to_string())
    } else {
        Err("Leaderboard data has not been sorted and updated successfully.".to_string())
    }
}

// Add the Crown Jibob/JobSchedular which will run every 30 minutes and Provide the Sorted Data to the Leaderboard..
#[ic_cdk_macros::heartbeat]
async fn canister_heartbeat() {
    get_crown_job_leaderboard().await;
}
