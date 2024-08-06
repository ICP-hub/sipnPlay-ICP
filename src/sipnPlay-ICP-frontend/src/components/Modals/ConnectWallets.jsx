import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

import infinite from '../../assets/images/icons/infinity.png';
import id from '../../assets/images/icons/id.png';
import bifinity from '../../assets/images/icons/bifinity.png';
import plug from '../../assets/images/icons/plug.png';

import AnimationButton from '../../common/AnimationButton';
import Modal from 'react-modal';

import { RxCross1 } from "react-icons/rx";
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
                        
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                    className='bg-black p-[15px] md:p-[20px]   relative grid grid-cols-1 md:grid-cols-2 md:top-[7%] w-[370px]  md:h-[578px] md:w-[28%] border border-[#696969] rounded-xl'
                >
                    <p className='text-white absolute font-monckeberg top-[15%] left-[5%] md:top-[10%] md:left-[34%]'>
                        <span className='text-2xl md:text-2xl lg:text-3xl lg1:text-4xl'>Wallets </span>
                    </p>
                    <div className='relative flex  md:block'>
                        <img className=' w-[150px] h-[50px] md:w-[100px] lg:w-[100px] lg:h-[30px] ' draggable="false" src={logo} />
                        
                    </div>

                    <div className='w-full md:w-auto mt-8 md:mt-0'>
                        <button
                            onClick={closeModal}
                            className="text-white absolute top-6 right-6"
                        >
                            <RxCross1 />
                        </button>
                        <form onSubmit={handleSubmit} className="w-[320px] flex flex-col  border-t border-gray-400 pt-5  top-[18%] right-[13%] justify-center   absolute ">
                        <div className="mb-4">
                          <button className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center">
                          <div className="flex items-center justify-center  ml-2 py-3 px-2 bg-[#3D3F47] rounded">
                           <img src={infinite} alt="ICP Login" className="w-6" />
                           </div>
                            <span className="ml-3">ICP Login</span>
                          </button>
                       </div>
                       <div className="mb-4">
                          <button className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center">
                          <div className="flex items-center justify-center  ml-2 py-2 px-2 bg-[#3D3F47] rounded">
                           <img src={id} alt="ICP Login" className="w-6" />
                           </div>
                            <span className="ml-3">NFID</span>
                          </button>
                       </div>
                       <div className="mb-4">
                          <button className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center">
                          <div className="flex items-center justify-center  ml-2 py-2 px-2 bg-[#3D3F47] rounded">
                           <img src={bifinity} alt="ICP Login" className="w-6" />
                           </div>
                            <span className="ml-3">Bifinity</span>
                          </button>
                       </div>
                       <div className="mb-4">
                          <button className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center">
                          <div className="flex items-center justify-center  ml-2 py-2 px-2 bg-[#3D3F47] rounded">
                           <img src={plug} alt="plug" className="w-6" />
                           </div>
                            <span className="ml-3">Plug</span>
                          </button>
                       </div>
                            <div className="flex items-center border-t border-gray-400 my-2 py-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="mr-2 mb-10 "
                                    
                                   
                                />
                                <label htmlFor="terms" className="text-white">By connecting a wallet, you agree to [company name] Terms of Service and consent to its Privacy Policy.<span className=' text-blue-600'> Learn more</span></label>
                            </div>
                            <div className='flex mb-4  justify-center'>
                                <AnimationButton text='Connect Wallet' />
                            </div>
                        </form>

                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default JoinWaitlist;
