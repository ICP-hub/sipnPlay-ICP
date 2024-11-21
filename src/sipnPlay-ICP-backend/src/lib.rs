use ic_cdk::export_candid;
use candid::Nat;
use candid::Principal;
use crate::types::*;

mod api_update;
mod types;
mod api_query;
mod state_handler;



export_candid!();