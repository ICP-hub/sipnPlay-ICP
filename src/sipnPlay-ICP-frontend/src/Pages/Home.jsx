import React, { useEffect, useState } from 'react';
import { useAuth } from "../utils/useAuthClient";
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import Modal from 'react-modal'; // You might need to install this
import SendMessage from '../components/HomePageComponents/SendMessage';

Modal.setAppElement('#root');

function Home() {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated, backendActor } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
    <div className="p-4">
      {!isAuthenticated ? (
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
        isOpen={modalIsOpen}
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
      </Modal>
      <SendMessage />
    </div>
  );
}

export default Home;
