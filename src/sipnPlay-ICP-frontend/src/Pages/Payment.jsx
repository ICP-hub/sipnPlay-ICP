import React, { useState } from 'react'
import { Principal } from '@dfinity/principal';
import { useAuth } from "../utils/useAuthClient";
import {principalToAccountIdentifier } from '@dfinity/ledger-icp'

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [metaData, setMetaData] = useState(null);
  const {principal, ledgerActor } = useAuth();

  const formatTokenMetaData = (arr) => {
    const resultObject = {};
    arr.forEach((item) => {
      const key = item[0];
      const value = item[1][Object.keys(item[1])[0]]; // Extracting the value from the nested object
      resultObject[key] = value;
    });
    return resultObject;
  };

  const getBalance=async()=>{
    let bal = await ledgerActor.icrc1_balance_of({ owner: Principal.fromText(principal) , subaccount: [] })
    console.log("balance : ",parseInt(bal))
    return parseInt(bal)
  }
 
  
  const transferApprove = async (sendAmount) => {
      setLoading(true);
      await ledgerActor.icrc1_metadata().then((res)=>{
        console.log("icrc1_metadata res : ",res)
        
        setMetaData(formatTokenMetaData(res))
      }).catch((err)=>{console.log(err)})

      console.log('metaData[decimals]', metaData);
      let amnt = parseInt(
        Number(sendAmount) * Math.pow(10, parseInt(metaData?.['icrc1:decimals'])),
      );

      console.log('amount', amnt, principal);
      console.log(
        'canid principal',
        Principal.fromHex(
          principalToAccountIdentifier(Principal.fromText(process.env.CANISTER_ID_SIPNPLAY_ICP_BACKEND)),
        ),
      );
      if ((await getBalance()) >= amnt) {
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
              setLoading(false);
              console.log(res);
              return;
            } else {
              console.log(res);
            }
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          });
      } else {
        console.log('balance is less : ', amnt, sendAmount);
        setLoading(false);
      }
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Processing payment of ${amount} ICP`);
    transferApprove(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">ICP Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount (ICP)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Payment