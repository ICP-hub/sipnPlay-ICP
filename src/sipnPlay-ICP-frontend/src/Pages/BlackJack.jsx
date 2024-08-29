import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateBalance } from "../utils/redux/userSlice";
import { transferApprove } from "../utils/transApprove";

const BlackJack = () => {
  const { isAuthenticated, backendActor, ledgerActor } = useAuth();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const [currBalance, setCurrBalance] = useState(0);

  const getDetails = async () => {
    setIsLoading(true);
    try {
      const res = await backendActor.getUser();
      if (res.err === "New user") {
        navigate("/");
      } else {
        let balance = await backendActor.get_balance();
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
          Number(balance) *
            Math.pow(10, -1 * parseInt(metaData?.["icrc1:decimals"]))
        );
        console.log("balance recieved", amnt);
        setCurrBalance(amnt);
        dispatch(updateBalance({ balance: amnt }));
      }
    } catch {
      console.log("getDetails Error");
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
    }
    if (userData.balance === 0) {
      toast.error("Balance not enough");
      navigate("/");
    }
    if (!isAuthenticated) {
      navigate("/");
      toast.error("You are not logged in! ");
    } else {
      getDetails();
    }
  }, []);

  useEffect(() => {
    const handleScore = async (event) => {
      if (event.data.type === "save_score") {
        if (event.data.score > currBalance) {
          let metaData = null;

          await ledgerActor
            .icrc1_metadata()
            .then((res) => {
              metaData = formatTokenMetaData(res);
            })
            .catch((err) => {
              console.log(err);
            });

          console.log("score", event.data.score);
          console.log("curr balance", currBalance);

          const tokensWon =
            (event.data.score - currBalance) *
            Math.pow(10, parseInt(metaData?.["icrc1:decimals"]));
          console.log("Tokens won ", tokensWon);
          const response = await backendActor.addMoney(parseInt(tokensWon));
          setCurrBalance(event.data.score);
          console.log(response);
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
        const res = await transferApprove(
          backendActor,
          ledgerActor,
          event.data.bet
        );
        console.log(res);
        if (res.err) {
          toast.error("Payment Failed");
          navigate("/");
        } else {
          setCurrBalance(currBalance - event.data.bet);
          toast.success("Bet placed successfully");
        }
      }
    };

    window.addEventListener("message", handleBet);

    return () => {
      window.removeEventListener("message", handleBet);
    };
  }, []);

  return (
    <>
      <iframe
        title="Blackjack Game"
        src="blackjack/index.html"
        style={{ width: "100%", height: "100vh", border: "none" }}
      />
    </>
  );
};
export default BlackJack;
