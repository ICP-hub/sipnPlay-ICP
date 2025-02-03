import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateBalance, addUserData } from "../utils/redux/userSlice";
import CryptoJS from "crypto-js";
import LoadingWindow from "../components/Loaders/LoadingWindow";
import LoadingPopUp from "../components/Loaders/LoadingPopUp";
import { transferApprove } from "../utils/transApprove";
import GameOverLeaderBoard from "../components/Modals/GameOverLeaderBoard";
import config from "../utils/config";
import TagManager from "react-gtm-module";

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

function encryptData(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}

const Tetris = () => {
  const { isAuthenticated, backendActor, principal, ledgerActor } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [isPopUpLoading, setIsPopupLoading] = useState(false);

  // Define game name object consistently
  const gameName = { name: "Tetris" };

  useEffect(() => {
    const tagManagerArgs = {
      dataLayer: {
        event: "pageView",
        page: "TetrisPage",
        game: gameName.name,
      },
    };
    TagManager.dataLayer(tagManagerArgs);
  }, []);

  const getBalance = async () => {
    try {
      const balance = await backendActor.get_caller_balance();
      console.log("Balance response:", balance);
      
      const metaData = await ledgerActor.icrc1_metadata()
        .then(res => formatTokenMetaData(res))
        .catch(err => {
          console.error("Metadata error:", err);
          return null;
        });

      if (!metaData) {
        throw new Error("Failed to fetch token metadata");
      }

      const amnt = parseFloat(
        Number(balance.Ok) * 
        Math.pow(10, -1 * parseInt(metaData?.["icrc1:decimals"]))
      );
      
      dispatch(updateBalance({ balance: amnt }));
      return amnt;
    } catch (error) {
      console.error("Get balance error:", error);
      throw error;
    }
  };

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
          return true;
        } else {
          toast.error("An error occurred during the payment process.");
          return false;
        }
      } else {
        toast.error("Low balance error");
        return false;
      }
    } catch (error) {
      console.error("Deduct points error:", error);
      toast.error(error.message);
      return false;
    }
  };

  const getDetails = async () => {
    setIsLoading(true);
    try {
      const res = await backendActor.get_user();
      if (res.Err === "New user") {
        navigate("/");
        toast.error("Please provide your email");
        return;
      }

      // Deduct points first
      const deductionSuccessful = await deductPointsOnGameStart();
      if (!deductionSuccessful) {
        navigate("/");
        return;
      }

      // Get high score
      try {
        const userHighScore = await backendActor.get_high_score(gameName.name);
        const encryptionKey = "Abh67_#fbau-@y74_7A_0nm6je7";
        
        if (userHighScore.Err) {
          const zeroScore = encryptData("0", encryptionKey);
          localStorage.setItem("BestScore", zeroScore);
        } else {
          const encryptedScore = encryptData(
            userHighScore.Ok.toString(),
            encryptionKey
          );
          localStorage.setItem("BestScore", encryptedScore);
        }
      } catch (error) {
        console.error("High score error:", error);
        toast.error("Failed to retrieve high score");
      }

      // Get balance and update user data
      const balance = await getBalance();
      dispatch(
        addUserData({
          id: principal.toString(),
          email: res.Ok.email,
          balance: balance,
        })
      );

    } catch (error) {
      console.error("getDetails error:", error);
      toast.error(`Error: ${error.message}`);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

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
    const handleScore = async (event) => {
      if (event.data?.type === "save_score") {
        setTaskName("Saving score");
        setIsPopupLoading(true);
        try {
          console.log("Received score:", event.data.score);
          const encryptedScore = await encryptScore(event.data.score);
          console.log("Encrypted score:", encryptedScore);
          
          const resp = await backendActor.game_over(gameName.name, encryptedScore);
          console.log("Game over response:", resp);
          
          if (resp.Ok) {
            // Exit fullscreen when game is over
            if (document.fullscreenElement) {
              document.exitFullscreen().catch((err) => {
                console.error("Error exiting fullscreen:", err);
              });
            }
            setIsGameOver(true);
            toast.success("Score saved successfully");
          } else {
            console.error("Game over error:", resp.Err);
            toast.error("Failed to save score");
          }
        } catch (error) {
          console.error("Score saving error:", error);
          toast.error("Failed to encrypt score");
        } finally {
          setIsPopupLoading(false);
        }
      }
    };
    
    window.addEventListener("message", handleScore);
    return () => window.removeEventListener("message", handleScore);
  }, []);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
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
        <LoadingWindow gameName="tetris" />
      ) : (
        <div>
          <div className="absolute mx-[9%] mt-4">
            <div className="text-white font-mono font-[400] text-[18px] md:text-[26px]">
              TSIP: {userData.balance}
            </div>
          </div>
          {isPopUpLoading && (
            <LoadingPopUp gameName="tetris" taskName={taskName} />
          )}
          <iframe
            title="Blox Game"
            src="tetris/tetris.html"
            style={{ width: "100vw", height: "100vh", border: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default Tetris;