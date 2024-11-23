set -a
source .env
set +a


cargo build --release --target wasm32-unknown-unknown --package sipnplay_icp_backend
candid-extractor target/wasm32-unknown-unknown/release/sipnplay_icp_backend.wasm > src/sipnplay_icp_backend/sipnplay_icp_backend.did

dfx deploy sipnplay_icp_backend