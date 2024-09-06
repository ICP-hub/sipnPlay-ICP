import React, { useState, useEffect } from 'react';
import { useAuth } from "../utils/useAuthClient";
import toast from 'react-hot-toast';
import ConnectWallet from "../components/Modals/ConnectWallets";
import * as XLSX from 'xlsx';

function convertNanosecondsToDateTime(nanoseconds) {
  // Convert nanoseconds to milliseconds
  const milliseconds = Number(nanoseconds) / 1_000_000;

  // Create a new Date object with the milliseconds
  const date = new Date(milliseconds);

  const IST_OFFSET_MS = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const istDate = new Date(date.getTime() + IST_OFFSET_MS);


  // Extract date and time components
  const month = String(istDate.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(istDate.getUTCDate()).padStart(2, '0');
  const year = String(istDate.getUTCFullYear()).slice(-2); // Get last two digits of the year
  let hour = istDate.getUTCHours();
  const minute = String(istDate.getUTCMinutes()).padStart(2, '0');
  const isPM = hour >= 12;

  // Convert hour to 12-hour format
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'

  // Format AM/PM
  const period = isPM ? 'PM' : 'AM';

  // Format the date and time string
  return `${day}/${month}/${year} ${hour}:${minute}${period}`;
}

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('waitlist');
  const [waitlist, setWaitlist] = useState([]);
  const [addAmount, setAddAmount] = useState(0);
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

  const addMoney = async (e) => {
    e.preventDefault();
    const response = await backendActor.addMoney(parseInt(addAmount));
    console.log(response);
    toast.success("Money added");    
  }

  const fetchWaitlist = async (page) => {
    try {
      setLoading(true);
      const response = await backendActor.getWaitlist(chunkSize, page);
      if (response.err) {
        toast.error(response.err);
        setWaitlist([]);
        setLoading(false);
        return;
      }
      else if (response.ok) {
        setWaitlist(response.ok.data);
        setWaitlistPageSize(response.ok.total_pages);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching waitlist data:', error);
      toast.error('Error fetching waitlist data');
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
      }
      else if (response.ok) {
        setMessages(response.ok.data);
        setMessagelistPageSize(response.ok.total_pages);
        setLoading(false);
      }
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
      // MAIN
      "oxj2h-r6fbj-hqtcn-fv7ye-yneeb-ca3se-c6s42-imvp7-juu33-ovnix-mae", //Paras (Client)
      "42l52-e6bwv-2353f-idnxh-5f42y-catp6-j2yxn-msivr-ljpu2-ifqsy-dqe", //Ankur (Client)
      "33rak-wso5z-dulrq-sodoe-vdpc4-2ht7w-ac7xp-e4skt-ecmfc-h76zx-wqe", //Tushar

      // Developers
      "cgqj3-pk6l5-xnxdb-ehlkh-4p5o3-kwonc-gp5yh-iprtz-xbn4w-kl4op-vqe", // Somiya Behera
      "qpi67-2c7z4-3efq2-jnzvv-xdoik-xb72q-4y6ms-mjfwt-7aogy-4it4b-uqe", //Tushar Jain


      "yyjkq-j3ybi-yhe2a-ujlbc-wqxof-ttj65-et3zg-2jsxg-wpa7s-t5lbv-rqe", //Sharan Sir
      "ajgvz-x3hvi-wvqt2-2r2eb-3hfqx-hxupi-2rnlt-iiott-w6kk2-625vc-uae"
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
      if (activeSection === 'waitlist') {
        fetchWaitlist(waitlistPage);
      } else if (activeSection === 'messages') {
        fetchMessages(messagesPage);
      }
    }
  }, [activeSection, waitlistPage, messagesPage, isLoggedIn]);

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
        <form onSubmit={addMoney}>
          <input type='number' value={addAmount} onChange={(e) => setAddAmount(e.target.value)} className='rounded-lg px-3 text-black  h-11' />
          <button className='bg-blue-500 rounded-lg px-[19px] ml-3'>
            Submit
          </button>
        </form>
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
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 rounded-t-lg">
                  <thead className="bg-gray-100 rounded-t-lg">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-black divide-y divide-gray-200">
                    {waitlist && waitlist.length > 0 && waitlist.map((item, index) => (
                      <tr key={`waitlist${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">{convertNanosecondsToDateTime(item.date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                        <td className="px-6 py-4 ">{item.icpAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handlePrevWaitlist}
                    className="px-4 py-2 m-3 bg-blue-500 text-white rounded-lg"
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNextWaitlist}
                    className="px-4 py-2 m-3 bg-blue-500 text-white rounded-lg"
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
              <div className="bg-white shadow-md rounded-lg overflow-hidden">

                <table className="divide-y divide-gray-200 rounded-t-lg">
                  <thead className="bg-gray-100 rounded-t-lg">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-black divide-y divide-gray-200">
                    {messages && messages.length > 0 && messages.map((item, index) => (
                      <tr key={`message${index}`}>
                        <td className="px-6 py-4 whitespace-nowrap">{convertNanosecondsToDateTime(item.date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                        <td className="px-6 py-4">{item.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={handlePrevMessage}
                    className="px-4 py-2 m-3 bg-blue-500 text-white rounded-lg"
                  >
                    Prev
                  </button>
                  <button
                    onClick={handleNextMessage}
                    className="px-4 py-2 m-3 bg-blue-500 text-white rounded-lg"
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
