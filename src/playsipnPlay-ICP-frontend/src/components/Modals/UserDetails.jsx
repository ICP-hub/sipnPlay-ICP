import React, { useEffect, useRef, useState } from "react";
import AnimationButton from "../../common/AnimationButton";
import { useSelector } from "react-redux";
import { ImCross, ImMail4 } from "react-icons/im";
import { useAuth } from "../../utils/useAuthClient";
import HeaderButton from "../../common/HeaderButton";
import bgImage from "../../assets/images/waitlistBg.png";
import { Oval } from "react-loader-spinner";
import { IoCopy, IoCopyOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';

const UserDetails = ({ detailsModalOpen, setDetailsModalOpen, isFetching }) => {
  const userDetails = useSelector((state) => state.user);
  const [isPrincipalCopied, setisPrincipalCopied] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const ref = useRef();

  function openModal() {
    setDetailsModalOpen(true);
  }

  function closeModal() {
    setDetailsModalOpen(false);
  }

  function handleCopyClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (userDetails?.id) {
      const textToCopy = userDetails.id;
      
      if (navigator.clipboard && window.isSecureContext) {
        // For secure contexts
        navigator.clipboard.writeText(textToCopy)
          .then(() => {
            setisPrincipalCopied(true);
            setTimeout(() => setisPrincipalCopied(false), 2000);
            toast.success('PID copied');
          })
          .catch(err => {
            console.error("Clipboard write failed:", err);
            toast.error('Failed to copy Principal ID');
          });
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          setisPrincipalCopied(true);
          setTimeout(() => setisPrincipalCopied(false), 2000);
          toast.success('PID copied');
        } catch (err) {
          console.error("Copy failed:", err);
          toast.error('Failed to copy Principal ID');
        }
        
        document.body.removeChild(textArea);
      }
    }
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        closeModal();
      }
    }
  
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
      <div className="inset-0 z-20 flex items-center justify-center">
        <div
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="absolute right-4 top-10 p-4 my-4 
                      md:top-16 md:p-6 md:right-16 md:h-80 
                      lg:top-16 lg:right-24 lg:h-96 lg:w-72 lg:p-8 
                      rounded-3xl flex flex-col justify-center items-center gap-4 
                      backdrop-filter backdrop-blur-lg bg-black 
                      min-h-fit w-[80vw] sm:w-[80%] md:w-[50%] lg:w-72"
          ref={ref}
        >
          {/* Keep only the cross button's click handler */}
          <div className="flex justify-end mb-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
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
                <div className="border-b-2 pb-2 w-full">
                  <div className="flex flex-col">
                    <p className="text-white font-bold font-adam">Email:</p>
                    <p className="text-white font-semibold font-adam">
                      {userDetails?.email && userDetails.email.length > 20
                        ? userDetails.email.slice(0, 20) + "..."
                        : userDetails?.email || " - "}
                    </p>
                  </div>
                </div>
                <div className="border-b-2 pb-2 w-full">
                  <div className="flex flex-col">
                    <span className="text-white font-semibold font-adam">
                      Principal:
                    </span>
                    <div className="flex justify-between">
                      <p className="text-white font-adam font-semibold">
                        {userDetails?.id.slice(0, 20) || " - "}...
                      </p>
                      <button 
                        className="cursor-pointer p-2" 
                        onClick={handleCopyClick}
                      >
                        {isPrincipalCopied ? (
                          <div className="relative flex flex-col justify-between">
                            <p className="text-[10px] absolute -top-4 right-[1px]">
                              Copied
                            </p>
                            <IoCopy size={20} />
                          </div>
                        ) : (
                          <IoCopyOutline size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border-b-2 pb-2 w-full mb-4">
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
            <AnimationButton onClick={(e) => {
              e.stopPropagation();
              logout();
            }}>
              Disconnect
            </AnimationButton>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDetails;
