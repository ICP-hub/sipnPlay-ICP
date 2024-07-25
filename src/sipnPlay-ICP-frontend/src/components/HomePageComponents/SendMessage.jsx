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
        <div className="flex mx-[9%]  mt-20 min-h-screen bg-black-100">
           <h2 className="text-6xl  font-monckeberg  mt-[2%]  text-white">
           Send us
                a message
            </h2>
            <form className=" relative p-8 rounded-lg shadow-md w-full ml-10 " onSubmit={handleSubmit}>
               
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
                    <label className="block text-White font-adam font-bold text-sm mb-0.2" htmlFor="message">
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
                
                <div
  className="absolute  right-0 w-[50%] h-[50%] "
  style={{
    backgroundImage: 'radial-gradient(circle, rgba(136, 47, 93, 0.4), transparent)',
    clipPath: 'circle(50% at 50% 100%)',
    transform: 'rotate(270deg)',
    transformOrigin: 'right',

   
  }}
>
</div>

                <div className="flex items-center justify-end " >
                
                    <button
                        className="bg-transparent border border-pink-600  text-white font-bold py-2 px-6 "
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
