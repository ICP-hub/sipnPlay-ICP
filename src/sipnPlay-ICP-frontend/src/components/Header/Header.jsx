import React, { useEffect, useState } from 'react';
import logo from '../../assets/images/logo.png';
import AnimationButton from '../../common/AnimationButton';
import GradientText from '../../common/GradientText';
import JoinWaitlist from '../Modals/JoinWaitlist';
import { useAuth } from "../../utils/useAuthClient";
import toast from "react-hot-toast";
import Modal from 'react-modal'; 
import { Link } from 'react-router-dom';

const Header = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
      setIsOpen(true);
  }
  
  const { login, logout, isAuthenticated, backendActor } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [modal1IsOpen, setModalIsOpen] = useState(false);

  const getStatus = async () => {
    const getUser = await backendActor.getUser();
    if (getUser.err === "New user") {
      // navigate("/register");
    } else {
      console.log(getUser.ok);
      setUserDetails(getUser.ok);
      toast.success("You are registered");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getStatus();
    } else { 
      toast.error("You are logged out");
    }
  }, [isAuthenticated]);

  const handleLogin = async (provider) => {
    try {
      await login(provider);
      setModalIsOpen(false);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };


  return (
    <nav className="relative   text-white bg-gradient-to-r from-[#FFFFFF00] to-[#9999992B] shadow-lg px-[9%] py-9 flex justify-between items-center ">

      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-[50px] w-[200px]"  draggable="false" />
      </div>

      <div className="hidden md:flex space-x-8">
        <a href="#home" className="underline hidden dlg:block decoration-pink-400 underline-offset-8">
          <GradientText children="Home" />
        </a>
        <a href="#our-team" className="hidden dlg:block"><GradientText children="Our Team" /></a>
        <a href="#contact-us" className="hidden dlg:block"><GradientText children="Contact Us" /></a>
        <a href="#lets-cook" className="hidden dlg:block"><GradientText children="Let's Cook" /></a>
      </div>
      <div>
        <AnimationButton onClick={openModal} text="Join Waitlist" />
        <JoinWaitlist modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
      </div>
      
      {/* {!isAuthenticated ? (
        <button
          onClick={() => setModalIsOpen(true)}
          className="bg-blue-500 font-monckeberg font-[700] text-[59px] rounded-lg px-6 py-3 text-white text-lg"
        >
          Login
        </button>
      ) : (
        <div>
          <button
            onClick={() => { logout(); window.location.reload(); }}
            className="bg-red-500 rounded-lg px-6 py-3 text-white text-lg"
          >
            Logout
          </button>
          {userDetails ? (
            <div className="mt-4">
              <h2 className="text-2xl font-bold">User Details</h2>
              <p><strong>Name:</strong> {userDetails.name}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Phone number:</strong> {userDetails.phoneNo.toString()}</p>
              <p><strong>Points:</strong> {userDetails.points.toString()}</p>
            </div>
          ) : (
            <div className="mt-4">
              <p>Please click <a href="/register" className="text-blue-500 underline">here</a> to complete registration.</p>
            </div>
          )}
        </div>
      )}

<Modal
        isOpen={modal1IsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="items-center flex justify-center bg-gray-800 bg-opacity-75 fixed inset-0"
      >
        <div className="bg-white flex flex-col rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <button
            onClick={() => handleLogin("ii")}
            className="bg-blue-500 rounded-lg px-6 py-3 text-white text-lg mb-4"
          >
            Login with ICP
          </button>
          <button
            onClick={() => handleLogin("nfid")}
            className="bg-blue-500 rounded-lg px-6 py-3 text-white text-lg"
          >
            Login with NFID
          </button>
        </div>
      </Modal> */}

    </nav>
  );
};

export default Header;
