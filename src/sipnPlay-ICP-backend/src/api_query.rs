const APPROVED_PRINCIPALS: &[&str] = &[
    "oxj2h-r6fbj-hqtcn-fv7ye-yneeb-ca3se-c6s42-imvp7-juu33-ovnix-mae", // Paras
    "42l52-e6bwv-2353f-idnxh-5f42y-catp6-j2yxn-msivr-ljpu2-ifqsy-dqe", // Ankur
    "n5ytn-hebsc-fbio3-ll5ed-ermti-6kvdk-sjp4d-pofnb-66xhd-gpj4t-3qe", // Tushar Jain's Plug
    "hc4gt-vtazq-2beqs-7lv5p-4nezq-wl3hs-fojqx-2iwtc-mpxx6-ggswf-7ae", // Tushar Jain's II
    "myjdw-wngdd-bzyo5-qjwgx-d3flt-pijev-3kjub-o6min-lzsty-hnhqf-mae",
    "2nh3q-od732-potbk-gs2yh-nkqyt-i4xtt-fs73b-iirbu-ows4f-glqf5-qae", // Somiya Behera
];

pub const CUSTOM_LEDGER: &str = "cjpyu-kqaaa-aaaap-qhyfq-cai";

pub const PAYMENT_ADDRESS: Principal = Principal::from_text("ent7t-2yaaa-aaaap-qhtcq-cai").unwrap();

// Function to check if the caller is approved
#[ic_cdk_macros::query]
pub fn is_approved() -> bool {
    let caller_principal = caller(); 
    APPROVED_PRINCIPALS
        .iter()
        .any(|&approved| Principal::from_text(approved).unwrap() == caller_principal)
}

#[query]
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

#[query]
async fn get_messages(chunk_size: Nat, page_no: Nat) -> Result<PaginatedResult<MessageData>, String> {
    let caller_principal = caller();

    // Check if the caller is approved
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

    // Check for empty data
    if entries.is_empty() {
        return Err("No messages found".to_string());
    }

    // Paginate the data
    let total_pages = (entries.len() as u64 + chunk_size.0 - 1) / chunk_size.0;
    let total_pages_nat = Nat::from(total_pages);

    if page_no.0 >= total_pages {
        return Err("Page not found".to_string());
    }

    let start_index = (page_no.0 * chunk_size.0) as usize;
    let end_index = ((start_index as u64 + chunk_size.0).min(entries.len() as u64)) as usize;

    let paginated_data = entries[start_index..end_index]
        .iter()
        .map(|(_, data)| data.clone())
        .collect::<Vec<_>>();

    // Return the paginated result
    Ok(PaginatedResult {
        data: paginated_data,
        current_page: page_no.clone() + Nat::from(1),
        total_pages: total_pages_nat,
    })
}

#[query]
fn get_blackjack_bet() -> Result<BlackjackData, String> {
    let caller_principal = caller();

    // Access the blackjack_bet map and find the record for the caller
    let bet_data = STATE.with(|state| {
        state
            .borrow()
            .blackjack_bet
            .get(&caller_principal)
            .cloned()
    });

    // Return the result or an error message
    match bet_data {
        Some(data) => Ok(data),
        None => Err("Caller not found in the blackjack bet record".to_string()),
    }
}

#[query]
async fn get_waitlist(chunk_size: Nat, page_no: Nat) -> Result<PaginatedResult<WaitlistData>, String> {
    let caller_principal = caller();

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

    // Paginate the data
    let total_pages = (entries.len() as u64 + chunk_size.0 - 1) / chunk_size.0;
    let total_pages_nat = Nat::from(total_pages);

    if page_no.0 >= total_pages {
        return Err("Page not found".to_string());
    }

    let start_index = (page_no.0 * chunk_size.0) as usize;
    let end_index = ((start_index as u64 + chunk_size.0).min(entries.len() as u64)) as usize;

    let paginated_data = entries[start_index..end_index]
        .iter()
        .map(|(_, data)| data.clone())
        .collect::<Vec<_>>();

    // Return the paginated result
    Ok(PaginatedResult {
        data: paginated_data,
        current_page: page_no.clone() + Nat::from(1),
        total_pages: total_pages_nat,
    })
}