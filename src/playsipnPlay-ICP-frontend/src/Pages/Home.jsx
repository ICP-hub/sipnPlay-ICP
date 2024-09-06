import React, { useEffect, useState } from "react";
import Register from "../components/Modals/Register";
import { useAuth } from "../utils/useAuthClient";
import { useDispatch, useSelector } from "react-redux";
import { addUserData, removeUserData } from "../utils/redux/userSlice";

function Home() {
  const dispatch = useDispatch();
  const { isAuthenticated, backendActor, principal, ledgerActor } = useAuth();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isRegisterDone, setIsRegisterDone] = useState(false);
  const userData = useSelector((state) => state.user);

  const formatTokenMetaData = (arr) => {
    const resultObject = {};
    arr.forEach((item) => {
      const key = item[0];
      const value = item[1][Object.keys(item[1])[0]];
      resultObject[key] = value;
    });
    return resultObject;
  };

  const getStatus = async () => {
    const response = await backendActor.getUser();
    if (response.err === "New user") {
      return { isNewUser: true };
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

      let amnt =
        Number(balance) *
        Math.pow(10, -1 * parseInt(metaData?.["icrc1:decimals"]));

      return {
        isNewUser: false,
        email: response.ok.email,
        balance: parseFloat(amnt),
      };
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated) {
        const status = await getStatus();
        if (status.isNewUser) {
          setIsOpen(true);
        } else {
          dispatch(
            addUserData({
              id: principal.toString(),
              email: status.email,
              balance: status.balance,
            })
          );
        }
      } else {
        dispatch(removeUserData());
      }
    };
    checkStatus();
  }, [isAuthenticated, isRegisterDone]);

  return (
    <div>
      <Register
        setIsRegisterDone={setIsRegisterDone}
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
      />
    </div>
  );
}

export default Home;
