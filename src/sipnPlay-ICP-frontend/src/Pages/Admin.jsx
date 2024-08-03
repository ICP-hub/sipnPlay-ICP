import React, { useState, useEffect } from 'react';


const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('waitlist');
  const [waitlist, setWaitlist] = useState([]);
  const [messages, setMessages] = useState([]);


  const fetchWaitlist = async () => {
    try {
      setWaitlist([]);
    } catch (error) {
      console.error('Error fetching waitlist data:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      setMessages([]);
    } catch (error) {
      console.error('Error fetching messages data:', error);
    }
  };

  // Load data when the component mounts
  useEffect(() => {
    fetchWaitlist();
    fetchMessages();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setActiveSection('waitlist')}
          className={`px-4 py-2 rounded-l-lg ${activeSection === 'waitlist' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Waitlist
        </button>
        <button
          onClick={() => setActiveSection('messages')}
          className={`px-4 py-2 rounded-r-lg ${activeSection === 'messages' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Messages
        </button>
      </div>

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
              <tbody className="bg-white divide-y divide-gray-200">
                {waitlist.map((item) => (
                  <tr key={item.principalId}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.principalId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
