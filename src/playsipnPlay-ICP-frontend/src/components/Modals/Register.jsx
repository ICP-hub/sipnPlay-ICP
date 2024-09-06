import React, { useState } from "react";
import AnimationButton from "../../common/AnimationButton";
import Modal from "react-modal";
import bgImage from "../../assets/images/waitlistBg.png";
import alien from "../../assets/images/alien.png";
import logo from "../../assets/images/logo.png";
import { ImCross } from "react-icons/im";
import { useAuth } from "../../utils/useAuthClient";
import toast from "react-hot-toast";

const Register = ({ setIsRegisterDone, modalIsOpen, setIsOpen }) => {
  const { backendActor, principal } = useAuth();

  function closeModal() {
    setIsOpen(false);
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const response = await backendActor.createUser(email);

    if (response !== "User already exists") {
      toast.success("Congrats!");
      setIsOpen(false);
      setIsRegisterDone(true);
      setEmail("");
      // closeModal();
    } else {
      toast.error("Email already Registered");
    }
  };

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        contentLabel="Register Modal"
        className="fixed inset-0 flex items-center justify-center bg-transparent"
        overlayClassName="fixed z-[100] inset-0 bg-gray-800 bg-opacity-50"
      >
        <div
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="bg-black w-96 h-80 p-8 md:p-8 relative grid grid-cols-1 md:grid-cols-2 md:top-[7%] md:h-80 md:w-[540px] lg:w-[540px] lg:h-80 border border-[#696969] rounded-xl"
        >
          <p className="text-white absolute font-monckeberg top-[20%] left-[5%] md:top-[20%] md:left-[25%]"></p>
          <div className="relative flex  md:block">
            <img
              className=" w-44 sm:mr-6 h-12 md:w-84 lg:w-84"
              draggable="false"
              src={logo}
            />
            <img
              className="w-24 ml-2 md:block md:w-[200px] transform -scale-x-100 md:transform-none lg:w-88  md:mt-0 md:absolute top-0 right-0 md:top-auto md:right-auto md:-bottom-8 md:-left-9 "
              draggable="false"
              src={alien}
            />
          </div>

          <div className="w-full md:w-auto mt-8 md:mt-0">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-4 md:mt-24 md:mr-24  ">
                <label
                  className="block text-white font-adam font-bold text-sm mb-0.2"
                  htmlFor="email"
                >
                  EMAIL ADDRESS
                </label>
                <input
                  className="border-b-2 uppercase min-w-full py-2 mb-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // required
                />
              </div>

              <div className="flex mb-4 justify-center md:justify-end">
                <AnimationButton text="Submit" />
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Register;
