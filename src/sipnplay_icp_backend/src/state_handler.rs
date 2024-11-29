use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, Storable};
use ic_stable_structures::StableBTreeMap;
use candid::{Decode, Encode, Principal};
use std::cell::RefCell;
use std::borrow::Cow;

use crate::types::*;
use crate::api_update::start_tetris_leaderboard_update;

// Define Memory Types
pub type Memory = VirtualMemory<DefaultMemoryImpl>;
pub type BlackjackBetMap = StableBTreeMap<Principal, BlackjackData, Memory>;
pub type UserDataMap = StableBTreeMap<Principal, UserCreationInput, Memory>;
pub type MessageDataMap = StableBTreeMap<String, MessageData, Memory>;
pub type WaitlistDataMap = StableBTreeMap<String, WaitlistData, Memory>;
pub type TetrisDataMap = StableBTreeMap<String, TetrisData, Memory>;
pub type TetrisLeaderboadDataMap =  StableBTreeMap<String, TetrisLeaderboardData, Memory>;
pub struct SortedLeaderboard(pub Vec<TetrisLeaderboardData>);

// Memory IDs for stable storage
const USER_DATA_MEMORY_ID: MemoryId = MemoryId::new(0);
const BLACKJACK_BET_MEMORY_ID: MemoryId = MemoryId::new(1);
const MESSAGE_DATA_MEMORY_ID: MemoryId = MemoryId::new(2);
const WAITLIST_DATA_MEMORY_ID: MemoryId = MemoryId::new(3);
const TETRIS_LEADERBOARD_DATA_MEMORY_ID: MemoryId = MemoryId::new(4);
const TETRIS_DATA_MEMORY_ID: MemoryId = MemoryId::new(5);

// Thread-local memory manager
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
            tetris_leaderboard_data: TetrisLeaderboadDataMap::init(mm.borrow().get(TETRIS_LEADERBOARD_DATA_MEMORY_ID)),
            tetris_data: TetrisDataMap::init(mm.borrow().get(TETRIS_DATA_MEMORY_ID)),
            sorted_leaderboard: SortedLeaderboard(Vec::new())
        })
    );
}

// State to manage all maps
pub struct State {
    pub user_data: UserDataMap,
    pub blackjack_bet: BlackjackBetMap,
    pub message_data: MessageDataMap,
    pub waitlist_data: WaitlistDataMap,
    pub tetris_leaderboard_data: TetrisLeaderboadDataMap,
    pub tetris_data: TetrisDataMap,
    pub sorted_leaderboard: SortedLeaderboard
}

// State Initialization
#[ic_cdk::init]
fn init() {
    STATE.with(|state| {
        let mut state = state.borrow_mut();
        state.user_data = init_user_data_map();
        state.blackjack_bet = init_blackjack_bet_map();
        state.message_data = init_message_data_map();
        state.waitlist_data = init_waitlist_data_map();
        state.tetris_leaderboard_data = init_tetris_leaderboard_data_map();
        state.tetris_data = init_tetris_data_map();
        state.sorted_leaderboard = init_sorted_leaderboard();
    });

    // Start Tetris Leaderboard Update Call
    ic_cdk::spawn(async {
        start_tetris_leaderboard_update().await;
    });
}

// Initialize each map
pub fn init_user_data_map() -> UserDataMap {
    UserDataMap::init(get_user_data_memory())
}

pub fn init_blackjack_bet_map() -> BlackjackBetMap {
    BlackjackBetMap::init(get_blackjack_bet_memory())
}

pub fn init_message_data_map() -> MessageDataMap {
    MessageDataMap::init(get_message_data_memory())
}

pub fn init_waitlist_data_map() -> WaitlistDataMap {
    WaitlistDataMap::init(get_waitlist_data_memory())
}

pub fn init_tetris_leaderboard_data_map() -> TetrisLeaderboadDataMap {
    TetrisLeaderboadDataMap::init(get_tetris_leaderboard_data_memory())
}

pub fn init_tetris_data_map() -> TetrisDataMap {
    TetrisDataMap::init(get_tetris_data_memory())
}

// Initialize the sorted leaderboard in the state
pub fn init_sorted_leaderboard() -> SortedLeaderboard {
    SortedLeaderboard(Vec::new())
}

// Memory accessors
pub fn get_user_data_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(USER_DATA_MEMORY_ID))
}

pub fn get_blackjack_bet_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(BLACKJACK_BET_MEMORY_ID))
}

pub fn get_message_data_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(MESSAGE_DATA_MEMORY_ID))
}

pub fn get_waitlist_data_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(WAITLIST_DATA_MEMORY_ID))
}

pub fn get_tetris_leaderboard_data_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(TETRIS_LEADERBOARD_DATA_MEMORY_ID))
}

pub fn get_tetris_data_memory() -> Memory {
    MEMORY_MANAGER.with(|m| m.borrow().get(TETRIS_DATA_MEMORY_ID))
}

// Helper functions for state read/mutation
pub fn read_state<R>(f: impl FnOnce(&State) -> R) -> R {
    STATE.with(|cell| f(&cell.borrow()))
}

pub fn mutate_state<R>(f: impl FnOnce(&mut State) -> R) -> R {
    STATE.with(|cell| f(&mut cell.borrow_mut()))
}

// Implement Storable for BlackjackData
impl Storable for BlackjackData {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
}

// Implement Storable for UserCreationInput
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

// Implement Storable for TetrisLeaderboard
impl Storable for TetrisLeaderboardData {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }
    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
}

// Implement Storable for TetrisData
impl Storable for TetrisData {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }
    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: ic_stable_structures::storable::Bound = ic_stable_structures::storable::Bound::Unbounded;
}

// Implement Storable for SortedLeaderboard
impl Storable for SortedLeaderboard {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(&self.0).unwrap()) // Serialize inner Vec
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        SortedLeaderboard(Decode!(bytes.as_ref(), Vec<TetrisLeaderboardData>).unwrap()) // Deserialize into Vec
    }

    const BOUND: ic_stable_structures::storable::Bound =
        ic_stable_structures::storable::Bound::Unbounded;
}