import React from "react";
import AnimationButton from "../../common/AnimationButton";
import { useSelector } from "react-redux";
import { ImCross, ImMail4 } from "react-icons/im";
import { useAuth } from "../../utils/useAuthClient";
import { createPortal } from "react-dom";
import HeaderButton from "../../common/HeaderButton";

const UserDetails = ({ modalIsOpen, setIsOpen }) => {
  const userDetails = useSelector((state) => state.user);
  const { logout } = useAuth();
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    console.log("jkhvjdv");

    setIsOpen(false);
  }

  return (
    <>
      <div className="flex">
        <HeaderButton
          onClick={openModal}
          text={userDetails?.email?.slice(0, 10)}
        />
      </div>
      {modalIsOpen && (
        <div className=" inset-0 absolute z-20 flex items-center justify-center bg-transparent">
          <div className="absolute top-24 right-24 w-72 bg-[#191919] bg-opacity-90 p-8 rounded-3xl flex flex-col justify-center items-center gap-4">
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
