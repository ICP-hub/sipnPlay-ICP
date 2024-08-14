import React, { useState } from 'react';
import AnimationButton from '../../common/AnimationButton';
import Modal from 'react-modal';
import bgImage from "../../assets/images/waitlistBg.png";

import { ImCross } from "react-icons/im";
import { useAuth } from "../../utils/useAuthClient";
import toast from 'react-hot-toast';

const JoinWaitlist = ({ modalIsOpen, setIsOpen }) => {
    const { backendActor, principal } = useAuth();
    console.log(backendActor, principal);

    function closeModal() {
        setIsOpen(false);
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Please fill all required fields.');
            return;
        }
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        const response = await backendActor.createUser(email);
        console.log(response);
        
        if (response !=="User already exists") {
            toast.success("Congrats!");
            setEmail('');
            closeModal();
        } else {
            toast.error("Email already Registered");
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
                    className='bg-black p-[15px] md:p-[35px]   relative grid grid-cols-1 md:grid-cols-2 md:top-[7%] w-[370px]  md:h-[278px] md:w-[70%] border border-[#696969] rounded-xl'
                >
                    <div className='w-full md:w-auto mt-8 md:mt-0'>
                        <button
                            onClick={closeModal}
                            className="text-white absolute top-4 right-4"
                        >
                            <ImCross />
                        </button>
                        <form onSubmit={handleSubmit} className="w-full   ">

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
                                />
                            </div>

                            <div className='flex mb-4 justify-center md:justify-end'>
                                <AnimationButton text='Register' />
                            </div>
                        </form>


                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default JoinWaitlist;
