import React, { useEffect, useRef, useState } from "react";
import AnimationButton from "../../common/AnimationButton";
import { useSelector } from "react-redux";
import { ImCross, ImMail4 } from "react-icons/im";
import { useAuth } from "../../utils/useAuthClient";
import HeaderButton from "../../common/HeaderButton";
import bgImage from "../../assets/images/waitlistBg.png";
import { Oval } from "react-loader-spinner";
import { IoCopy, IoCopyOutline } from "react-icons/io5";

const UserDetails = ({ detailsModalOpen, setDetailsModalOpen, isFetching }) => {
  const userDetails = useSelector((state) => state.user);
  const [isPrincipalCopied, setisPrincipalCopied] = useState(false);
  const { logout } = useAuth();
  const ref = useRef();
  function openModal() {
    setDetailsModalOpen(true);
  }
  function closeModal() {
    setDetailsModalOpen(false);
  }

  function closeModalOnOutsideClick(e) {
    if (ref.current && !ref.current.contains(e.target)) {
      closeModal();
    }
  }

  function copyPrincipal() {
    navigator.clipboard
      .writeText(userDetails?.id)
      .then(() => {
        setisPrincipalCopied(true);
        setTimeout(() => {
          setisPrincipalCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
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
        <HeaderButton onClick={openModal} isFetching={isFetching}>
          {isFetching ? (
            <Oval
              color="#EE3EC9"
              secondaryColor="#fff"
              wrapperClass="flex justify-center"
              width={24}
              height={24}
            />
          ) : (
            userDetails?.email?.slice(0, 10) + "..."
          )}
        </HeaderButton>
      </div>
      {detailsModalOpen && (
        <div className=" inset-0 z-20 flex items-center justify-center ">
          <div
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="absolute right-8 top-16 p-4 my-4 md:top-20 md:p-6 md:right-16 md:h-80 lg:top-24 lg:right-24 lg:h-96 lg:w-72 lg:p-8 rounded-3xl flex flex-col justify-center items-center gap-4 backdrop-filter backdrop-blur-lg bg-black"
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

            {isFetching ? (
              <div className="flex flex-col justify-start items-center gap-2 mb-4">
                <p className="mb-4">Fetching Details...</p>
                <Oval
                  color="#ee3ec9"
                  secondaryColor="#fff"
                  height={50}
                  width={50}
                />
              </div>
            ) : (
              <>
                <div className=" border-b-2 pb-2 w-full">
                  {/* <ImMail4 color="#fff" /> */}
                  <div className="flex flex-col">
                    <p className="text-white font-bold font-adam">Email:</p>
                    <p className="text-white font-semibold font-adam">
                      {userDetails?.email && userDetails.email.length > 20
                        ? userDetails.email.slice(0, 20) + "..."
                        : userDetails?.email || " - "}
                    </p>
                  </div>
                </div>
                <div className=" border-b-2 pb-2 w-full">
                  <div className="flex flex-col">
                    <span className="text-white font-semibold font-adam">
                      Principal:
                    </span>
                    <div className="flex justify-between">
                      <p className="text-white font-adam font-semibold">
                        {userDetails?.id.slice(0, 20) || " - "}...
                      </p>
                      <span className="cursor-pointer" onClick={copyPrincipal}>
                        {isPrincipalCopied ? (
                          <div className="relative flex flex-col justify-between">
                            <p className="text-[10px] absolute -top-4 right-[1px] ">
                              Copied
                            </p>
                            <IoCopy size={20} />
                          </div>
                        ) : (
                          <IoCopyOutline size={20} />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className=" border-b-2 pb-2 w-full mb-4">
                  <div className="flex flex-col">
                    <span className="text-white font-semibold font-adam">
                      TSIP:
                    </span>
                    <p className="text-white font-semibold font-adam">
                      {Math.round(userDetails?.balance) || " - "}
                    </p>
                  </div>
                </div>
              </>
            )}
            <AnimationButton onClick={logout}>Disconnect</AnimationButton>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetails;
