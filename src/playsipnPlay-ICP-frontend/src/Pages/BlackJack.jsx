import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { transferApprove } from "../utils/transApprove";
import CryptoJS from "crypto-js";
import LoadingWindow from "../components/Loaders/LoadingWindow";
import LoadingPopUp from "../components/Loaders/LoadingPopUp";
import config from '../utils/config';

const ENCRYPTION_KEY = config.ENCRYPTION_KEY;

// Function to encrypt the score
async function encryptScore(data) {
  // Ensure data is converted to string before encryption
  const encrypted = CryptoJS.AES.encrypt(data.toString(), CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

function encryptData(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}

const BlackJack = () => {
  const { isAuthenticated, backendActor, ledgerActor } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPopUpLoading, setIsPopUpLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);

  const getBalance = async () => {
    let balance = await backendActor.get_caller_balance();
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
    return amnt;
  };

  const getDetails = async () => {
    setIsLoading(true);
    try {
      const res = await backendActor.get_user();
      console.log(res);
      if (!res.Ok) {
        navigate("/");
        toast.error("Please provide your email");
      } else {
        const amnt = await getBalance();
        const amntString = amnt.toString();
        const encryptedBalance = encryptData(amntString, "Abh67_#fbau-@y74_7A_0nm6je7");

        localStorage.setItem("Balance", encryptedBalance);

        if (amnt === 0) {
          navigate("/");
          toast.error("Please top up your account");
        }
      }
    } catch (err) {
      console.log(err);
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
    if (!isAuthenticated) {
      toast.error("You are not logged in! ");
      navigate("/");
    } else if (!userData.id || !userData.email) {
      navigate("/");
      toast.error("You are not logged in! ");
    } else {
      getDetails();
    }
  }, []);

  useEffect(() => {
    const handleScore = async (event) => {
      if (event.data.type === "save_score") {
     
        try {
          const amnt = await getBalance();
          console.log("event data score",event.data.score);
          console.log("amount balance",amnt); 
          if (Math.trunc(event.data.score) > Math.trunc(amnt)) {
            setTaskName("Adding points");
            const tokensWon =
              event.data.score - amnt;
            const encryptedScore = await encryptScore(tokensWon);
            console.log("Tokens won ", tokensWon);
            setIsPopUpLoading(true);
            const response = await backendActor.add_money(encryptedScore);
            console.log(response);
            if (response.Ok) {
              toast.success("Tokens added successfully");
            } else {
              toast.error("Failed to add points");
            }
          }
        } catch (e) {
          console.log(e);
        } finally {
          setIsPopUpLoading(false);
          setTaskName("");
        }
      }
    };
    window.addEventListener("message", handleScore);

    return () => {
      window.removeEventListener("message", handleScore);
    };
  }, []);

  useEffect(() => {
    const handleBet = async (event) => {
      if (event.data.type === "bet_placed") {
        try {
          setTimeout(() => {
            setIsPopUpLoading(true);
          }, 1000);
          setTaskName("Updating Balance");
          const res = await transferApprove(
            backendActor,
            ledgerActor,
            event.data.bet,
            true
          );
          console.log(res);
          if (res.err) {
            toast.error("Payment Failed");
            navigate("/");
          } else {
            const amnt = await getBalance();
            toast.success(`Updated balance: $${Math.round(amnt)}`);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setIsPopUpLoading(false);
          setTaskName("");
        }
      }
    };

    window.addEventListener("message", handleBet);

    return () => {
      window.removeEventListener("message", handleBet);
    };
  }, []);


  return (
    <div>
      {isLoading ? (
        <LoadingWindow gameName="blackjack" />
      ) : (
        <div>
          {isPopUpLoading && (
            <LoadingPopUp gameName="blackjack" taskName={taskName} />
          )}
          <iframe
            title="Blackjack Game"
            src="blackjack/index.html"
            style={{ width: "100%", height: "100vh", border: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default BlackJack;
