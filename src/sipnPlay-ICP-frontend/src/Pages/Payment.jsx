import React, { useState } from 'react';
import { useAuth } from "../utils/useAuthClient";
import { transferApprove } from "../utils/transApprove";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  const { principal, ledgerActor, backendActor } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(`Processing payment of ${amount} ICP`);

    try {
      await transferApprove(amount, ledgerActor, backendActor, principal);
    } catch (error) {
      console.error('Payment processing error:', error);
    } finally {
      setLoading(false);
    }
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
  );
};

export default Payment;
