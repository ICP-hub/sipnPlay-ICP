import { Principal } from '@dfinity/principal';

// Format token metadata
export const formatTokenMetaData = (arr) => {
  const resultObject = {};
  arr.forEach((item) => {
    const key = item[0];
    const value = item[1][Object.keys(item[1])[0]];
    resultObject[key] = value;
  });
  return resultObject;
};

// Calculate the amount based on decimals
export const calculateAmount = (sendAmount, decimals) => {
  return parseInt(Number(sendAmount) * Math.pow(10, parseInt(decimals)));
};

// Create a transaction object
export const createTransactionObject = (amount, fee, backendCanisterId) => {
  return {
    amount: Number(amount) + Number(fee),
    from_subaccount: [],
    spender: {
      owner: Principal.fromText(backendCanisterId),
      subaccount: [],
    },
    fee: [fee],
    memo: [],
    created_at_time: [],
    expected_allowance: [],
    expires_at: [],
  };
};

// Approve a transaction
export const approveTransaction = async (transaction, ledgerActor) => {
  try {
    const res = await ledgerActor?.icrc2_approve(transaction);
    if (res?.Err) {
      throw new Error('Transaction approval failed');
    }
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Get balance
export const getBalance = async (ledgerActor, principal) => {
  let bal = await ledgerActor.icrc1_balance_of({ owner: Principal.fromText(principal), subaccount: [] });
  return parseInt(bal);
};

// Handle after payment flow
export const afterPaymentFlow = async (amnt, backendActor, method) => {
  try {
    if (method === 'add') {
      await backendActor.addMoney(amnt);
    } else {
      await backendActor.deductMoney(amnt);
    }
  } catch (err) {
    console.error('Error adding money:', err);
    throw err;
  }
};

// Transfer approval function
export const transferApprove = async (sendAmount, ledgerActor, backendActor, principal, method) => {
  try {
    let metaData = null;
    metaData = await ledgerActor.icrc1_metadata().then((res) => formatTokenMetaData(res));

    let amnt = calculateAmount(sendAmount, metaData?.['icrc1:decimals']);
    const backendCanisterId = process.env.CANISTER_ID_SIPNPLAY_ICP_BACKEND;

    if (await getBalance(ledgerActor, principal) >= amnt) {
      let transaction = createTransactionObject(amnt, metaData?.['icrc1:fee'], backendCanisterId);

      const approvalResult = await approveTransaction(transaction, ledgerActor);
      if (!approvalResult?.Err) {
        await afterPaymentFlow(amnt, backendActor, method);
      }
    } else {
      console.log('Insufficient balance:', amnt, sendAmount);
    }
  } catch (err) {
    console.error('Error in transfer approval:', err);
  }
};
