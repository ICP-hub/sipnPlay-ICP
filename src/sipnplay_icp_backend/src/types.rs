use candid::{CandidType, Nat, Principal};
use icrc_ledger_types::icrc2::transfer_from::TransferFromError;
use serde::{Deserialize, Serialize};

#[derive(CandidType, Deserialize)]
pub struct BalanceOfArgs {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>,
}

// UserCreationInput struct
#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct UserCreationInput {
    pub id: Principal,
    pub email: String,
}

#[derive(CandidType, Deserialize, Debug)]
pub enum TransferFromResult {
    Ok(Nat),
    Err(TransferFromError),
}

#[derive(Debug, Clone, CandidType, Serialize, Deserialize)]
pub struct PaginatedResult<T> {
    pub data: Vec<T>,
    pub current_page: Nat,
    pub total_pages: Nat,
}

#[derive(CandidType, Deserialize)]
pub struct TransferArgs {
    pub to: TransferAccount,
    pub fee: Option<u64>,
    pub spender_subaccount: Option<Vec<u8>>,
    pub memo: Option<Vec<u8>>,
    pub created_at_time: Option<u64>,
    pub amount: Nat,
}

#[derive(CandidType, Deserialize)]
pub struct TransferAccount {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>,
}

// MessageData struct
#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct MessageData {
    pub date: i64,
    pub name: String,
    pub email: String,
    pub message: String,
}

// WaitlistData struct
#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct WaitlistData {
    pub date: i64,
    pub name: String,
    pub email: String,
    pub icp_address: String,
}

// GameData struct
#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct GameData {
    pub id: Principal,
    pub game_play_count: u32,
}

// Leaderboard struct for All Games
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct LeaderboardData {
    pub owner: Principal,
    pub high_score: u32,
    pub points: u32,
}

// Sorted Leaderboard struct
#[derive(CandidType, Deserialize, Serialize, Clone, Debug)]
pub struct SortedLeaderboardData {
    pub owner: Principal,
    pub high_score: u32,
    pub points: u32,
}


#[derive(CandidType, Deserialize, Clone, Debug)]
pub struct RewardedPlayers {
    pub owner: Principal,
    pub amount: u64,
}

