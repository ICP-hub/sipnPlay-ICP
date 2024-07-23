import React, { useState } from 'react';

const SendMessage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the form submission
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);
        // Clear the form
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div className="flex  mt-20 min-h-screen bg-black-100">
           <h2 className="text-6xl  font-monckeberg  mt-[2%] ml-[9%]  text-white">
           Send us
                a message
            </h2>
            <form className=" p-8 rounded-lg shadow-md w-full mr-[9%] ml-10 " onSubmit={handleSubmit}>
               
                <div className="mb-4">
                    <label className="block text-White font-adam font-bold text-sm  mb-0.2" htmlFor="name">
                        YOUR NAME
                    </label>
                    <input
                        className=" border-b-2  w-full py-2 mb-3  text-white bg-black leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-White font-adam font-bold text-sm  mb-0.2" htmlFor="email">
                        EMAIL ADDRESS
                    </label>
                    <input
                        className=" border-b-2  w-full py-2 mb-3  text-white bg-black leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-White font-adam font-bold text-sm  mb-0.2" htmlFor="message">
                        MESSAGE
                    </label>
                    <textarea
                        className="border-b-2  w-full py-2 mb-3 mt-4  text-white bg-black leading-tight focus:outline-none focus:shadow-outline"
                        id="message"
                        rows="4"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="flex items-center justify-end">
                    <button
                        className="bg-transparent border border-pink-600 text-white font-bold py-2 px-6  focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SendMessage;
