use ic_cdk::export_candid;
use candid::Nat;
use candid::Principal;
// use tokio::time::{sleep, Duration};

use crate::types::*;
// use crate::api_query::get_tetris_leaderboard;

mod api_update;
mod types;
mod api_query;
mod state_handler;

// // Automatically change the Leaderboard after 7 days.
// async fn auto_update_leaderboard() {
//     get_tetris_leaderboard();
// }

// #[tokio::main]
// async fn main() {
//     let interval_duration = Duration::from_days(7); // Set the interval to 5 seconds

//     loop {
//         auto_update_leaderboard().await; // Call the function
//         sleep(interval_duration).await; // Wait for the defined interval (5 seconds)
//     }
// }

export_candid!();