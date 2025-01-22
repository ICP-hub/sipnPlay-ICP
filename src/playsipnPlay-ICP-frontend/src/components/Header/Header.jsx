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
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import React Toastify CSS

const Header = () => {
  // State management for various modals and menus
  const [modalIsOpen, setIsOpen] = useState(false); // For ConnectWallets modal
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // For mobile menu
  const { isAuthenticated, backendActor, principal, ledgerActor } = useAuth();
  const { isFetching, setIsFetching } = useFetching();
  const [registerModalOpen, setRegisterModalOpen] = useState(false); // For Register modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false); // For UserDetails modal
  const [isRegisterDone, setIsRegisterDone] = useState(false); // To track registration completion
  const dispatch = useDispatch();

  // Function to open the ConnectWallets modal and close the mobile menu
  const openModal = () => {
    setIsOpen(true);
    setMobileMenuOpen(false);
  };

  // Helper function to format token metadata
  const formatTokenMetaData = (arr) => {
    const resultObject = {};
    arr.forEach((item) => {
      const key = item[0];
      const value = item[1][Object.keys(item[1])[0]];
      resultObject[key] = value;
    });
    return resultObject;
  };

  // Function to fetch user status from backend
  const getStatus = async () => {
    setIsFetching(true);
    try {
      const response = await backendActor.get_user();
      console.log("response from get_user ", response);
      if (response.Err === "New user") {
        return { isNewUser: true };
      } else {
        let balance = await backendActor.get_caller_balance();
        let metaData = null;
        try {
          const res = await ledgerActor.icrc1_metadata();
          metaData = formatTokenMetaData(res);
        } catch (err) {
          console.log("Error fetching metadata:", err);
        }
        const amnt =
          parseInt(balance.Ok) *
          Math.pow(10, -1 * parseInt(metaData?.["icrc1:decimals"]));

        return {
          isNewUser: false,
          email: response.Ok.email,
          balance: amnt,
        };
      }
    } catch (error) {
      console.error("Error fetching user status:", error);
      return { isNewUser: false };
    } finally {
      setIsFetching(false);
    }
  };

  // useEffect to check user status on authentication changes or registration completion
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
  }, [isAuthenticated, isRegisterDone, dispatch, principal]);

  // Navigation links can be added here if needed
  const navigationLinks = [
    // Example:
    // { name: "Home", path: "/" },
    // { name: "Recent Played", path: "/recent" },
    // { name: "Trending", path: "/trending" },
    // { name: "Most Played", path: "/most-played" },
  ];

  return (
    <>
      {/* Navigation Bar */}
      <nav className="relative z-20 text-white bg-gradient-to-r from-[#FFFFFF00] to-[#9999992B] shadow-lg px-[9%] py-4 flex justify-between items-center">
        {/* Logo and Beta Label */}
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

        {/* Register Modal */}
        <Register
          setIsRegisterDone={setIsRegisterDone}
          modalIsOpen={registerModalOpen}
          setIsOpen={setRegisterModalOpen}
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          {/* "Get Tokens" Button - Always Visible in Desktop */}
          <a
            href="https://discord.com/invite/6PmNCezvG4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AnimationButton>Get Tokens</AnimationButton>
          </a>

          {isAuthenticated ? (
            <>
              {/* User Details Component */}
              <UserDetails
                detailsModalOpen={detailsModalOpen}
                setDetailsModalOpen={setDetailsModalOpen}
                isFetching={isFetching}
              />
            </>
          ) : (
            <>
              {/* "Login" Button */}
              <AnimationButton onClick={openModal}>Login</AnimationButton>
              {/* "Connect Wallets" Modal */}
              <ConnectWallets modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? (
            <RxCross1 className="h-7 w-7" />
          ) : (
            <RxHamburgerMenu className="h-7 w-7" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="bg-black bg-opacity-90 fixed flex flex-col inset-0 items-center justify-center md:hidden w-full z-60"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="absolute top-24 right-8 flex flex-col gap-4 bg-stone-900 p-8 items-center justify-center rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* "Get Tokens" Button - Proper Alignment */}
            <a
              href="https://discord.com/invite/6PmNCezvG4"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <AnimationButton>Get Tokens</AnimationButton>
            </a>

            {/* Authentication Conditional */}
            {isAuthenticated ? (
              <UserDetails
                detailsModalOpen={detailsModalOpen}
                setDetailsModalOpen={setDetailsModalOpen}
                isFetching={isFetching}
              />
            ) : (
              <>
                <AnimationButton onClick={openModal} className="w-full">
                  Login
                </AnimationButton>
                <ConnectWallets
                  modalIsOpen={modalIsOpen}
                  setIsOpen={setIsOpen}
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast Notifications Container */}
      <ToastContainer />
    </>
  );
};

export default Header;