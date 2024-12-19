import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import Modal from "react-modal";
import { useAuth } from "../../utils/useAuthClient";
import toast from "react-hot-toast";

const AdminRewardModal = ({
  isOpen,
  closeModal,
  header,
  description,
  primaryBtnText,
  btnColour,
  rewardTokens = [],
  getPlayers,
  gameName,
}) => {
  const { backendActor } = useAuth();
  const [isInProcess, setIsInProcess] = useState(false);

  const handleBtnClick = async () => {
    try {
      setIsInProcess(true);
      if (primaryBtnText === "Reset") {
        const setResp = await backendActor.game_reset(gameName);
        if (setResp.Ok) {
          toast.success("Reset successful");
          closeModal();
          getPlayers();
        } else {
          toast.error("Some error occured");
        }
      }
      if (primaryBtnText == "Reward") {
        const setResp = await backendActor.reward_distribution(rewardTokens);
        if (setResp.Err) {
          toast.error(setResp.Err);
        } else {
          toast.success("distributed successfully");
          closeModal();
        }
        console.log(setResp);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsInProcess(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      contentLabel="Admin Reset/Reward Leaderboard Modal"
      className="relative flex items-center justify-center bg-transparent w-1/2 md:w-full"
      overlayClassName="fixed z-[100] inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <div className="relative bg-stone-800 text-white border-2 border-white rounded-2xl p-8">
        <h2 className="font-bold text-center mb-4 text-xl md:text-2xl">
          {header}
        </h2>
        <ImCross
          className="absolute top-4 right-4 cursor-pointer"
          onClick={closeModal}
        />

        <p className="font-semibold text-xs sm:text-base">{description}</p>
        <div className="flex place-items-end place-self-end mt-8">
          <button
            onClick={closeModal}
            className="px-4 py-2 mr-4 bg-stone-50 hover:bg-stone-300 transition-colors duration-300 text-black rounded-md cursor-pointer text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 bg-${btnColour.toLowerCase()}-600 hover:bg-${btnColour.toLowerCase()}-500 transition-colors duration-300 text-white rounded-md cursor-pointer text-sm md:text-base ${
              isInProcess ? "opacity-50 hover:cursor-not-allowed" : ""
            }`}
            onClick={handleBtnClick}
          >
            {isInProcess ? "Processing..." : primaryBtnText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AdminRewardModal;
