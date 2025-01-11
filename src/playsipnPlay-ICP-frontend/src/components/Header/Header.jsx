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
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";

const Header = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, backendActor, principal, ledgerActor } = useAuth();
  const { isFetching, setIsFetching } = useFetching();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isRegisterDone, setIsRegisterDone] = useState(false);
  const dispatch = useDispatch();

  function openModal() {
    setIsOpen(true);
    setMobileMenuOpen(false);
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
    const response = await backendActor.get_user();
    console.log("response from get_user ", response);
    if (response.Err === "New user") {
      setIsFetching(false);
      return { isNewUser: true };
    } else {
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
      let amnt =
        parseInt(balance.Ok) *
        Math.pow(10, -1 * parseInt(metaData?.["icrc1:decimals"]));

      setIsFetching(false);
      return {
        isNewUser: false,
        email: response.Ok.email,
        balance: amnt,
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

  const navigationLinks = [
    // { name: "Home", path: "/" },
    // { name: "Recent Played", path: "/recent" },
    // { name: "Trending", path: "/trending" },
    // { name: "Most played", path: "/most-played" },
  ];

  return (
    <>
      <nav className="relative z-20 text-white bg-gradient-to-r from-[#FFFFFF00] to-[#9999992B] shadow-lg px-[9%] py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="md:h-[50px] w-[132px] md:w-[167px] lg:w-[200px]"
              draggable="false"
            />
          </Link>
          <p className="font-adam text-white text-sm mt-6">beta</p>
        </div>

        <Register
          setIsRegisterDone={setIsRegisterDone}
          modalIsOpen={registerModalOpen}
          setIsOpen={setRegisterModalOpen}
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          <a href="https://discord.com/invite/6PmNCezvG4" target="_blank">
            <AnimationButton>Get Tokens</AnimationButton>
          </a>
          {isAuthenticated ? (
            <>
              <UserDetails
                detailsModalOpen={detailsModalOpen}
                setDetailsModalOpen={setDetailsModalOpen}
                isFetching={isFetching}
              />
            </>
          ) : (
            <>
              <AnimationButton onClick={openModal}>Login</AnimationButton>
              <ConnectWallets modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <RxCross1 className="h-7 w-7" />
          ) : (
            <RxHamburgerMenu
              className="h-7 w-7"
              onClick={() => setDetailsModalOpen(true)}
            />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 md:hidden bg-black bg-opacity-90 z-60">
          {isAuthenticated ? (
            <div className="absolute top-20 right-8">
              <UserDetails
                detailsModalOpen={detailsModalOpen}
                setDetailsModalOpen={setDetailsModalOpen}
                isFetching={isFetching}
              />
            </div>
          ) : (
            <div className="absolute top-24 right-8 flex flex-col gap-4 bg-stone-900 p-8 items-center justify-center rounded-xl">
              <a href="https://discord.com/invite/6PmNCezvG4" target="_blank">
                <AnimationButton>Get Tokens</AnimationButton>
              </a>
              <AnimationButton onClick={openModal}>Login</AnimationButton>
              <ConnectWallets modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
