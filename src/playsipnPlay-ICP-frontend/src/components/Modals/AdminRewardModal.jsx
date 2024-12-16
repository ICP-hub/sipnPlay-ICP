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
  console.log("reward tokens array object", rewardTokens);
  const { backendActor } = useAuth();
  const [isInProcess, setIsInProcess] = useState(false);

  const handleBtnClick = async () => {
    try {
      setIsInProcess(true);
      if (primaryBtnText === "Reset") {
        const setResp = await backendActor.game_reset(gameName);
        if (setResp.Ok) {
          toast.success("Reset successful");
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
      className="fixed inset-y-72 inset-x-96 flex items-center justify-center bg-transparent"
      overlayClassName="fixed z-[100] inset-y-72 inset-x-[32rem] rounded-lg"
    >
      <div className="relative bg-stone-50 rounded-2xl p-8">
        <h2 className="font-bold text-2xl text-center mb-4">{header}</h2>
        <ImCross
          className="absolute top-4 right-4 cursor-pointer"
          onClick={closeModal}
        />

        <p className="font-semibold">{description}</p>
        <div className="flex place-items-end place-self-end mt-8">
          <button
            onClick={closeModal}
            className="px-4 py-2 mr-4 bg-stone-400 hover:bg-stone-300 transition-colors duration-300 text-black rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 bg-${btnColour.toLowerCase()}-600 hover:bg-${btnColour.toLowerCase()}-500 transition-colors duration-300 text-white rounded-md cursor-pointer ${
              isInProcess && "opacity-50 hover:cursor-not-allowed"
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
