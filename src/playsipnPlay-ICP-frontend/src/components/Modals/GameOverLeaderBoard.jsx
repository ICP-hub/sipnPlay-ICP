import React from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { ImCross } from 'react-icons/im';
import { AiFillHome } from 'react-icons/ai';
import { Oval } from 'react-loader-spinner';
import userProfilePic from "../../assets/images/DefaultUserPic.svg";
import Crown from "../../assets/images/Crown.svg";
import AnimationButton from "../../common/AnimationButton";
import { useAuth } from "../../utils/useAuthClient";

const GameOverLeaderBoard = ({ game, isGameOver, closeModal }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [userRank, setUserRank] = React.useState(0);
  const { backendActor } = useAuth();
  const navigate = useNavigate();

  const fetchLeaderboard = async (gameName) => {
    try {
      const [leaderboardResult, userRankResult] = await backendActor.get_leaderboard(gameName);
      
      if (leaderboardResult.Ok) {
        setLeaderboard(leaderboardResult.Ok);
        setUserRank(Number(userRankResult.toString()));
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboard([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isGameOver && game?.name) {
      fetchLeaderboard(game.name);
    }
  }, [isGameOver, game?.name]);

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Modal
      isOpen={isGameOver}
      onRequestClose={closeModal}
      contentLabel="GameOver Modal"
      className="fixed inset-2 sm:inset-4 md:inset-6 lg:inset-8 rounded-xl flex items-center justify-center bg-transparent"
      overlayClassName="fixed z-[100] inset-0 bg-black/10 backdrop-blur-sm"
    >
      <div className="w-full h-full flex items-center justify-center">
        {isLoading ? (
          <Oval color="#ee3ec9" secondaryColor="#fff" height={48} width={48} />
        ) : (
          <div className="overflow-y-auto w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[80vw] mx-auto max-h-[96vh] sm:max-h-[92vh] md:max-h-[88vh] lg:max-h-[84vh] rounded-lg p-2 sm:p-3 md:p-6 lg:p-8 relative bg-black/60 backdrop-blur-sm text-white">
            <div className="absolute right-4 top-4 flex items-center gap-4">
              <ImCross
                className="cursor-pointer text-white"
                onClick={handleHomeClick}
                size={20}
              />
            </div>

            <h3 className="text-center mx-[5%] md:mx-[9%] font-monckeberg mb-2 md:mb-4 font-bold text-lg md:text-xl mt-6 md:mt-8">
              Leaderboard
            </h3>
            <p className="font-[500] font-adam mb-16 md:mb-24 lg:mb-28 text-sm md:text-base text-center">
              <span className="font-bold ">NOTE : </span>
              The leaderboard updates every 2 minutes
            </p>

            <div className="flex justify-evenly h-[150px] md:h-[180px] lg:h-[202px]">
              {leaderboard.length === 0 ? (
                <p>No users in the leaderboard yet.</p>
              ) : (
                <>
                  {/* Silver */}
                  <div className="h-3/4 w-full mt-auto relative text-center border border-[#EE3EC9]">
                    <img
                      className="h-[40px] md:h-[50px] lg:h-[60px] absolute rounded-full left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 border-[3px] md:border-[4px] border-gray-200"
                      src={userProfilePic}
                      alt="Second place"
                    />
                    <div className="mt-8 md:mt-12 lg:mt-14 text-xs md:text-sm lg:text-base px-1 md:px-2">
                      {leaderboard[1] && (
                        <>
                          <p className="font-bold truncate max-w-[60px] md:max-w-[70px] lg:max-w-[90px] mx-auto">
                            {leaderboard[1].owner.toText()}
                          </p>
                          <p className="text-[10px] md:text-xs">
                            {leaderboard[1].points} pts
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Gold */}
                  <div className="h-full w-full relative text-center border border-[#EE3EC9]">
                    <div>
                      <img
                        className="h-[40px] md:h-[50px] lg:h-[60px] absolute rounded-full left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 border-[3px] md:border-[4px] border-yellow-400"
                        src={userProfilePic}
                        alt="First place"
                      />
                      <img
                        className="absolute h-[40px] md:h-[50px] lg:h-[60px] left-1/2 -top-1/4 transform -translate-x-1/2 -translate-y-1/2"
                        src={Crown}
                        alt="Crown"
                      />
                      <div className="mt-12 md:mt-16 lg:mt-20 text-xs md:text-sm lg:text-base px-1 md:px-2">
                        {leaderboard[0] && (
                          <>
                            <p className="font-bold truncate max-w-[60px] md:max-w-[70px] lg:max-w-[90px] mx-auto">
                              {leaderboard[0].owner.toText()}
                            </p>
                            <p className="text-[10px] md:text-xs">
                              {leaderboard[0].points} pts
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bronze */}
                  <div className="h-1/2 w-full mt-auto relative text-center border border-[#EE3EC9]">
                    <img
                      className="h-[40px] md:h-[50px] lg:h-[60px] absolute rounded-full left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 border-[3px] md:border-[4px] border-[#cd7f32]"
                      src={userProfilePic}
                      alt="Third place"
                    />
                    <div className="mt-8 md:mt-10 text-xs md:text-sm lg:text-base px-1 md:px-2">
                      {leaderboard[2] && (
                        <>
                          <p className="font-bold truncate max-w-[60px] md:max-w-[70px] lg:max-w-[90px] mx-auto">
                            {leaderboard[2].owner.toText()}
                          </p>
                          <p className="text-[10px] md:text-xs">
                            {leaderboard[2].points} pts
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Leaderboard List */}
            <div className="overflow-y-auto max-h-[250px] md:max-h-[300px] lg:max-h-[400px] mt-8">
              {leaderboard[userRank - 1] && (
                <div className="flex items-center bg-opacity-20 bg-white justify-between p-2 md:p-4 my-2 md:my-4 border-2 border-[#ee3ec9]">
                  <div className="flex items-center">
                    <span className="text-xs md:text-sm mr-1 md:mr-2"># {userRank}</span>
                    <img
                      src={userProfilePic}
                      alt="Your rank"
                      className="h-6 md:h-8 rounded-full mr-1 md:mr-2"
                    />
                    <span className="text-xs md:text-sm truncate max-w-[120px] md:max-w-[165px] lg:max-w-[239px]">
                      You
                    </span>
                  </div>
                  <span className="text-xs md:text-sm text-end">
                    {leaderboard[userRank - 1].points} pts
                  </span>
                </div>
              )}

              {leaderboard.map((user, index) => (
                <div
                  key={user.owner.toText()}
                  className={`flex items-center justify-between p-2 md:p-4 my-2 md:my-4 border-2 ${
                    index === 0
                      ? 'border-[#ffd700]'
                      : index === 1
                      ? 'border-[#c0c0c0]'
                      : index === 2
                      ? 'border-[#cd7f32]'
                      : 'border-[#ee3ec9]'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-xs md:text-sm mr-1 md:mr-2"># {index + 1}</span>
                    <img
                      src={userProfilePic}
                      alt={user.owner.toText()}
                      className="h-6 md:h-8 rounded-full mr-1 md:mr-2"
                    />
                    <span className="text-xs md:text-sm truncate max-w-[120px] md:max-w-[165px] lg:max-w-[239px]">
                      {user.owner.toText()}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm text-end">{user.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GameOverLeaderBoard;