use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, Storable};
use ic_stable_structures::StableBTreeMap;
use candid::{Decode, Encode, Principal};
use std::cell::RefCell;
use std::borrow::Cow;

use crate::types::*;

// Define Memory Types
type Memory = VirtualMemory<DefaultMemoryImpl>;
type BlackjackBetMap = StableBTreeMap<Principal, BlackjackData, Memory>; // Map Principal to UserData
type UserDataMap= StableBTreeMap<Principal, UserCreationInput, Memory>; // Map Principal to Elem
type MessageDataMap = StableBTreeMap<String, MessageData, Memory>; // Map String to MessageData
type WaitlistDataMap = StableBTreeMap<String, WaitlistData, Memory>; // Map String to WaitlistData

// Memory IDs for stable storage
const USER_DATA_MEMORY_ID: MemoryId = MemoryId::new(0);
const BLACKJACK_BET_MEMORY_ID: MemoryId = MemoryId::new(1);
const MESSAGE_DATA_MEMORY_ID: MemoryId = MemoryId::new(2);
const WAITLIST_DATA_MEMORY_ID: MemoryId = MemoryId::new(3);

// Thread-local state
thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    pub static STATE: RefCell<State> = RefCell::new(
        MEMORY_MANAGER.with(|mm| State {
            user_data: UserDataMap::init(mm.borrow().get(USER_DATA_MEMORY_ID)),
            blackjack_bet: BlackjackBetMap::init(mm.borrow().get(BLACKJACK_BET_MEMORY_ID)),
            message_data: MessageDataMap::init(mm.borrow().get(MESSAGE_DATA_MEMORY_ID)),
            waitlist_data: WaitlistDataMap::init(mm.borrow().get(WAITLIST_DATA_MEMORY_ID)),
        })
    );
}

// State to manage all maps
pub struct State {
    pub user_data: UserDataMap,
    pub blackjack_bet: BlackjackBetMap,
    pub message_data: MessageDataMap,
    pub waitlist_data: WaitlistDataMap,
}

// Implement Storable for UserData
impl Storable for BlackjackData {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
}

// Implement Storable for Elem
impl Storable for UserCreationInput {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
}

// Implement Storable for MessageData
impl Storable for MessageData {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
}

// Implement Storable for WaitlistData
impl Storable for WaitlistData {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
}

// Initialize memory for each map
pub fn init_user_data_map() -> UserDataMap {
    MEMORY_MANAGER.with(|mm| UserDataMap::init(mm.borrow().get(USER_DATA_MEMORY_ID)))
}

pub fn init_blackjack_bet_map() -> BlackjackBetMap {
    MEMORY_MANAGER.with(|mm| BlackjackBetMap::init(mm.borrow().get(BLACKJACK_BET_MEMORY_ID)))
}

pub fn init_message_data_map() -> MessageDataMap {
    MEMORY_MANAGER.with(|mm| MessageDataMap::init(mm.borrow().get(MESSAGE_DATA_MEMORY_ID)))
}

pub fn init_waitlist_data_map() -> WaitlistDataMap {
    MEMORY_MANAGER.with(|mm| WaitlistDataMap::init(mm.borrow().get(WAITLIST_DATA_MEMORY_ID)))
}

// State initialization
#[ic_cdk::init]
fn init() {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.user_data = init_user_data_map();
        state.blackjack_bet = init_blackjack_bet_map();
        state.message_data = init_message_data_map();
        state.waitlist_data = init_waitlist_data_map();
    });
}