import React, { useEffect, useState } from 'react';
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { addUserData, updateBalance } from '../utils/redux/userSlice';
import { transferApprove } from '../utils/transApprove';

const BlackJack = () => {
  const { isAuthenticated, backendActor, principal, ledgerActor } = useAuth();
  const [score, setScore] = useState(null);
  const dispatch= useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector(state=>state.user);
  
  const [balance, setBalance] = useState(null);

  const getDetails = async () => {
    setIsLoading(true);
    try {
      const res = await backendActor.getUser();
      if (res.err === "New user") {
        navigate("/");
      } else {

      }
    } catch {
      console.log("user balance error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(!userData.id || !userData.email || !userData.balance){
      toast.error("You are not logged in! ")
      navigate("/");
    }
    if (!isAuthenticated) {
      navigate("/");
      toast.error("Login to start playing");
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
        const res = await transferApprove(backendActor, ledgerActor, event.data.bet);
        console.log(res);
        if(res.err){
          toast.error("Payment Failed");
          navigate("/");
        }
        else {
          toast.success("Bet placed successfully");
          dispatch(updateBalance({ balance: userData.balance-event.data.bet }));
        }
      }
    };

    window.addEventListener('message', handleBet);

    return () => {
      window.removeEventListener('message', handleBet);
    };
  }, []);


  return (
    <>
       <iframe title="Blackjack Game" src="blackjack/index.html" style={{ width: '100%', height: '100vh', border: 'none' }} />
    </>
  )
}
export default BlackJack;