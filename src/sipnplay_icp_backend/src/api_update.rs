use candid::{Nat, Principal};
use ic_cdk::api::time;
use ic_cdk::{api::call::CallResult, call, caller, update};
use ic_cdk_timers::set_timer_interval;
use icrc_ledger_types::icrc1::transfer::{NumTokens, TransferArg};
use icrc_ledger_types::{icrc1::account::Account, icrc2::transfer_from::TransferFromArgs};
use std::time::Duration;
use aes::Aes128; // AES-128 (16-byte key)
use block_modes::{BlockMode, Ecb};
use block_modes::block_padding::Pkcs7;
use base64::engine::general_purpose;
use base64::Engine;
use std::str;

use crate::api_query::{is_approved, is_authenticated};
use crate::state_handler::read_state;
use crate::{state_handler::STATE, types::BalanceOfArgs, UserCreationInput};
use crate::{
    MessageData, GameData, LeaderboardData, WaitlistData, SortedLeaderboardData, RewardedPlayers,
    TransferFromResult
};
use crate::config::SECURE_SECRET_KEY;

// Your secret key must be 16 bytes long for AES-128, so ensure it's exactly 16 bytes.
const SECRET_KEY: &[u8] = SECURE_SECRET_KEY; // 16-byte secret key for AES-128
// const SECRET_KEY: &[u8] = SECRET_KEY;

type Aes128Ecb = Ecb<Aes128, Pkcs7>;

// Decrypt function
fn decrypt_score(encrypted_score: String) -> String {
    // Decode the base64 string
    let encrypted_data = general_purpose::STANDARD.decode(&encrypted_score).expect("Failed to decode base64");
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
            Ok(format!(
                "Tokens deducted successfully: {}",
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
async fn add_money(encrypted_score: String) -> Result<String, String> {
    ic_cdk::println!("Encrypted Score : {}", encrypted_score);

    let decrypted_score = decrypt_score(encrypted_score);
    ic_cdk::println!("Decrypted: {}", decrypted_score);
    
    // Parse the decrypted score
    let amount = match decrypted_score.parse::<u32>() {
        Ok(amount) => amount,
        Err(e) => return Err(format!("Error parsing decrypted score: {}", e)),
    };

    ic_cdk::println!("Input Score : {}", amount);

    let caller_principal = caller();

    // Check if the caller exists in `user_data`
    let user_exists = read_state(|state| state.user_data.contains_key(&caller_principal));
    if !user_exists {
        return Err("User not found".to_string());
    }

    // Multiple the bet_amount by 100_000_000 to adjust for token precision
    let bet_amount = Nat::from(amount as u64) * Nat::from(100_000_000u64);
    ic_cdk::println!("Bet Amount : {}", bet_amount);
    
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
        amount: bet_amount, // Transfer the bet amount
    };

    // Perform the inter-canister call to transfer tokens
    let response: CallResult<(TransferFromResult,)> =
        ic_cdk::api::call::call(ledger_canister_id, "icrc1_transfer", (transfer_args,)).await;

    match response {
        // Successful transfer
        Ok((TransferFromResult::Ok(_block_index),)) => {
            ic_cdk::println!("Transfer successful, block index: {}", _block_index);
            Ok(format!("Points added successfully: {}", amount.to_string()))
        }
        // Transfer failed with a specific error
        Ok((TransferFromResult::Err(error),)) => Err(error.to_string()),
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
pub async fn game_start(game_name: String) -> Result<String, String> {
    let caller_principal = caller();

    // Define the amount of tokens to transfer based on the game
    let amount = if game_name == "Tetris" {
        Nat::from(3000000000u64) // 30 tokens
    } else if game_name == "Infinity Bubble" {
        Nat::from(3000000000u64) // 30 tokens
    } else {
        Nat::from(0u64)
    };

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
        amount: amount, // Transfer 30 tokens
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
                if game_name == "Tetris" {
                    // Get the game play count of tetris_data of the current principal
                    if let Some(mut data) = state.tetris_data.get(&caller_principal.to_text()) {
                        data.game_play_count += 1;
                        state.tetris_data.insert(caller_principal.to_text(), data);
                    } else {
                        // Insert a new entry if it doesn't exist
                        state.tetris_data.insert(
                            caller_principal.to_text(),
                            GameData {
                                id: caller_principal, // Use Principal ID
                                game_play_count: 1, // Game Play Count
                            },
                        );
                    }
                } else if game_name == "Infinity Bubble" {
                    // Get the game play count of infinity_bubble_data of the current principal
                    if let Some(mut data) = state.infinity_bubble_data.get(&caller_principal.to_text()) {
                        data.game_play_count += 1;
                        state.infinity_bubble_data.insert(caller_principal.to_text(), data);
                    } else {
                        // Insert a new entry if it doesn't exist
                        state.infinity_bubble_data.insert(
                            caller_principal.to_text(),
                            GameData {
                                id: caller_principal, // Use Principal ID
                                game_play_count: 1, // Game Play Count
                            },
                        );
                    }
                }                       
            });

            Ok(format!(
                "Tokens deducted successfully: {}",
                transfer_amount.to_string()
            ))
        }
        Ok((TransferFromResult::Err(error),)) => Err(format!("Ledger transfer error: {:?}", error)),
        Err((code, message)) => Err(format!("Failed to call ledger: {:?} - {}", code, message)),
    }
}

