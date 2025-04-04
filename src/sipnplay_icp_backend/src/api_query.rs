use candid::{Nat, Principal};
use ic_cdk::{caller, query};
use num_traits::ToPrimitive;

use crate::{
    state_handler::STATE, types::{MessageData, PaginatedResult, SortedLeaderboardData, UserCreationInput}, GameData, LeaderboardData, WaitlistData
};

const APPROVED_PRINCIPALS: &[&str] = &[
    "oxj2h-r6fbj-hqtcn-fv7ye-yneeb-ca3se-c6s42-imvp7-juu33-ovnix-mae", // Paras
    "wbrxn-i57lw-zrazv-y3lr6-vh4od-cqtc2-kvz6z-54vwx-og5bv-54j2r-jae", //Paras ii
    "42l52-e6bwv-2353f-idnxh-5f42y-catp6-j2yxn-msivr-ljpu2-ifqsy-dqe", // Ankur
    "n5ytn-hebsc-fbio3-ll5ed-ermti-6kvdk-sjp4d-pofnb-66xhd-gpj4t-3qe", // Tushar Jain's Plug
    "2xtmc-5eo2k-c5422-e3fih-uyjbn-fiefs-u72o7-xgn4m-kveqk-7unet-3qe", // Chandan sir's plug
    "4hsxq-rcsvl-rw2wr-5i5ha-gttgh-ekyeu-wsawq-2tuib-2hyul-7hpzc-zqe", // Somiya Behera's Plug
    "ld4p7-wr47n-c4du2-g2brs-l3ueh-waqi3-m36uj-wkzzn-gpxm3-5yym7-qqe", // Somiya Behera's ICP
    "57sj2-6uilb-7r5ib-xxfdu-24nn5-ievyg-w3xp2-j5hpq-5esuf-pslkd-fae", // Toshak 
    "3wrby-heoyj-sjyol-ndjy6-qhq25-nzyph-aynog-hrwww-6ayt7-bhoed-qqe",  // Harshya
    "pifhp-4nwkv-kjc2z-3332j-3mhuv-zakyt-3sopr-alosa-bsgrl-auadn-jae" // Test Admin
];

// Function to check if the caller is approved
#[ic_cdk::query]
pub fn is_approved() -> bool {
    let caller_principal = caller();
    APPROVED_PRINCIPALS
        .iter()
        .any(|&approved| Principal::from_text(approved).unwrap() == caller_principal)
}

// Authenticate the logged-in user
#[ic_cdk::query]
pub fn is_authenticated() -> bool {
    STATE.with(|state| {
        let state = state.borrow();
        state.user_data.contains_key(&caller())
    })
}

// Get the user
#[ic_cdk::query]
pub fn get_user() -> Result<UserCreationInput, String> {
    let caller = ic_cdk::caller();
    STATE.with(|state| {
        let state = state.borrow();
        if let Some(user_data) = state.user_data.get(&caller) {
            Ok(user_data)
        } else {
            Err("New user".to_string())
        }
    })
}

// Get all users
#[ic_cdk::query]
pub fn get_all_users() -> Result<Vec<UserCreationInput>, String> {
    if !is_approved() {
        return Err("You are not approved".to_string());
    }

    let users: Vec<UserCreationInput> = STATE.with(|state| {
        state
            .borrow()
            .user_data
            .iter()
            .map(|(_, data)| data.clone())
            .collect()
    });

    if users.is_empty() {
        return Err("No users found".to_string());
    }

    Ok(users)
}

// Get the messages
#[ic_cdk::query]
fn get_messages(page_no: Nat, chunk_size: Nat) -> Result<PaginatedResult<MessageData>, String> {
    if !is_approved() {
        return Err("You are not approved".to_string());
    }

    // Access the `message_data` map
    let entries: Vec<(String, MessageData)> = STATE.with(|state| {
        state
            .borrow()
            .message_data
            .iter()
            .map(|(email, data)| (email.clone(), data.clone()))
            .collect()
    });

    if entries.is_empty() {
        return Err("No messages found".to_string());
    }

    // Convert `Nat` to `usize`
    let chunk_size_usize = chunk_size
        .0
        .to_usize()
        .ok_or("Chunk size is too large for usize")?;
    let page_no_usize = page_no
        .0
        .to_usize()
        .ok_or("Page number is too large for usize")?;

    // Calculate total pages
    let total_pages = (entries.len() + chunk_size_usize - 1) / chunk_size_usize;
    if page_no_usize >= total_pages {
        return Err("Page not found".to_string());
    }

    // Paginate the data
    let start_index = page_no_usize * chunk_size_usize;
    let end_index = (start_index + chunk_size_usize).min(entries.len());

    let paginated_data = entries[start_index..end_index]
        .iter()
        .map(|(_, data)| data.clone())
        .collect::<Vec<_>>();

    // Return the paginated result
    Ok(PaginatedResult {
        data: paginated_data,
        current_page: Nat::from(page_no_usize + 1),
        total_pages: Nat::from(total_pages),
    })
}

