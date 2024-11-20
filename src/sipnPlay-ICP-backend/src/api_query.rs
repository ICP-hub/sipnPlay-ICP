use std::env;

use candid::{CandidType, Principal};
use ic_cdk::{caller, update};
use serde::Deserialize;
use dotenv::dotenv;


#[derive(CandidType, Deserialize)]
struct BalanceOfArgs {
    owner: Principal,
    subaccount: Option<Vec<u8>>, // Still optional, will be None.
}

#[update]
pub async fn get_balance() -> Result<u128, String> {
    dotenv().ok(); // Load .env file
    let ledger_canister_id = env::var("CANISTER_ID_TEST_SIPNPLAY").map_err(|_| {
        "Environment variable `CANISTER_ID_TEST_SIPNPLAY` not found".to_string()
    })?;

    let caller_principal = caller(); // Get the caller's principal

    let args = BalanceOfArgs {
        owner: caller_principal,
        subaccount: None,
    };

    // Adjust the expected return type to match the ledger's output
    match ic_cdk::api::call::call::<_, (u128,)>(Principal::from_text(&ledger_canister_id).unwrap(), "icrc1_balance_of", (args,)).await {
        Ok((balance,)) => Ok(balance),
        Err(e) => Err(format!("Failed to fetch balance: {:?}", e))
    }
}