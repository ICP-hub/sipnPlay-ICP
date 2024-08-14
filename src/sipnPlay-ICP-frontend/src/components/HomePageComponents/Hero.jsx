
import React, { useEffect, useState } from 'react';
import nft from "../../assets/images/NFT.gif";
import Register from "../Modals/Register";
import { useAuth } from '../../utils/useAuthClient';
import { Principal } from '@dfinity/principal';
import { useDispatch, useSelector } from 'react-redux';
import { addUserData } from '../../utils/redux/userSlice';

const Hero = () => {
  const dispatch = useDispatch();
  
  const { isAuthenticated, backendActor, principal, ledgerActor } = useAuth();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isRegisterDone, setIsRegisterDone] = useState(false);
  
  const getStatus = async () => {
    const response = await backendActor.getUser();
    if (response.err === "New user") {
      return { isNewUser: true };
    } else {
      // let balance = await ledgerActor.icrc1_balance_of({ owner: Principal.fromText(principal), subaccount: [0] })
      return { isNewUser: false, email: response.ok.email, balance: 0 };
    };
  }

  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated) {
        const status = await getStatus();
        if (status.isNewUser) {
          setIsOpen(true);
        }
        else {
          dispatch(addUserData({
            id: principal.toString(),
            email: status.email,
            balance: status.balance,
          }));
        }
      }
    };
    checkStatus();
  }, [isAuthenticated, isRegisterDone]);


  return (
    <>
      <Register setIsRegisterDone={setIsRegisterDone} modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
      <section id="home" className="grid grid-cols-1 lg:grid-cols-2 mt-4  mb-[140px] md:mt-[87px] md:mb-[160px] lg:my-6  px-[8%]">
        {/* Left Div */}
        <div className="  lg:h-screen lg:border-t-[0.5px] lg:border-r-[0.5px] lg:border-white  xl:h-[722px] flex-1 flex-col items-center justify-center bg-black text-white">
          <div className='flex ml-[10%] pt-[45px] relative xl:pt-[98px] font-monckeberg lg:justify-start md:ml-[-65px] lg:ml-[-50px]   lg:pt-[151px] '>
            <p className="text-[42px] xl:text-8xl lg:text-6xl px-[9%] font-thin">GameFi
              <span className='text-[#EE3EC9] absolute right-[5%] top-[30px] ss4:right-[01%] dxs:right-[5%]
          xxs:right-[13%] xxs:top-[25px] xxs1:right-[23px] xxs1:top-[24px] text-[107px] 
           md:top-[20%] md:left-[65%] xl:left-[430px] xl:top-[80px] xl:text-[230px]  lg:left-[290px] 
            lg:top-[150px]  lg:text-[130px]  '>&</span><br /> Beyond</p>
          </div>
          <p className="mt-4 text-center text-[15px]  w-full md:text-[25px] font-bold lg:pr-[20%] lg:text-start lg:text-[15px] xl:pr-[20%] xl:text-left xl:text-[21px]  font-adam">
            Sipnplay is a casual Web3 Gaming Arcade. The name speaks for itself,
            just sip your drink & play our games on the go anytime, anywhere.
            Our games are designed to be hyper-casual, fun, and easy to understand.
            We're here to onboard web2 users to our web3 universe backed by a loyal community.
            Join our waitlist to get early access to our NFT passport.
          </p>
        </div>

        {/* Right Div */}
        <div className=" lg:h-screen h-[442px]  xl:h-[722px] relative">
          <img className='w-[431px] lg:w-[100%] mx-auto mt-14  ' draggable="false" src={nft} />
          <p className="font-monument absolute ss2:text-[100px] xxs1:w-[100%] sm1:-left-2 xl:left-0 bottom-8 font-bold opacity-10 w-full xxs1:text-[156px] xl:text-[200px] ">NFT</p>
          <p className='font-monument absolute left-0 bottom-0  opacity-10 font-bold text-[40px] xxs1:text-[55px] xl:text-[100px]'>PASSPORT</p>

          <div className="flex items-center absolute rotate-90 right-[-100px] bottom-[15%] dlg:right-[-180px] dlg:bottom-[15%]">
            <p className="font-semibold mr-2 ">SCROLL</p>
            <div className="flex-1  h-[2px] w-[100px] border  bg-white"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