// Get the waitlist
#[query]
fn get_waitlist(page_no: Nat, chunk_size: Nat) -> Result<PaginatedResult<WaitlistData>, String> {
    use num_traits::ToPrimitive; // Import the ToPrimitive trait

    // Check if the caller is approved
    if !is_approved() {
        return Err("You are not approved".to_string());
    }

    // Access the `waitlist_data` map
    let entries: Vec<(String, WaitlistData)> = STATE.with(|state| {
        state
            .borrow()
            .waitlist_data
            .iter()
            .map(|(email, data)| (email.clone(), data.clone()))
            .collect()
    });

    // Check for empty data
    if entries.is_empty() {
        return Err("No members found".to_string());
    }

    // Convert `Nat` to `usize` using `ToPrimitive`
    let chunk_size_usize = chunk_size
        .0
        .to_usize()
        .ok_or("Chunk size is too large for usize")?;
    let page_no_usize = page_no
        .0
        .to_usize()
        .ok_or("Page number is too large for usize")?;

    // Calculate total pages
    let total_pages = (entries.len() + chunk_size_usize - 1) / chunk_size_usize;
    if page_no_usize >= total_pages {
        return Err("Page not found".to_string());
    }

    // Paginate the data
    let start_index = page_no_usize * chunk_size_usize;
    let end_index = (start_index + chunk_size_usize).min(entries.len());

    let paginated_data = entries[start_index..end_index]
        .iter()
        .map(|(_, data)| data.clone().into())
        .collect::<Vec<_>>();

    // Return the paginated result
    Ok(PaginatedResult {
        data: paginated_data,
        current_page: Nat::from(page_no_usize + 1),
        total_pages: Nat::from(total_pages),
    })
}

// Get the Tetris LeaderBoard Details All users with logged in user rank.
#[ic_cdk::query]
pub fn get_leaderboard(game_name: String) -> (Result<Vec<SortedLeaderboardData>, String>, Nat) {
    ic_cdk::println!("Game Name: {}", game_name);
    // Access the state and clone the leaderboard data
    let leaderboard: Vec<SortedLeaderboardData> = STATE.with(|state| {
        if game_name == "Tetris" {
            state
                .borrow()
                .tetris_sorted_leaderboard_data
                .iter()
                .map(|data| data.clone().into())
                .collect()
        } else if game_name == "Infinity Bubble" {
           state
                .borrow()
                .infinity_bubble_sorted_leaderboard_data
                .iter()
                .map(|data| data.clone().into())
                .collect()
        } else if game_name == "Block Tap" {
            state
                .borrow()
                .block_tap_sorted_leaderboard_data
                .iter()
                .map(|data| data.clone().into())
                .collect()
        }else {
            Vec::new()
        }
    });

    // Check if the leaderboard is empty
    if leaderboard.is_empty() {
        return (Err("Leaderboard is empty".to_string()), Nat::from(0u32));
    }

    // Get the logged-in Principal
    let principal = caller();
    let mut user_rank = Nat::from(0u32); // Default to 0 if the user is not in the leaderboard

    // Find the rank of the logged-in user
    if let Some(index) = leaderboard.iter().position(|data| data.owner == principal) {
        user_rank = Nat::from(index as u32 + 1); // 1-based rank
        println!("Logged-in user found at rank {}", user_rank);
    } else {
        println!("Logged-in user not found in the leaderboard");
    }

    // Return the leaderboard and user rank
    (Ok(leaderboard), user_rank)
}

