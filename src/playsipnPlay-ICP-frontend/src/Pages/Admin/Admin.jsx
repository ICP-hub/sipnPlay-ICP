import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/useAuthClient";
import toast from "react-hot-toast";
import ConnectWallet from "../../components/Modals/ConnectWallets";
import * as XLSX from "xlsx";
import PaginatedData from "./PaginatedData";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("waitlist");
  const [waitlist, setWaitlist] = useState([]);
  const [addAmount, setAddAmount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [waitlistPage, setWaitlistPage] = useState(0);
  const [waitlistPageSize, setWaitlistPageSize] = useState(0);
  const [messagelistPageSize, setMessagelistPageSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messagesPage, setMessagesPage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {
    backendActor,
    login,
    logout,
    principal,
    isAuthenticated,
    reloadLogin,
  } = useAuth();
  const chunkSize = 10;

  const [modalIsOpen, setIsOpen] = useState(false);

  const addMoney = async (e) => {
    e.preventDefault();
    const response = await backendActor.addMoney(parseInt(addAmount));
    console.log(response);
    toast.success("Money added");
  };

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
    const approvedPrincipals = [
      // MAIN
      "oxj2h-r6fbj-hqtcn-fv7ye-yneeb-ca3se-c6s42-imvp7-juu33-ovnix-mae", //Paras (Client)
      "42l52-e6bwv-2353f-idnxh-5f42y-catp6-j2yxn-msivr-ljpu2-ifqsy-dqe", //Ankur (Client)
      "h5plh-utklh-zb3a6-6l4ar-6yytf-p3755-6rjjz-7fwm3-vtnsa-iosdg-4ae", //Tushar

      // Developers
      "2nh3q-od732-potbk-gs2yh-nkqyt-i4xtt-fs73b-iirbu-ows4f-glqf5-qae", // Somiya Behera
      "qpi67-2c7z4-3efq2-jnzvv-xdoik-xb72q-4y6ms-mjfwt-7aogy-4it4b-uqe", //Tushar Jain

      "yyjkq-j3ybi-yhe2a-ujlbc-wqxof-ttj65-et3zg-2jsxg-wpa7s-t5lbv-rqe", //Sharan Sir
      "ajgvz-x3hvi-wvqt2-2r2eb-3hfqx-hxupi-2rnlt-iiott-w6kk2-625vc-uae",
    ];
    if (isAuthenticated) {
      if (approvedPrincipals.includes(principal)) {
        setIsLoggedIn(true);
      } else {
        toast.error("Your account is not an approved admin");
      }
    }
  }, [principal]);

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
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeSection);
    XLSX.writeFile(workbook, `${activeSection}.xlsx`);
  };

  console.log(principal);

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
        <p>Your account is not an approved admin </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between p-8">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-black border-[#d83b95] border-2 transition-colors duration-300 hover:bg-[#d839b5] text-white rounded-lg mb-4"
        >
          Logout
        </button>
        <form onSubmit={addMoney}>
          <input
            type="number"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            className="rounded-lg px-3 text-black  h-11"
          />
          <button className="bg-[#EE3EC9] rounded-lg px-4 py-2 ml-3">
            Submit
          </button>
        </form>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-[#EE3EC9] text-white rounded-lg"
        >
          Download Page's Data
        </button>
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
        <div className="text-white text-[18px] mt-[34px] text-center font-adam">
          Loading ....
        </div>
      ) : (
        <div>
          {activeSection === "waitlist" && (
            <PaginatedData
              title="Waitlist"
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
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
