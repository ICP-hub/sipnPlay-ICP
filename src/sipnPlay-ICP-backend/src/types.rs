use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Deserialize)]
pub struct BalanceOfArgs {
    pub owner: Principal,
    pub subaccount: Option<Vec<u8>>, 
}

#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct BlackjackData {
    pub id: Principal,
    pub amount:u64,
}

// UserCreationInput struct
#[derive(CandidType, Deserialize, Serialize, Debug, Clone)]
pub struct UserCreationInput {
    pub id: Principal,
    pub email: String,
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

#[derive(Debug, Clone)]
pub struct PaginatedResult<T> {
    pub data: Vec<T>,
    pub current_page: Nat,
    pub total_pages: Nat,
}