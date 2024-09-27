import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import ConnectWallets from "../Modals/ConnectWallets";
import { useAuth } from "../../utils/useAuthClient";
import UserDetails from "../Modals/UserDetails";
import AnimationButton from "../../common/AnimationButton";
import Register from "../Modals/Register";
import { useDispatch } from "react-redux";
import { addUserData, removeUserData } from "../../utils/redux/userSlice";
import { useFetching } from "../../utils/fetchingContext";

const Header = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const { isAuthenticated, backendActor, principal, ledgerActor } = useAuth();
  const { isFetching, setIsFetching } = useFetching();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isRegisterDone, setIsRegisterDone] = useState(false);
  const dispatch = useDispatch();

  function openModal() {
    setIsOpen(true);
  }

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
    setIsFetching(true);
    const response = await backendActor.getUser();
    if (response.err === "New user") {
      setIsFetching(false);
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
      setIsFetching(false);
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
          setRegisterModalOpen(true);
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
    <nav className="relative z-20 text-white bg-gradient-to-r from-[#FFFFFF00] to-[#9999992B] shadow-lg px-[9%] py-4 flex justify-between items-center ">
      <div className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          className="md:h-[50px] w-[132px] md:w-[167px] lg:w-[200px]"
          draggable="false"
        />
      </div>

      <Register
        setIsRegisterDone={setIsRegisterDone}
        modalIsOpen={registerModalOpen}
        setIsOpen={setRegisterModalOpen}
      />

      <div>
        {isAuthenticated ? (
          <div>
            <UserDetails
              detailsModalOpen={detailsModalOpen}
              setDetailsModalOpen={setDetailsModalOpen}
              isFetching={isFetching}
            />
          </div>
        ) : (
          <>
            <AnimationButton onClick={openModal}>Login</AnimationButton>
            <ConnectWallets modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
