import React, { useEffect, useState } from 'react';
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { addUserData, updateUserData } from '../utils/redux/userSlice';
import { transferApprove } from '../utils/transApprove';

const BlackJack = () => {
  const { isAuthenticated, backendActor, principal, ledgerActor } = useAuth();
  const [score, setScore] = useState(null);
  const [bet, setBet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [balance, setBalance] = useState(null);

  const getDetails = async () => {
    setIsLoading(true);
    try {
      const res = await backendActor.getUser();
      if (res.err === "New user") {
        navigate("/");
      } else {
        // if (res.ok.points < 200) {
        //   toast.error("You dont have enough points to play.");
        //   navigate("/");
        // }
        let userBalance = await backendActor.get_balance();
        setBalance(Number(userBalance))
        dispatch(updateUserData({
          id: principal,
          email: res.ok.email,
          balance: balance,
        }))
      }
    } catch {
      console.log("user balance error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      getDetails();
    }
  }, []);

  useEffect(() => {
    const handleScore = async (event) => {
      if (event.data.type === 'save_score') {
        setScore(event.data.score);
        console.log("Score received:", event.data.score);
        if (score > balance) {
          // await transferApprove(backendActor, ledgerActor, score - balance);
        }
      }
    };
    window.addEventListener('message', handleScore);

    return () => {
      window.removeEventListener('message', handleScore);
    };
  }, []);

  useEffect(() => {
    const handleBet = async (event) => {
      if (event.data.type === 'bet_placed') {
        setBet(event.data.bet);
        console.log("Bet received:", event.data.bet);
        await transferApprove(backendActor, ledgerActor, bet);
        toast.success("Bet placed successfully");
      }
    };

    window.addEventListener('message', handleBet);

    return () => {
      window.removeEventListener('message', handleBet);
    };
  }, []);


  return (
    <>
      {true ? <iframe title="Blackjack Game" src="blackjack/index.html" style={{ width: '100%', height: '100vh', border: 'none' }} />
        : <div className='flex justify-center items-center h-screen'>YOUR DATA IS LOADING ....</div>}
    </>
  )
}
export default BlackJack;