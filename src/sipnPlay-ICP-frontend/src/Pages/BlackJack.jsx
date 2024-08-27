import React, { useEffect, useState } from 'react';
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { updateBalance } from '../utils/redux/userSlice';
import { transferApprove } from '../utils/transApprove';

const BlackJack = () => {
  const { isAuthenticated, backendActor, ledgerActor } = useAuth();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector(state => state.user);


  const getDetails = async () => {
    setIsLoading(true);
    try {
      const res = await backendActor.getUser();
      if (res.err === "New user") {
        navigate("/");
      } else {

      }
    } catch {
      console.log("getDetails Error");
    } finally {
      setIsLoading(false);
    }
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

  useEffect(() => {
    if (!userData.id || !userData.email || !userData.balance) {
      toast.error("You are not logged in! ")
      navigate("/");
    }
    if (!isAuthenticated) {
      navigate("/");
      toast.error("You are not logged in! ");
    } else {
      getDetails();
    }
  }, []);

  useEffect(() => {
    const handleScore = async (event) => {
      if (event.data.type === 'save_score') {
        console.log("Score received:", event.data.score);
        if (event.data.score > userData.balance) {
          let metaData = null;

          await ledgerActor.icrc1_metadata().then((res) => {
            metaData = formatTokenMetaData(res);
          }).catch((err) => { console.log(err) })

          const tokensWon = event.data.score - userData.balance * Math.pow(10, parseInt(metaData?.['icrc1:decimals']))
          console.log("Tokens won ",tokensWon);
          const response = await backendActor.addMoney(tokensWon);
          console.log(response);
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
        if (res.err) {
          toast.error("Payment Failed");
          navigate("/");
        }
        else {
          toast.success("Bet placed successfully");
          dispatch(updateBalance({ balance: userData.balance - event.data.bet }));
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