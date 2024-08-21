import { Principal } from '@dfinity/principal';

const afterPaymentFlow = async(backendActor, amnt)=>{
  const res = await backendActor.deductMoney(amnt);
  console.log(res);
} 

const formatTokenMetaData = (arr) => {
  const resultObject = {};
  arr.forEach((item) => {
    const key = item[0];
    const value = item[1][Object.keys(item[1])[0]]; 
    resultObject[key] = value;
  });
  return resultObject;
};

const getBalance=async(backendActor)=>{
  let bal = await backendActor.get_balance();
  console.log("balance : ",parseInt(bal))
  return parseInt(bal)
}

export const transferApprove = async (backendActor, ledgerActor, sendAmount) => {
    let metaData = null;
    await ledgerActor.icrc1_metadata().then((res)=>{
      metaData = formatTokenMetaData(res);
      
    }).catch((err)=>{console.log(err)})

    let amnt = parseInt(
      Number(sendAmount) * Math.pow(10, parseInt(metaData?.['icrc1:decimals'])),
    );

    if ((await getBalance(backendActor)) >= amnt) {
      let transaction = {
        amount: Number(amnt) + Number([metaData?.['icrc1:fee']]),
        from_subaccount: [],
        spender: {
          owner: Principal.fromText(process.env.CANISTER_ID_SIPNPLAY_ICP_BACKEND),
          subaccount: [],
        },
        fee: [metaData?.['icrc1:fee']],
        memo: [],
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
      };
      console.log(ledgerActor?.icrc2_approve);
      await ledgerActor
        ?.icrc2_approve(transaction)
        .then(async res => {
          if (res?.Err) {
            console.log(res);
            return;
          } else {
            afterPaymentFlow(backendActor, amnt);
            console.log("Approve Result ",res);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      console.log('balance is less : ', amnt, sendAmount);
    }
  };