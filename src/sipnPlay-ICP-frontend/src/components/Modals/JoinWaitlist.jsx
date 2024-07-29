import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.png';
import AnimationButton from '../../common/AnimationButton'
import Modal from 'react-modal';
import bgImage from "../../assets/images/waitlistBg.png";
import alien from "../../assets/images/alien.png";
import { BsDiscord } from "react-icons/bs";
import { BsTelegram } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import { useAuth } from "../../utils/useAuthClient"
import toast from 'react-hot-toast';
const JoinWaitlist = ({ modalIsOpen, setIsOpen }) => {
    const { backendActor } = useAuth();
    function closeModal() {
        setIsOpen(false);
    }

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [icpAddress, setIcpAddress] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                className="fixed inset-0 flex items-center justify-center bg-transparent"
                overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
            >
                <div style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} className='bg-black p-[35px] relative grid grid-cols-2 w-[70%]'>

                    <div >
                        <img className='w-[131px]  ' draggable="false" src={logo} />
                        <img className='w-[313px] absolute bottom-0 left-0 ' draggable="false" src={alien} />
                    </div>
                    <div>
                        <button
                            onClick={closeModal}
                            className="text-white absolute top-4 right-4"
                        >
                            <ImCross />
                        </button>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-white font-adam font-bold text-sm  mb-0.2" htmlFor="name">
                                    YOUR NAME
                                </label>
                                <input
                                    className=" border-b-2 uppercase w-full py-2 mb-3  text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white font-adam font-bold text-sm  mb-0.2" htmlFor="email">
                                    EMAIL ADDRESS
                                </label>
                                <input
                                    className=" border-b-2 uppercase w-full py-2 mb-3  text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-white font-adam font-bold text-sm mb-0.2" htmlFor="message">
                                    Submit ICP Address
                                </label>
                                <input
                                    className="border-b-2 uppercase w-full py-2 mb-3  text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline"
                                    type='text'
                                    id="icpAddress"
                                    value={icpAddress}
                                    onChange={(e) => setIcpAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='flex mb-4 justify-end'>
                                <AnimationButton text='Submit' />
                            </div>
                        </form>
                        <div className='flex justify-end mt-12 mb-7 text-white gap-3'>
                            <p className='font-adam font-[300] text-white text-[20px] '>Follow us on</p>
                            <Link to="https://discord.com/invite/6PmNCezvG4" target="__blank" ><BsDiscord size={33} /></Link>
                            <Link to="https://t.me/+BpcBOPokAFtmYWE1" target="__blank" ><BsTelegram size={33} /></Link>
                            <Link to="https://x.com/SipnPlayGames" target="__blank" ><BsTwitterX size={33} /></Link>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default JoinWaitlist