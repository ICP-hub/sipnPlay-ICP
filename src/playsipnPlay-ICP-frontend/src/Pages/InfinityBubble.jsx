import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import config from '../utils/config';
import CryptoJS from "crypto-js";
import { updateBalance, addUserData } from "../utils/redux/userSlice";
import LoadingWindow from "../components/Loaders/LoadingWindow";
import LoadingPopUp from "../components/Loaders/LoadingPopUp";
import { transferApprove } from "../utils/transApprove";
import GameOverLeaderBoard from "../components/Modals/GameOverLeaderBoard";

const ENCRYPTION_KEY = config.ENCRYPTION_KEY;

// Function to encrypt the score
async function encryptScore (data) {
  // Ensure data is converted to string before encryption
  const encrypted = CryptoJS.AES.encrypt(data.toString(), CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

const InfinityBubble = () => {
  const { isAuthenticated, backendActor, principal, ledgerActor } = useAuth();
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [isPopUpLoading, setIsPopupLoading] = useState(false);

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
        if (approveResp.Ok) {
          const afterApproval = await backendActor.game_start("Infinity Bubble");
          if (afterApproval.Ok) {
            toast.success("Points deducted successfully");
          } else {
            navigate("/");
            toast.error("An error occurred during the payment process.");
          }
        }else{
          // navigate("/");
          toast.error("Low balance error")
        }
        // const userHighScore = await backendActor.get_high_score("InfinityBubble");
        // if (userHighScore.Err) {
        //   toast.success("Welcome user!");
        //   localStorage.setItem("BestScore", "0");
        // } else {
        //   localStorage.setItem("BestScore", userHighScore.Ok.toString());
        // }

        const amnt = await getBalance();
        localStorage.setItem("Balance", amnt);

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
    const handleScore = async (event) => {
      if (event.data?.type === "save_score") {
        setTaskName("Saving score");
        setIsPopupLoading(true);
        try{
          setScore(event.data.score);
          const encryptedScore = await encryptScore(event.data.score);
          const resp = await backendActor.game_over("Infinity Bubble", encryptedScore);
          if (resp.Ok) {
            setIsGameOver(true);
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
    console.log("UPDATED BALANCE", userData.balance);
  }, [userData.balance]);

  const gameName1 = {name:"Infinity Bubble"};

  return (
    <div>
    {isGameOver && <GameOverLeaderBoard gameName={gameName1} isGameOver={true} />}
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

export default InfinityBubble;
