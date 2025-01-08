
# dfx deploy sipnplay_test --argument "
#     (variant {
#       Init = record {
#         minting_account = \"$MINTER_ACCOUNT_ID\";
#         initial_values = vec {
#           record {
#             \"$DEFAULT_ACCOUNT_ID\";
#             record {
#               e8s = 10_000_000_000_00000000 : nat64;
#             };
#           };
#         };
#         send_whitelist = vec {};
#         transfer_fee = opt record {
#           e8s = 0 : nat64;
#         };
#         token_symbol = opt \"TSIP\";
#         token_name = opt \"Test SipnPlay\";
#         feature_flags = opt record { icrc2 = true };
#       }
#     })
#   "

dfx identity use minter
export MINTER_ACCOUNT_ID=$(dfx ledger account-id)
dfx identity use default
export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)

dfx deploy sipnplay_test --argument "
    (variant {
      Init = record {
        minting_account = \"$MINTER_ACCOUNT_ID\";
        initial_values = vec {
          record {
            \"$DEFAULT_ACCOUNT_ID\";
            record {
              e8s = 10_000_000_000_00000000 : nat64;
            };
          };
        };
        send_whitelist = vec {};
        transfer_fee = opt record {
          e8s = 0 : nat64;
        };
        token_symbol = opt \"TSIP\";
        token_name = opt \"Test SipnPlay\";
        feature_flags = opt record { icrc2 = true };
      }
    })
  "

  dfx deploy index_canister --argument '(opt variant{Init = record {ledger_id = principal "a4tbr-q4aaa-aaaaa-qaafq-cai" }})'