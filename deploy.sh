set -a
source .env
set +a


cargo build --release --target wasm32-unknown-unknown --package sipnplay_icp_backend
candid-extractor target/wasm32-unknown-unknown/release/sipnplay_icp_backend.wasm > src/sipnplay_icp_backend/sipnplay_icp_backend.did

dfx deploy sipnplay_icp_backend

dfx deploy index_canister --argument '(opt variant { Init = record { ledger_id = principal "bkyz2-fmaaa-aaaaa-qaaaq-cai"; retrieve_blocks_from_ledger_interval_seconds = opt 10; } })'