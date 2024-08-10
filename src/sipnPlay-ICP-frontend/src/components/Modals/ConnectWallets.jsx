import React, { useState } from 'react';
import logo from '../../assets/images/logo.png';
import infinite from '../../assets/images/icons/infinity.png';
import id from '../../assets/images/icons/id.png';
import stoic from '../../assets/images/icons/stoic.png';
import plug from '../../assets/images/icons/plug.png';

import AnimationButton from '../../common/AnimationButton';
import Modal from 'react-modal';

import { RxCross1 } from "react-icons/rx";
import { useAuth } from "../../utils/useAuthClient";
import toast from 'react-hot-toast';

const JoinWaitlist = ({ modalIsOpen, setIsOpen }) => {
  const { login } = useAuth();
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="fixed  inset-0 flex items-center justify-center bg-transparent"
        overlayClassName="fixed z-[100] inset-0 bg-gray-800 bg-opacity-50"
      >
        <div className='bg-black p-[15px] md:p-[20px] relative w-[80%] md:w-[440px] border border-[#696969] rounded-xl'>
        <img className='md:absolute mx-auto left-3 top-4 lg:w-[101px] w-[91px] ' draggable="false" src={logo} />
          <p className='text-center text-white font-monckeberg mt-4 md:mt-0 text-2xl md:text-2xl lg:text-3xl lg1:text-4xl'>Wallets </p>
          

          <div className='w-full md:w-auto mt-8 md:mt-0'>
            <button
              onClick={closeModal}
              className="text-white absolute top-6 right-6"
            >
              <RxCross1 />
            </button>
            <div className="w-[90%] mx-auto mt-5 flex flex-col border-t border-gray-400 pt-5 justify-center ">
              <div className="mb-4">
                <button onClick={()=>login("ii")} className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center">
                  <div className="flex items-center justify-center  ml-2 py-3 px-2 bg-[#3D3F47] rounded">
                    <img src={infinite} alt="ICP Login" className="w-6" />
                  </div>
                  <span className="ml-3">ICP Login</span>
                </button>
              </div>
              <div className="mb-4">
                <button onClick={()=>login("nfid")} className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center">
                  <div className="flex items-center justify-center  ml-2 py-2 px-2 bg-[#3D3F47] rounded">
                    <img src={id} alt="ICP Login" className="w-6" />
                  </div>
                  <span className="ml-3">NFID</span>
                </button>
              </div>
              <div className="mb-4">
                <button onClick={()=>login("stoic")} className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center">
                  <div className="flex items-center justify-center  ml-2 py-2 px-2 bg-[#3D3F47] rounded">
                    <img src={stoic} alt="Stoic Login" className="w-6" />
                  </div>
                  <span className="ml-3">Stoic</span>
                </button>
              </div>
              <div className="mb-4">
                <button onClick={()=>login("plug")} className="w-full bg-[#303030] text-white py-2 rounded-[10px] flex items-center">
                  <div className="flex items-center justify-center  ml-2 py-2 px-2 bg-[#3D3F47] rounded">
                    <img src={plug} alt="plug" className="w-6" />
                  </div>
                  <span className="ml-3">Plug</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </Modal>
    </div>
  );
}

export default JoinWaitlist;
