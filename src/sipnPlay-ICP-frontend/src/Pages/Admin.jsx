import React, { useState, useEffect } from 'react';
import { useAuth } from "../utils/useAuthClient";
import toast from 'react-hot-toast';
import ConnectWallet from "../components/Modals/ConnectWallets";
import * as XLSX from 'xlsx';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('waitlist');
  const [waitlist, setWaitlist] = useState([]);
  const [messages, setMessages] = useState([]);
  const [waitlistPage, setWaitlistPage] = useState(0);
  const [waitlistPageSize, setWaitlistPageSize] = useState(0);
  const [messagelistPageSize, setMessagelistPageSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messagesPage, setMessagesPage] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { backendActor, login, logout, principal, isAuthenticated, reloadLogin } = useAuth();
  const chunkSize = 10;

  const [modalIsOpen, setIsOpen] = useState(false);

  const fetchWaitlist = async (page) => {
    try {
      setLoading(true);
      const response = await backendActor.getWaitlist(chunkSize, page);
      if (response.err) {
        setLoading(false);
        return;
      }
      setWaitlist(response.data);
      setWaitlistPageSize(response.total_pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching waitlist data:', error);
      toast.error('Error fetching waitlist data');
    }
  };

  const fetchMessages = async (page) => {
    try {
      setLoading(true);
      const response = await backendActor.getMessages(chunkSize, page);
      if (response.error) {
        setLoading(false);
        return;
      }
      setMessages(response.data);
      setMessagelistPageSize(response.total_pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages data:', error);
      toast.error('Error fetching messages data');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  useEffect(() => {
    const approvedPrincipals = [
      "6xm33-dd2dg-pd6fa-iiojc-ptsbh-elqne-o4zqv-ipjho-5y4am-mfi53-hqe",
      "r6cnl-jzddp-n4rcj-e7hkn-ojjfu-pyejv-ekydi-wpstx-34h2g-3hiwh-pqe",
      "hle4j-ceoqz-bnsym-4tzlr-yqdbo-d7vng-ez6hr-wtgc2-rjnxz-xwomp-qqe",
      "oaegv-sluud-uzs7h-if5kr-jrcgt-prcth-xtr5d-5so2p-ldrm3-t73qb-mae"
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
    if (isAuthenticated) {
      fetchWaitlist(waitlistPage);
      fetchMessages(messagesPage);
    }
  }, [isAuthenticated, waitlistPage, messagesPage]);

  useEffect(() => {
    if (isAuthenticated && isLoggedIn) {
      if (activeSection === 'waitlist') {
        fetchWaitlist(waitlistPage);
      } else if (activeSection === 'messages') {
        fetchMessages(messagesPage);
      }
    }
  }, [activeSection, waitlistPage, messagesPage]);

  const handlePrevWaitlist = () => {
    if (waitlistPage === 0) {
      toast.error("No previous pages");
      return;
    }
    setWaitlistPage(prev => prev - 1);
  }

  const handleNextWaitlist = () => {
    if (waitlistPage === Number(waitlistPageSize) - 1) {
      toast.error("No more pages");
      return;
    }
    setWaitlistPage(prev => prev + 1)
  }

  const handlePrevMessage = () => {
    if (messagesPage === 0) {
      toast.error("No previous pages");
      return;
    }
    setMessagesPage(prev => prev - 1);
  }

  const handleNextMessage = () => {
    if (messagesPage === Number(messagelistPageSize) - 1) {
      toast.error("No more pages");
      return;
    }
    setMessagesPage(prev => prev + 1)
  }

  const handleDownload = () => {
    const data = activeSection === 'waitlist' ? waitlist : messages;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeSection);
    XLSX.writeFile(workbook, `${activeSection}.xlsx`);
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Login
        </button>
        <ConnectWallet modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
      </div>
    );
  }

  if (isAuthenticated && !isLoggedIn) {
    return (
      <div className='p-6'>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg mb-4"
        >
          Logout
        </button>
        <p>Your account is not an approved admin </p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg mb-4"
        >
          Logout
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Download Page's Data
        </button>
      </div>

      <div className="flex justify-center mb-4">
        <div className="flex">
          <button
            onClick={() => setActiveSection('waitlist')}
            className={`px-4 py-2 rounded-l-lg ${activeSection === 'waitlist' ? 'bg-blue-500 text-black' : 'bg-gray-200 text-gray-700'}`}
          >
            Waitlist
          </button>
          <button
            onClick={() => setActiveSection('messages')}
            className={`px-4 py-2 rounded-r-lg ${activeSection === 'messages' ? 'bg-blue-500 text-black' : 'bg-gray-200 text-gray-700'}`}
          >
            Messages
          </button>
        </div>

      </div>
      {loading ? <div className='text-white text-[18px] mt-[34px] text-center font-adam'>
        Loading ....
      </div> :
        <div>
          {activeSection === 'waitlist' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Waitlist</h2>
              <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-black divide-y divide-gray-200">
                    {waitlist.map((item, index) => (
                      <tr key={`waitlist${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.icpAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handlePrevWaitlist}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNextWaitlist}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'messages' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Messages</h2>
              <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-black divide-y divide-gray-200">
                    {messages.map((item, index) => (
                      <tr key={`message${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handlePrevMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNextMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      }
    </div>
  );
};

export default AdminPanel;
