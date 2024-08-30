import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import GradientText from "../../common/GradientText";
import JoinWaitlist from "../Modals/JoinWaitlist";
import ConnectWallets from "../Modals/ConnectWallets";
import { useAuth } from "../../utils/useAuthClient";
import toast from "react-hot-toast";
import UserDetails from "../Modals/UserDetails";

const Header = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }

  const { logout, isAuthenticated, backendActor } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const [userDetails, setUserDetails] = useState(null);

  const getStatus = async () => {
    const getUser = await backendActor.getUser();
    if (getUser.err === "New user") {
      // navigate("/register");
    } else {
      setUserDetails(getUser.ok);
      toast.success("You are registered");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getStatus();
    } else {
      // toast.error("You are logged out");
    }
  }, [isAuthenticated]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  return (
    <nav className="relative z-20 text-white bg-gradient-to-r from-[#FFFFFF00] to-[#9999992B] shadow-lg px-[9%] py-9 flex justify-between items-center ">
      <div className="flex items-center">
        <img
          src={logo}
          alt="Logo"
          className="md:h-[50px] w-[132px] md:w-[167px] lg:w-[200px]"
          draggable="false"
        />
      </div>

      <div className="hidden px-2   md:flex space-x-8">
        <a
          href="#home"
          onClick={() => handleSectionClick("home")}
          className={`decoration-pink-400 underline-offset-8 ${
            activeSection === "home" ? "underline" : "decoration-transparent"
          }`}
        >
          <GradientText children="Home" />
        </a>
        <a
          href="#our-team"
          onClick={() => handleSectionClick("our-team")}
          className={`decoration-pink-400 underline-offset-8 ${
            activeSection === "our-team"
              ? "underline "
              : "decoration-transparent"
          }`}
        >
          <GradientText children="Our Team" />
        </a>
        <a
          href="#contact-us"
          onClick={() => handleSectionClick("contact-us")}
          className={`decoration-pink-400 underline-offset-8 ${
            activeSection === "contact-us"
              ? "underline "
              : "decoration-transparent"
          }`}
        >
          <GradientText children="Contact Us" />
        </a>
        <a
          href="#lets-cook"
          onClick={() => handleSectionClick("lets-cook")}
          className={`decoration-pink-400 underline-offset-8 ${
            activeSection === "lets-cook"
              ? "underline "
              : "decoration-transparent"
          }`}
        >
          <GradientText children="Let's Cook" />
        </a>
      </div>
      <div>
        {isAuthenticated ? (
          <div>
            {<UserDetails modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />}
          </div>
        ) : (
          <JoinWaitlist modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
        )}
      </div>
    </nav>
  );
};

export default Header;
