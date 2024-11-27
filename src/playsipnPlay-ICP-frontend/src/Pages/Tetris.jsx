import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateBalance, addUserData } from "../utils/redux/userSlice";
import CryptoJS from "crypto-js";
import LoadingWindow from "../components/Loaders/LoadingWindow";

const secretKey = "Abh67_#fbau-@y74_7A_0nm6je7";

function encryptData(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}

const Tetris = () => {
  const [score, setScore] = useState(0);
  const { isAuthenticated, backendActor, principal, ledgerActor } = useAuth();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
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
    console.log("gftvgbgyrffvg", amnt);
    dispatch(updateBalance({ balance: amnt }));
    return amnt;
  };

  const getDetails = async () => {
    setIsLoading(true);
    try {
      const res = await backendActor.get_user();
      if (res.err === "New user") {
        navigate("/");
        toast.error("Please provide your email");
      } else {
        const amnt = await getBalance();
        const amntString = amnt.toString();
        const encryptedBalance = encryptData(amntString, secretKey);
        dispatch(
          addUserData({
            id: principal.toString(),
            email: res.Ok.email,
            balance: amnt,
          })
        );

        localStorage.setItem("Balance", encryptedBalance);
        console.log("balance recieved", amnt);
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
    const handleScore = (event) => {
      if (event.data?.type === "save_score") {
        setScore(event.data.score);
        backendActor.tetris_game_over(event.data.score);
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
      {false ? (
        <LoadingWindow gameName="Tetris" />
      ) : (
        <div>
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
