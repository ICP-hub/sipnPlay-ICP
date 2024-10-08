import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/useAuthClient";
import toast from "react-hot-toast";
import ConnectWallet from "../components/Modals/ConnectWallets";
import * as XLSX from "xlsx";
import PaginatedData from "../components/Admin/PaginatedData";
import Resources from "../components/Admin/Resources";
import { Oval } from "react-loader-spinner";
import { convertNanosecondsToDateTime } from "../../../sipnPlay-ICP-frontend/src/utils/helpers";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("waitlist");
  const [waitlist, setWaitlist] = useState([]);
  const [messages, setMessages] = useState([]);
  const [waitlistPage, setWaitlistPage] = useState(0);
  const [waitlistPageSize, setWaitlistPageSize] = useState(0);
  const [messagelistPageSize, setMessagelistPageSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messagesPage, setMessagesPage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { backendActor, logout, principal, isAuthenticated } = useAuth();

  const chunkSize = 50;

  const fetchWaitlist = async (page) => {
    try {
      setLoading(true);
      const response = await backendActor.getWaitlist(chunkSize, page);
      if (response.err) {
        toast.error(response.err);
        setWaitlist([]);
        setLoading(false);
        return;
      } else if (response.ok) {
        setWaitlist(response.ok.data);
        setWaitlistPageSize(response.ok.total_pages);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching waitlist data:", error);
      toast.error("Error fetching waitlist data");
    }
  };

  const fetchMessages = async (page) => {
    try {
      setLoading(true);
      const response = await backendActor.getMessages(chunkSize, page);
      if (response.err) {
        toast.error(response.err);
        setMessages([]);
        setLoading(false);
        return;
      } else if (response.ok) {
        setMessages(response.ok.data);
        setMessagelistPageSize(response.ok.total_pages);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching messages data:", error);
      toast.error("Error fetching messages data");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    const checkApproveStatus = async () => {
      setIsApproving(true);
      if (isAuthenticated) {
        let isApproved = false;
        try {
          console.log("whoami", await backendActor.whoAmI2());

          isApproved = await backendActor.amIApproved();
        } catch (error) {
          console.error("Error checking approval status:", error);
        } finally {
          setIsApproving(false);
          if (isApproved && isAuthenticated) {
            setIsLoggedIn(true);
          }
        }
      }
    };
    checkApproveStatus();
  }, [isAuthenticated, principal]);

  useEffect(() => {
    if (isAuthenticated && isLoggedIn) {
      if (activeSection === "waitlist") {
        fetchWaitlist(waitlistPage);
      } else if (activeSection === "messages") {
        fetchMessages(messagesPage);
      }
    }
  }, [activeSection, waitlistPage, messagesPage, isLoggedIn]);

  const handlePrevWaitlist = () => {
    if (waitlistPage === 0) {
      toast.error("No previous pages");
      return;
    }
    setWaitlistPage((prev) => prev - 1);
  };

  const handleNextWaitlist = () => {
    if (waitlistPage === Number(waitlistPageSize) - 1) {
      toast.error("No more pages");
      return;
    }
    setWaitlistPage((prev) => prev + 1);
  };

  const handlePrevMessage = () => {
    if (messagesPage === 0) {
      toast.error("No previous pages");
      return;
    }
    setMessagesPage((prev) => prev - 1);
  };

  const handleNextMessage = () => {
    if (messagesPage === Number(messagelistPageSize) - 1) {
      toast.error("No more pages");
      return;
    }
    setMessagesPage((prev) => prev + 1);
  };

  const handleDownload = () => {
    const data = activeSection === "waitlist" ? waitlist : messages;
    const updatedData = data.map((item) => ({
      ...item,
      date: convertNanosecondsToDateTime(item.date),
    }));
    const worksheet = XLSX.utils.json_to_sheet(updatedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeSection);
    XLSX.writeFile(workbook, `${activeSection}.xlsx`);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <ConnectWallet modalIsOpen={true} />
      </div>
    );
  }

  if (isAuthenticated && !isLoggedIn) {
    return (
      <div className="p-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-black border-[#d83b95] border-2 transition-all duration-300 hover:bg-[#d839b5] text-white rounded-lg mb-4"
        >
          Logout
        </button>
        {isApproving ? (
          <Oval
            color="#EE3EC9"
            secondaryColor="#333"
            height={50}
            width={50}
            wrapperClass="flex justify-center items-center"
          />
        ) : (
          <p>Your account is not an approved admin </p>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 text-xs sm:text-sm md:text-md lg:text-lg ">
      <div className="flex justify-between p-8 ">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-black border-[#d83b95] border-2 transition-colors duration-300 hover:bg-[#d839b5] text-white rounded-lg mb-4"
        >
          Logout
        </button>

        {activeSection !== "resources" && (
          <button
            onClick={handleDownload}
            className="px-4 bg-[#EE3EC9] text-white rounded-lg"
          >
            Download Page's Data
          </button>
        )}
      </div>

      <div className="items-center my-12 border-y-[1px] border-[#ee3ec9] mx-12">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveSection("waitlist")}
            className={`w-full py-4 min-h-full text-white rounded-lg hover:bg-[#e665ca] hover:rounded-lg transition-colors duration-300 ${
              activeSection === "waitlist" ? "bg-[#ee3ec9] " : "bg-black "
            }`}
          >
            Waitlist
          </button>
          <button
            onClick={() => setActiveSection("messages")}
            className={`w-full py-2 text-white rounded-lg hover:bg-[#e665ca] hover:rounded-lg transition-colors duration-300 ${
              activeSection === "messages"
                ? "bg-[#EE3EC9] text-white"
                : "bg-black "
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveSection("resources")}
            className={`w-full py-2 text-white rounded-lg hover:bg-[#e665ca] hover:rounded-lg transition-colors duration-300  ${
              activeSection === "resources"
                ? "bg-[#EE3EC9] "
                : "bg-black text-white"
            }`}
          >
            Resources
          </button>
        </div>
      </div>
      {loading ? (
        <Oval
          color="#EE3EC9"
          secondaryColor="#333"
          height={50}
          width={50}
          wrapperClass="flex justify-center items-center"
        />
      ) : (
        <div>
          {activeSection === "waitlist" && (
            <PaginatedData
              title="Principal"
              data={waitlist}
              handlePrev={handlePrevWaitlist}
              handleNext={handleNextWaitlist}
            />
          )}
          {activeSection === "messages" && (
            <PaginatedData
              title="Messages"
              data={messages}
              handlePrev={handlePrevMessage}
              handleNext={handleNextMessage}
            />
          )}
          {activeSection === "resources" && <Resources />}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
