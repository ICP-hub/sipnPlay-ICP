set -a
source .env
set +a


export PRE_MINTED_TOKENS=100000000000000

export DEFAULT=33sjo-rytgq-qwn6x-tevi6-zc2a3-ogpi2-23xiz-3k7ih-rkjif-xwrpy-aqe

export TRANSFER_FEE=0

# dfx identity new archive_controller
dfx identity use archive_controller
export ARCHIVE_CONTROLLER=$(dfx identity get-principal)

export TRIGGER_THRESHOLD=2000

export CYCLE_FOR_ARCHIVE_CREATION=10000000000000

export NUM_OF_BLOCK_TO_ARCHIVE=1000

export TOKEN_NAME="Test Token"

export TOKEN_SYMBOL="TSIP"

# dfx identity new minter
dfx identity use minter
export MINTER=$(dfx identity get-principal)

export FEATURE_FLAGS=true

dfx identity use default

dfx deploy test_sipnplay --argument "(variant {Init =
record {
     token_symbol = \"${TOKEN_SYMBOL}\";
     token_name = \"${TOKEN_NAME}\";
     minting_account = record { owner = principal \"${MINTER}\" };
     transfer_fee = ${TRANSFER_FEE};
     metadata = vec {};
     feature_flags = opt record{icrc2 = ${FEATURE_FLAGS}};
     initial_balances = vec { record { record { owner = principal \"${DEFAULT}\"; }; ${PRE_MINTED_TOKENS}; }; };
     archive_options = record {
         num_blocks_to_archive = ${NUM_OF_BLOCK_TO_ARCHIVE};
         trigger_threshold = ${TRIGGER_THRESHOLD};
         controller_id = principal \"${ARCHIVE_CONTROLLER}\";
         cycles_for_archive_creation = opt ${CYCLE_FOR_ARCHIVE_CREATION};
     };
 }
})"


cargo build --release --target wasm32-unknown-unknown --package sipnplay_icp_backend
candid-extractor target/wasm32-unknown-unknown/release/sipnplay_icp_backend.wasm > src/sipnplay_icp_backend/sipnplay_icp_backend.did

dfx deploy sipnplay_icp_backend