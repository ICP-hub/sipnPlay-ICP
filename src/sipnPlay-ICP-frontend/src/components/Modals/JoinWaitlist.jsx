import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import AnimationButton from '../../common/AnimationButton';
import Modal from 'react-modal';
import bgImage from "../../assets/images/waitlistBg.png";
import alien from "../../assets/images/alien.png";
import { BsDiscord, BsTelegram, BsTwitterX } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAuth } from "../../utils/useAuthClient";
import toast from 'react-hot-toast';

const JoinWaitlist = ({ modalIsOpen, setIsOpen }) => {
    const { backendActor } = useAuth();
    
    function closeModal() {
        setIsOpen(false);
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [icpAddress, setIcpAddress] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !icpAddress) {
            toast.error('Please fill all required fields.');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        if (icpAddress.trim() === '') {
            toast.error('Please enter a valid ICP address.');
            return;
        }

        const response = await backendActor.joinWaitlist(name, email, icpAddress);
        if (response.ok) {
            toast.success(response.ok);
            setName('');
            setEmail('');
            setIcpAddress('');
            closeModal();
        } else {
            toast.error("Error sending response");
        }
    };

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                className="fixed  inset-0 flex items-center justify-center bg-transparent"
                overlayClassName="fixed z-[100] inset-0 bg-gray-800 bg-opacity-50"
            >
                <div
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    className='bg-black p-[15px] md:p-[35px]   relative grid grid-cols-1 md:grid-cols-2 md:top-[7%] w-[370px]  md:h-[578px] md:w-[70%] border border-[#696969] rounded-xl'
                >
                    <p className='text-white absolute font-monckeberg top-[20%] left-[5%] md:top-[20%] md:left-[25%]'>
                        <span className='text-5xl md:text-5xl lg:text-5xl lg1:text-7xl'>Join </span><br />
                        <span className='md:text-3xl lg:text-3xl lg1:text-5xl'>Waitlist</span>
                    </p>
                    <div className='relative flex  md:block'>
                        <img className=' w-[150px] h-[50px] md:w-[100px] lg:w-[131px]' draggable="false" src={logo} />
                        <img className='w-[200px] transform -scale-x-100 md:transform-none md:w-[200px] lg:w-[313px]  md:mt-0 md:absolute top-0 right-0 md:top-auto md:right-auto md:-bottom-9 md:-left-9 ' draggable="false" src={alien} />
                    </div>

                    <div className='w-full md:w-auto mt-8 md:mt-0'>
                        <button
                            onClick={closeModal}
                            className="text-white absolute top-4 right-4"
                        >
                            <ImCross />
                        </button>
                        <form onSubmit={handleSubmit} className="w-full   ">
                            <div className=" mb-4 ">
                                <label className="block text-white font-adam font-bold text-sm  md:mb-0.2" htmlFor="name">
                                    YOUR NAME
                                </label>
                                <input
                                    className="border-b-2 uppercase w-full  py-2 md:mb-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    // required
                                />
                            </div>
                            <div className="md:mb-4  ">
                                <label className="block text-white font-adam font-bold text-sm mb-0.2" htmlFor="email">
                                    EMAIL ADDRESS
                                </label>
                                <input
                                    className="border-b-2 uppercase w-full py-2 mb-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    // required
                                />
                            </div>
                            <div className="md:mb-6 ">
                                <label className="block text-white font-adam font-bold text-sm mb-0.2" htmlFor="message">
                                    Submit ICP Address
                                </label>
                                <input
                                    className="border-b-2 uppercase w-full py-2 mb-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                                    type='text'
                                    id="icpAddress"
                                    value={icpAddress}
                                    onChange={(e) => setIcpAddress(e.target.value)}
                                    // required
                                />
                            </div>
                            <div className='flex mb-4 justify-center md:justify-end'>
                                <AnimationButton text='Submit' />
                            </div>
                        </form>

                        <div className='flex flex-col md:flex-row md:justify-end mt-12 mb-7 text-white gap-3 items-center md:items-end'>
                            <p className='font-adam font-[300] text-white text-[20px] text-center md:text-left'>Follow us on</p>
                            <div className='flex gap-3 mt-2 md:mt-0'>
                                <Link to="https://discord.com/invite/6PmNCezvG4" target="__blank"><BsDiscord size={33} /></Link>
                                <Link to="https://t.me/+BpcBOPokAFtmYWE1" target="__blank"><BsTelegram size={33} /></Link>
                                <Link to="https://x.com/SipnPlayGames" target="__blank"><BsTwitterX size={33} /></Link>

                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default JoinWaitlist;
