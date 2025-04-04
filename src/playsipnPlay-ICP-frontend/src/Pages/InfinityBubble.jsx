import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import config from "../utils/config";
import CryptoJS from "crypto-js";
import LoadingWindow from "../components/Loaders/LoadingWindow";
import LoadingPopUp from "../components/Loaders/LoadingPopUp";
import { transferApprove } from "../utils/transApprove";
import GameOverLeaderBoard from "../components/Modals/GameOverLeaderBoard";

const ENCRYPTION_KEY = config.ENCRYPTION_KEY;

async function encryptScore(data) {
  const encrypted = CryptoJS.AES.encrypt(
    data.toString(),
    CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return encrypted.toString();
}

const InfinityBubble = () => {  
  const { isAuthenticated, backendActor, ledgerActor } = useAuth();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [isPopUpLoading, setIsPopupLoading] = useState(false);

  // Define game name object
  const gameName = { name: "Infinity Bubble" }; 

  const deductPointsOnGameStart = async () => {
    try {
      const approveResp = await transferApprove(
        backendActor,
        ledgerActor,
        30,
        false
      );
      if (approveResp.Ok) {
        const afterApproval = await backendActor.game_start(gameName.name);
        if (afterApproval.Ok) {
          toast.success("Points deducted successfully");
        } else {
          navigate("/");
          toast.error("An error occurred during the payment process.");
        }
      } else {
        navigate("/");
        toast.error("Low balance error");
      }
    } catch (error) {
      toast.error(`${error.message}`);
      navigate("/");
    }
  };

  const getDetails = async () => {
    setIsLoading(true);
    try {
      const res = await backendActor.get_user();
      if (res.Err === "New user") {
        navigate("/");
        toast.error("Please provide your email");
      }
    } catch (err) {
      console.log("getDetails Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleScore = async (event) => {
      if (event.data?.type === "save_score") {
        setTaskName("Saving score");
        setIsPopupLoading(true);
        try {
          console.log("Score received:", event.data.score);
          const encryptedScore = await encryptScore(event.data.score);
          console.log("Encrypted score:", encryptedScore);
          
          const resp = await backendActor.game_over(
            gameName.name,
            encryptedScore
          );
          
          console.log("Game over response:", resp);
          if (resp.Ok) {
            setIsGameOver(true);
            toast.success("Score saved successfully");
          } else {
            console.error("Game over error:", resp.Err);
            toast.error("Some error occurred");
          }
        } catch (err) {
          console.error("Error saving score:", err);
          toast.error("Encryption failed");
        } finally {
          setIsPopupLoading(false);
        }
      }
    };
    window.addEventListener("message", handleScore);
    return () => window.removeEventListener("message", handleScore);
  }, []);

  useEffect(() => {
    if (!userData.id || !userData.email) {
      toast.error("You are not logged in!");
      navigate("/");
    } else if (!isAuthenticated) {
      navigate("/");
      toast.error("You are not logged in!");
    } else {
      getDetails();
    }
  }, []);

  useEffect(() => {
    const handleGameStart = async (event) => {
      if (event.data?.type === "start_game") {
        setTaskName("Deducting tokens");
        setIsPopupLoading(true);
        try {
          await deductPointsOnGameStart();
        } catch (err) {
          console.error(err);
        } finally {
          setIsPopupLoading(false);
        }
      }
    };
    window.addEventListener("message", handleGameStart);
    return () => window.removeEventListener("message", handleGameStart);
  }, []);

  return (
    <div>
      {isGameOver && (
        <GameOverLeaderBoard
          game={gameName}
          isGameOver={true}
          shouldShowCross={true}
          closeModal={() => setIsGameOver(false)}
        />
      )}
      {isLoading ? (
        <LoadingWindow gameName="infinity_bubble" /> 
      ) : (
        <div>
          {isPopUpLoading && (
            <LoadingPopUp gameName="infinity_bubble" taskName={taskName} /> 
          )}
          <iframe
            title="Infinity Bubble" 
            src="bubble/index.html" 
            style={{ width: "100vw", height: "100vh", border: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default InfinityBubble; // or BlockTap