// Approach 2 Insert the score when user exits then firstly remove the previous entry and then add new entry
#[update]
pub async fn game_over(game_name: String, encrypted_score: String) -> Result<String, String> {
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

        // check the game state.
        let leaderboard = if game_name == "Tetris" {
            &mut state.tetris_leaderboard_data
        } else if game_name == "Infinity Bubble" {
            &mut state.infinity_bubble_leaderboard_data
        } else {
            return Err("Invalid game name".to_string());
        };

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
                LeaderboardData {
                    owner: player_id,
                    high_score: input_score,
                    points: input_score,
                },
            );
        }
        Ok(())
    })?;

    Ok("Score added successfully".to_string())
}

// Reset the Tetris Leaderboard
#[update]
pub async fn game_reset(game_name: String) -> Result<String, String> {
    // Check if the caller is approved
    if !is_approved() {
        return Err("You are not approved".to_string());
    }

    // Clear the leaderboard
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        if game_name == "Tetris" {
            state.tetris_leaderboard_data.clear_new();
            while state.tetris_sorted_leaderboard_data.pop().is_some() {}
        } else if game_name == "Infinity Bubble" {
            state.infinity_bubble_leaderboard_data.clear_new();
            while state.infinity_bubble_sorted_leaderboard_data.pop().is_some() {}
        } 
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

// Function to get the Crown Job Leaderboard
pub async fn get_crown_job_leaderboard() {
    // Retrieve the leaderboard data from the BTreeMap
    let mut tetris_leaderboard = STATE.with(|state| {
        state
            .borrow()
            .tetris_leaderboard_data
            .iter()
            .map(|(_, data)| data.clone())
            .collect::<Vec<_>>()
    });

    let mut infinity_bubble_leaderboard = STATE.with(|state| {
        state
            .borrow()
            .infinity_bubble_leaderboard_data
            .iter()
            .map(|(_, data)| data.clone())
            .collect::<Vec<_>>()
    });

    // Sort the leaderboard by points in descending order
    tetris_leaderboard.sort_by(|a, b| b.points.cmp(&a.points));
    ic_cdk::println!("Sorted Tetris Leaderboard data: {:#?}", tetris_leaderboard);

    infinity_bubble_leaderboard.sort_by(|a, b| b.points.cmp(&a.points));
    ic_cdk::println!("Sorted Infinity Bubble Leaderboard data: {:#?}", infinity_bubble_leaderboard);

    // Clear all elements from the StableVec manually by popping each one
    STATE.with(|state| {
        let state = state.borrow_mut();
        // while state.sorted_leaderboard_data.pop().is_some() {}
        while let Some(_) = state.tetris_sorted_leaderboard_data.pop() {}
    });

    STATE.with(|state| {
        let state = state.borrow_mut();
        // while state.sorted_leaderboard_data.pop().is_some() {}
        while let Some(_) = state.infinity_bubble_sorted_leaderboard_data.pop() {}
    });

    // Insert sorted data into the StableVec
    STATE.with(|state| {
        let state = state.borrow_mut();
        for data in tetris_leaderboard {
            // Convert TetrisLeaderboardData to SortedLeaderboardData, if needed
            let sorted_data = SortedLeaderboardData {
                owner: data.owner,
                high_score: data.high_score,
                points: data.points,
            };

            state
                .tetris_sorted_leaderboard_data
                .push(&sorted_data)
                .expect("Failed to push data into StableVec");
        }
    });
  
    STATE.with(|state| {
        let state = state.borrow_mut();
        for data in infinity_bubble_leaderboard {
            // Convert TetrisLeaderboardData to SortedLeaderboardData, if needed
            let sorted_data = SortedLeaderboardData {
                owner: data.owner,
                high_score: data.high_score,
                points: data.points,
            };

            state
                .infinity_bubble_sorted_leaderboard_data
                .push(&sorted_data)
                .expect("Failed to push data into StableVec");
        }
    });

    ic_cdk::println!("Inserted sorted leaderboard data into StableVec.");
}

// Add the Crown Jibob/JobSchedular which will run every 30 minutes and Provide the Sorted Data to the Leaderboard..
#[ic_cdk::post_upgrade]
pub async fn start_tetris_leaderboard_update() {
    set_timer_interval(Duration::from_secs(60), || {
        ic_cdk::spawn(async {
            // This callback will run every minute (60 seconds).
            get_crown_job_leaderboard().await;
        });
    });
}


// // Benchmark example
// #[cfg(feature = "canbench-rs")]
// mod benches {
//     use super::*;
//     use canbench_rs::bench;
//     use ic_cdk::api::stable::StableMemory;
//     use std::time::{Duration, Instant};

//     #[bench]
//     async fn bench_get_crown_job_leaderboard() {
//         // Start benchmarking memory usage (approximating)
//         let memory_before = STATE.with(|state| state.borrow().sorted_leaderboard_data.len());

//         // Measure execution time
//         let start_time = Instant::now();
//         get_crown_job_leaderboard().await;
//         let duration = start_time.elapsed();

//         // Measure memory after
//         let memory_after = STATE.with(|state| state.borrow().sorted_leaderboard_data.len());

//         // Log results
//         ic_cdk::println!("Benchmark completed.");
//         ic_cdk::println!("Execution time: {:?}", duration);
//         ic_cdk::println!(
//             "Memory usage: {} items before, {} items after",
//             memory_before,
//             memory_after
//         );
//     }
// }