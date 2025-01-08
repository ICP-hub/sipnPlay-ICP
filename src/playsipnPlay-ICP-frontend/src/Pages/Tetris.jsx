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
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [isPopUpLoading, setIsPopupLoading] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);

  useEffect(() => {
    const tagManagerArgs = {
      dataLayer: {
        event: "pageView",
        page: "TetrisPage",
        game: "Tetris",
      },
    };
    TagManager.dataLayer(tagManagerArgs);
  }, []);

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
          const afterApproval = await backendActor.game_start("Tetris");
          if (afterApproval.Ok) {
            toast.success("Tokens deducted successfully");
          } else {
            navigate("/");
            toast.error("An error occurred during the payment process.");
          }
        } else {
          navigate("/");
          toast.error("Low balance error");
        }

        // Gracefully handle high score retrieval
        try {
          const userHighScore = await backendActor.get_high_score("Tetris");
          if (userHighScore.Err) {
            toast.success("Welcome user!");
            const Zeroscore = encryptData("0", "Abh67_#fbau-@y74_7A_0nm6je7");
            localStorage.setItem("BestScore", Zeroscore);
          } else {
            const encryptedUserHighScore = encryptData(
              userHighScore.Ok.toString(),
              "Abh67_#fbau-@y74_7A_0nm6je7"
            );
            localStorage.setItem("BestScore", encryptedUserHighScore);
          }
        } catch (highScoreError) {
          toast.error("Failed to retrieve high score");
          console.error("High score retrieval error", highScoreError);
        }

        // Handle balance retrieval
        try {
          const amnt = await getBalance();
          dispatch(
            addUserData({
              id: principal.toString(),
              email: res.Ok.email,
              balance: amnt,
            })
          );
        } catch (balanceError) {
          toast.error("Failed to retrieve balance");
          console.error("Balance retrieval error", balanceError);
        }
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
      console.error("getDetails Error", err.message);
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
        setTaskName("Saving score");
        setIsPopupLoading(true);
        try {
          const encryptedScore = await encryptScore(event.data.score);
          const resp = await backendActor.game_over("Tetris", encryptedScore);
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
    console.log("UPDATED BALANCE", userData.balance);
  }, [userData.balance]);

  useEffect(() => {
    // Beforeunload handler
    const handleBeforeUnload = (event) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const gameName1 = { name: "Tetris" };

  return (
    <div>
      {isGameOver && (
        <GameOverLeaderBoard gameName={gameName1} isGameOver={true} />
      )}
      {isLoading ? (
        <LoadingWindow gameName="tetris" />
      ) : (
        <div>
          <div className="absolute  mx-[9%] mt-4">
            <div className="text-white font-mono font-[400] text-[18px] md:text-[26px] ">
              {" "}
              TSIP: {userData.balance}
            </div>
          </div>
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
