import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import Modal from "react-modal";

const Rewards = () => {
  const [activeLink, setActiveLink] = useState("tetris");
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function handleLinkClick(section) {
    setActiveLink(section);
  }
  return (
    <div className="flex">
      <div className="flex-col border-r-2 border-[#696969] w-1/4 items-center justify-center px-16">
        <div>Tetris</div>
      </div>
      <div className="flex flex-col items-center w-3/4">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 mb-8"
        >
          Reset Leaderboard
        </button>
        <p className="text-center text-sm">
          NOTE - Resetting the leaderboard will remove all the users and their
          points from the leaderboard table. This action can't be undone!
        </p>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          shouldCloseOnEsc={true}
          shouldCloseOnOverlayClick={true}
          contentLabel="Reset Leaderboard Modal"
          className="fixed inset-y-72 inset-x-96 flex items-center justify-center bg-transparent"
          overlayClassName="fixed z-[100] inset-y-72 inset-x-[32rem] bg-stone-50 rounded-lg"
        >
          <div className="relative p-8">
            <h2 className="font-bold text-2xl text-center mb-4">
              Reset Leaderboard
            </h2>
            <ImCross
              className="absolute top-8 -right-8 cursor-pointer"
              onClick={closeModal}
            />

            <p className="font-semibold">
              Are you sure you want to reset the leaderboard?
            </p>
            <p className=" font-semibold">This action can't be undone!</p>
            <div className="flex place-items-end place-self-end mt-8">
              <button
                onClick={closeModal}
                className="px-4 py-2 mr-4 bg-stone-400 hover:bg-stone-300 transition-colors duration-300 text-black rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-500 transition-colors duration-300 text-white rounded-md cursor-pointer">
                Reset
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Rewards;
