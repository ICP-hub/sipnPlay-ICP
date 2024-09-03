import React, { useEffect, useRef } from "react";
import AnimationButton from "../../common/AnimationButton";
import { useSelector } from "react-redux";
import { ImCross, ImMail4 } from "react-icons/im";
import { useAuth } from "../../utils/useAuthClient";
import { createPortal } from "react-dom";
import HeaderButton from "../../common/HeaderButton";
import bgImage from "../../assets/images/waitlistBg.png";

const UserDetails = ({ modalIsOpen, setIsOpen }) => {
  const userDetails = useSelector((state) => state.user);
  const { logout } = useAuth();
  const ref = useRef();
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  function closeModalOnOutsideClick(e) {
    if (ref.current && !ref.current.contains(e.target)) {
      closeModal();
    }
  }

  useEffect(() => {
    document.addEventListener("click", closeModalOnOutsideClick, true);
    return () => {
      document.removeEventListener("click", closeModalOnOutsideClick, true);
    };
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        closeModal();
      }
    }

    //
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        closeModal();
      }
    }

    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal]);

  return (
    <>
      <div className="flex">
        <HeaderButton
          onClick={openModal}
          text={userDetails?.email?.slice(0, 10)}
        />
      </div>
      {modalIsOpen && (
        <div className=" inset-0  z-20 flex items-center justify-center bg-transparent">
          <div
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.9,
              backdropFilter: "blur(80px)",
            }}
            className="absolute right-8 top-24 p-4 md:top-20 md:p-6 md:right-16 lg:top-24 lg:right-24 lg:h-80 lg:w-72  lg:p-8 rounded-3xl flex flex-col justify-center items-center gap-4"
            ref={ref}
          >
            {/* Wrapper for positioning the button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={closeModal}
                className="text-white absolute top-8 right-8"
              >
                <ImCross />
              </button>
            </div>

            <div className=" border-b-2 pb-2 w-full">
              {/* <ImMail4 color="#fff" /> */}
              <div className="flex flex-col">
                <span className="text-white font-semibold">Email:</span>
                <span className="text-white font-light opacity-70">
                  {userDetails.email}
                </span>
              </div>
            </div>
            <div className=" border-b-2 pb-2 w-full mb-4">
              <div className="flex flex-col">
                <span className="text-white font-semibold">TSIP:</span>
                <p className="text-white font-light opacity-70">
                  {Math.round(userDetails.balance)}
                </p>
              </div>
            </div>
            <AnimationButton onClick={logout} text="Disconnect" />
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetails;
