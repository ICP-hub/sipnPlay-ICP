import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import config from "../utils/config";
import CryptoJS from "crypto-js";
import LoadingWindow from "../components/Loaders/LoadingWindow";
import LoadingPopUp from "../components/Loaders/LoadingPopUp";
import { transferApprove } from "../utils/transApprove";
import GameOverLeaderBoard from "../components/Modals/GameOverLeaderBoard";

const ENCRYPTION_KEY = config.ENCRYPTION_KEY;

// Function to encrypt the score
async function encryptScore(data) {
  // Ensure data is converted to string before encryption
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

function encryptData(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}

const BlockTap = () => {
  const { isAuthenticated, backendActor, ledgerActor } = useAuth();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [isPopUpLoading, setIsPopupLoading] = useState(false);

  const deductPointsOnGameStart = async () => {
    try {
      const approveResp = await transferApprove(
        backendActor,
        ledgerActor,
        30,
        false
      );
      if (approveResp.Ok) {
        const afterApproval = await backendActor.game_start("Block Tap");
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
      } else {
        const userHighScore = await backendActor.get_high_score("Block Tap");
        console.log("userhighscore ", userHighScore.Ok);
        const encryptedUserHighScore = encryptData(
          userHighScore.Ok.toString(),
          "Abh67_#fbau-@y74_7A_0nm6je7"
        );
        localStorage.setItem("BestScore", encryptedUserHighScore);
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
          const encryptedScore = await encryptScore(event.data.score);
          const resp = await backendActor.game_over(
            "Block Tap",
            encryptedScore
          );
          if (resp.Ok) {
            setIsGameOver(true);
            toast.success("Score saved successfully");
          } else {
            toast.error("Some error occurred");
          }
        } catch (err) {
          toast.error("Encryption failed");
          console.error(err);
        } finally {
          setIsPopupLoading(false);
        }
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
    return () => {
      window.removeEventListener("message", handleGameStart);
    };
  }, []);

  // Created this object because there was some problem in passing props, this gameName1 is passed to GameOverLeaderboard below.
  const gameName1 = { name: "Block Tap" };

  return (
    <div>
      {isGameOver && (
        <GameOverLeaderBoard
          gameName={gameName1}
          isGameOver={true}
          shouldShowCross={true}
          closeModal={() => setIsGameOver(false)}
        />
      )}
      {isLoading ? (
        <LoadingWindow gameName="block_tap" />
      ) : (
        <div>
          {isPopUpLoading && (
            <LoadingPopUp gameName="block_tap" taskName={taskName} />
          )}
          <iframe
            title="Block Tap"
            src="blocktap_v2/index.html"
            style={{ width: "100vw", height: "100vh", border: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default BlockTap;
