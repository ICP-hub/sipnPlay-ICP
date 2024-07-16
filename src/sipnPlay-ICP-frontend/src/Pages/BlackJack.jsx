import React, { useEffect, useState } from 'react';
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";

const BlackJack = ()=> {
  const { isAuthenticated, backendActor } = useAuth();
  const [score, setScore] = useState('');
  const navigate = useNavigate();

  const checkPoints = async()=>{
    const res = await backendActor.getUser();
    if(res.err === "New user"){
      navigate("/register");
      }else{
        if(res.ok.points<200){
          toast.error("You dont have enough points to play.");
          navigate("/");
        }
      }
  }
  useEffect(() => {
   if(isAuthenticated === false){
    navigate("/");
   }else{
    checkPoints();
   }
}, []);

  useEffect(() => {
      const handlePostMessage = async(event) => {
          if (event.data.type === 'save_score') {
              setScore(event.data.score);
              console.log("Score received:", event.data.score);
              const resp = await backendActor.deductPoints();
              console.log(resp);
          }
      };

      window.addEventListener('message', handlePostMessage);

      return () => {
          window.removeEventListener('message', handlePostMessage);
      };
  }, []);


  return (
    <>
    <iframe title="Blackjack Game" src="blackjack/index.html" style={{ width: '100%', height: '100vh', border: 'none' }} />
    </>
  )
}

export default BlackJack