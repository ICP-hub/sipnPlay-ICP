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
import config from '../utils/config';
const secretKey = "Abh67_#fbau-@y74_7A_0nm6je7";

function encryptData(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}

// Get the encryption key
const ENCRYPTION_KEY = config.ENCRYPTION_KEY;

// Function to encrypt the score
function encryptScore(data) {
  // Ensure data is converted to string before encryption
  const encrypted = CryptoJS.AES.encrypt(data.toString(), CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  // Convert encrypted data to Base64 string
  return encrypted.toString();
}

const Tetris = () => {
  const { isAuthenticated, backendActor, principal, ledgerActor } = useAuth();
  const dispatch = useDispatch();
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [isPopUpLoading, setIsPopupLoading] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);

  const getBalance = async () => {
    let balance = await backendActor.get_caller_balance();
    console.log(balance);
    let metaData = null;
    await ledgerActor
      .icrc1_metadata()
      .then((res) => {
        metaData = formatTokenMetaData(res);
      })
      .catch((err) => {
        console.log(err);
      });

    let amnt = parseFloat(
      Number(balance.Ok) *
        Math.pow(10, -1 * parseInt(metaData?.["icrc1:decimals"]))
    );
    dispatch(updateBalance({ balance: amnt }));
    return amnt;
  };

  const getDetails = async () => {
    setIsLoading(true);
    try {
      const res = await backendActor.get_user();
      if (res.Err === "New user") {
        navigate("/");
        toast.error("Please provide your email");
      } else {
        const approveResp = await transferApprove(
          backendActor,
          ledgerActor,
          30,
          false
        );
        console.log("approval", approveResp);
        if (approveResp.Ok) {
          const afterApproval = await backendActor.tetris_game_start();
          console.log("After approval", afterApproval);
          if (afterApproval.Ok) {
            toast.success("Points deducted successfully");
          } else {
            // navigate("/");
            toast.error("An error occurred during the payment process.");
          }
        }

        const userHighScore = await backendActor.get_high_score();
        console.log("user high score", parseInt(userHighScore.Ok));
        if (userHighScore.Err) {
          toast.success("Welcome user!");
          const best = encryptData("0", secretKey);
          localStorage.setItem("BestScore", best);
        } else {
          const best = encryptData(userHighScore.Ok || 0, secretKey);
          localStorage.setItem("BestScore", best);
        }

        const amnt = await getBalance();
        const amntString = amnt.toString();
        const encryptedBalance = encryptData(amntString, secretKey);
        localStorage.setItem("Balance", encryptedBalance);

        dispatch(
          addUserData({
            id: principal.toString(),
            email: res.Ok.email,
            balance: amnt,
          })
        );
      }
    } catch (err) {
      console.log("getDetails Error", err.message);
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
    // The handleScore function
    const handleScore = async (event) => {
      if (event.data?.type === "save_score") {
        setScore(event.data.score);
        setTaskName("Saving score...");
        setIsPopupLoading(true);

        try {
          // Encrypt the score using the key
          const encryptedScore = encryptScore(event.data.score);
          // Send the encrypted score to the backend
          const resp = await backendActor.tetris_game_over(encryptedScore);
          if (resp.Ok) {
            toast.success("Score saved successfully");
          } else {
            toast.error("Some error occurred");
          }
        } catch (err) {
          toast.error("Encryption failed");
          console.error(err);
        }

        setIsPopupLoading(false);
      }
    };
    window.addEventListener("message", handleScore);
    return () => {
      window.removeEventListener("message", handleScore);
    };
  }, []);

  useEffect(() => {
    console.log("UPDATED BALANCE", userData.balance);
  }, [userData.balance]);

  return (
    <div>
      {isGameOver && <GameOverLeaderBoard gameName="tetris" isGameOver={true} />}
      {isLoading ? (
        <LoadingWindow gameName="tetris" />
      ) : (
        <div>
          {isPopUpLoading && (
            <LoadingPopUp gameName="tetris" taskName={taskName} />
          )}
          <iframe
            title="Tetris Game"
            src="tetris/tetris.html"
            style={{ width: "100vw", height: "100vh", border: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default Tetris;