// Get the Logged-in User LeaderBoard Details
#[ic_cdk::query]
pub fn get_logged_in_user_leaderboard(game_name: String) -> Result<LeaderboardData, String> {
    let principal = caller();

    // Retrieve the leaderboard data for the logged-in user
    let leaderboard = STATE.with(|state| {
        if game_name == "Tetris" {
            state
                .borrow()
                .tetris_leaderboard_data
                .get(&principal.to_text())
                .map(|data| data.clone()) // Use map to clone the data if it exists
        } else if game_name == "Infinity Bubble" {
            state
                .borrow()
                .infinity_bubble_leaderboard_data
                .get(&principal.to_text())
                .map(|data| data.clone()) // Use map to clone the data if it exists
        } else if game_name == "Block Tap" {
            state
                .borrow()
                .block_tap_leaderboard_data
                .get(&principal.to_text())
                .map(|data| data.clone()) // Use map to clone the data if it exists    
        } else {
            None
        }
    });
    
    // Return the result or an error message
    if let Some(data) = leaderboard {
        Ok(data) // Return the leaderboard data if it exists
    } else {
        Err("Logged-in user not found in the leaderboard".to_string())
    }
}

// Get the User High Score
#[ic_cdk::query]
pub fn get_high_score(game_name: String) -> Result<String, String> {
    // Get the Principal
    let princial = caller();

    // Retrieve the high score
    let high_score: Option<String> = STATE.with(|state| {
        if game_name == "Tetris" {
        state
            .borrow()
            .tetris_leaderboard_data
            .get(&princial.to_text())
            .map(|data| data.high_score.to_string())
        } else if game_name == "Infinity Bubble" {
        state
            .borrow()
            .infinity_bubble_leaderboard_data
            .get(&princial.to_text())
            .map(|data| data.high_score.to_string())
        } else if game_name == "Block Tap" {
        state
            .borrow()
            .block_tap_leaderboard_data
            .get(&princial.to_text())
            .map(|data| data.high_score.to_string())
        }else {
            None
        }
    });

    // Return the high score or an error message
    match high_score {
        Some(high_score) => Ok(high_score),
        None => Err("No high score found".to_string()),
    }
}

// Get the Top 10 Players
#[ic_cdk::query]
pub fn get_top_ten_players(game_name: String) -> Result<Vec<LeaderboardData>, String> {
    // Check the Approval request raised on Admin Authority
    if !is_approved() {
        return Err("You are not approved".to_string());
    }

    let mut leaderboard = STATE.with(|state| {
        if game_name == "Tetris" {
            state
                .borrow()
                .tetris_leaderboard_data
                .iter()
                .map(|(_, data)| data.clone()) // Collect all leaderboard data
                .collect::<Vec<_>>()
        } else if game_name == "Infinity Bubble" {
            state
                .borrow()
                .infinity_bubble_leaderboard_data
                .iter()
                .map(|(_, data)| data.clone()) // Collect all leaderboard data
                .collect::<Vec<_>>()
        } else if game_name == "Block Tap" {
            state
                .borrow()
                .block_tap_leaderboard_data
                .iter()
                .map(|(_, data)| data.clone()) // Collect all leaderboard data
                .collect::<Vec<_>>()
        } else {
            Vec::new()
        }
    });

    if leaderboard.len() == 0 {
        return Err("No data found".to_string());
    }

    // Sort the leaderboard by points in descending order
    leaderboard.sort_by(|a, b| b.points.cmp(&a.points));

    if leaderboard.len() > 10 {
        leaderboard = (&leaderboard[0..10]).to_vec();
    }

    Ok(leaderboard)
}

// Get Current Principal
#[ic_cdk::query]
pub fn get_current_principal() -> String {
    // Return the principal as a string
    caller().to_text() // No semicolon here, so it returns the value
}

#[ic_cdk::query]
pub fn get_game_data(game_name: String) -> Result<Vec<GameData>, String>{
    // check the approval request
    if !is_approved() {
        return Err("You are not approved".to_string());
    }
    if game_name == "Tetris" {
        let tetris_data: Vec<GameData> = STATE.with(|state| {
            state
                .borrow()
                .tetris_data
                .iter()
                .map(|(_, data)| data.clone())
                .collect()
        });
        Ok(tetris_data)
    } else if game_name == "Infinity Bubble" {
        let infinity_bubble_data: Vec<GameData> = STATE.with(|state| {
            state
                .borrow()
                .infinity_bubble_data
                .iter()
                .map(|(_, data)| data.clone())
                .collect()
        });
        Ok(infinity_bubble_data)
    } else if game_name == "Block Tap" {
        let block_tap_data: Vec<GameData> = STATE.with(|state| {
            state
                .borrow()
                .block_tap_data
                .iter()
                .map(|(_, data)| data.clone())
                .collect()
        });
        Ok(block_tap_data)
    } else {
        Err("No data found".to_string())
    }
}
