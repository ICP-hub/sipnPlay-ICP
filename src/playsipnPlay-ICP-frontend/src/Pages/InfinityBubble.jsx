import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const InfinityBubble = () => {
  const { isAuthenticated, backendActor, principal, ledgerActor } = useAuth();
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);

  useEffect(() => {
    const handleScore = (event) => {
      if (event.data?.type === "save_score") {
        setScore(event.data.score);
        console.log("Score from useEffect", score);
      }
    };
    window.addEventListener("message", handleScore);
    return () => {
      window.removeEventListener("message", handleScore);
    };
  }, []);

  useEffect(() => {
    if (!userData.id || !userData.email) {
      toast.error("You are not logged in! ");
      navigate("/");
    } else if (!isAuthenticated) {
      navigate("/");
      toast.error("You are not logged in! ");
    } else {
      // getDetails();
    }
  }, []);

  return (
    <iframe
      title="Infinity Bubble"
      src="bubble/index.html"
      style={{ width: "100vw", height: "100vh", border: "none" }}
    />
  );
};

export default InfinityBubble;
