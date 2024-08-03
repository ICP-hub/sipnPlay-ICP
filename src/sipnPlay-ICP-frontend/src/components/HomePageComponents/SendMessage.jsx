import React, { useState } from 'react';
import AnimationButton from '../../common/AnimationButton';
import { useAuth } from "../../utils/useAuthClient"
import toast from 'react-hot-toast';

const SendMessage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const { backendActor } = useAuth();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

   
    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            toast.error('Please fill all required fields.');
            return;
        }
    
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }
    
        const response = await backendActor.sendMessage(name,email,message);
        if(response.ok){
            toast.success(response.ok)
        }else{
            toast.error("Error sending message");
        }
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div id='contact-us' className="flex flex-col md:flex-row px-4 md:px-[9%] pb-[147px] relative z-20 overflow-hidden mt-20">
            <h2 className="text-4xl md:text-6xl font-monckeberg mt-4 md:mt-[2%] text-white text-center md:text-left">
                Send us a message
            </h2>
            <form className="p-4 md:p-8 rounded-lg shadow-md w-full mt-4 md:mt-0 md:ml-10 bg-black bg-opacity-80" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-[14px] md:text-[22.5px] text-white font-adam font-bold text-sm mb-2" htmlFor="name">
                        YOUR NAME
                    </label>
                    <input
                        className="border-b-2 w-full py-2 mb-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-[14px] md:text-[22.5px] text-white font-adam font-bold text-sm mb-2" htmlFor="email">
                        EMAIL ADDRESS
                    </label>
                    <input
                        className="border-b-2 w-full py-2 mb-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-[14px] md:text-[22.5px] text-white font-adam font-bold text-sm mb-2" htmlFor="message">
                        MESSAGE
                    </label>
                    <textarea
                        className="border-b-2 w-full py-2 mb-3 mt-4 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                        id="message"
                        rows="4"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>

                <div className="absolute bottom-0 md:-bottom-[300px] md:-right-[200px] rounded-full h-[700px] blur-lg opacity-70 w-[700px] pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(136, 47, 93, 0.4), rgba(169, 62, 62, 0.2), rgba(37, 29, 118, 0.2), transparent)',
                }}>
                </div>

                <div className="flex items-center justify-center md:justify-end mt-6">
                    <AnimationButton text="Send" />
                </div>
            </form>
        </div>
    );
};

export default SendMessage;
