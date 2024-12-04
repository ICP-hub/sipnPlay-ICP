use candid::Nat;
use ic_cdk::export_candid;

use crate::types::*;

// mod config;
mod api_query;
mod api_update;
mod state_handler;
mod types;

export_candid!();
