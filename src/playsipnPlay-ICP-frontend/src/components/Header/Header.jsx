import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import GradientText from "../../common/GradientText";
import JoinWaitlist from "../Modals/JoinWaitlist";
import ConnectWallets from "../Modals/ConnectWallets";
import { useAuth } from "../../utils/useAuthClient";
import UserDetails from "../Modals/UserDetails";

const Header = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  

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
