import React from 'react';
import Member2 from '../../assets/images/ParasKatoch.png'; 
import Member3 from '../../assets/images/VinayakKalra.png'; 
import Member1 from '../../assets/images/ankurBansal.png'; 
import backgroundImage from '../../assets/images/ourTeambg.png';

const OurTeam = () => {
  return (
    <div id="our-team" className="relative mt-12 mx-[9%] bg-black-100">
      <div
        className="absolute inset-0 transform -rotate-45"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      <h2 className="text-[30px] md:text-5xl font-black font-inter text-center mb-10">Our Team</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">

        <div className="rounded-lg flex lg:flex-col flex-row-reverse items-center gap-7 lg:gap-0 mx-auto shadow-md p-6 ">
          
          <div className=' bg-slate-100 relative h-[256px] lg:h-96 border-[#696969] w-[256px] lg:w-64 bg-opacity-10 border rounded'>
          <img draggable="false" src={Member1} alt="Team Member 1" className="h-full object-cover   rounded-t-lg"/>
          <div className='hidden lg:block bg-black w-[2em] h-[2em] absolute -left-4 top-[45%] rotate-45 border-r-[0.01em] border-t-[0.01em] border-[#696969] '></div>
          </div>
          <div className="mt-4 mx-auto text-center ">
            <h3 className="text-[20px] lg:text-[31px] mx-auto font-normal pr-10 font-monckeberg">Ankz</h3>
            <p className="text-white text-[14px] lg:text-[22px] pr-10 font-bold font-adam">Business Strategy Sage </p>
          </div>
        </div>

     
        <div className="bg-black mx-auto rounded-lg  flex lg:flex-col flex-row items-center gap-7 lg:gap-0 shadow-md p-6">
        <div className=' bg-slate-100 h-[256px] lg:h-96 w-[256px] lg:w-64 bg-opacity-10 border border-[#696969] rounded'>
          <img draggable="false" src={Member2} alt="Team Member 2" className=" h-full object-cover rounded-t-lg" />
          </div>
          <div className="mt-4 mx-auto text-center">
            <h3 className="text-[20px] lg:text-[31px] font-normal pr-10 font-monckeberg">KatochXcrypto</h3>
            <p className="text-white text-[14px] lg:text-[22px] pr-10 font-bold font-adam">Community Crusander</p>
          </div>
        </div>

        
        <div className="bg-black flex lg:flex-col flex-row-reverse items-center gap-7 lg:gap-0 mx-auto rounded-lg shadow-md p-6">
       
        <div className=' bg-slate-100 relative border-[#696969] h-[256px] lg:h-96 w-[256px] lg:w-64 bg-opacity-10 border  rounded'>
        <div className='hidden lg:block bg-black w-[2em] h-[2em] absolute -right-4 top-[45%] rotate-45 border-l-[0.01em] border-b-[0.01em] border-[#696969]'></div>
          <img draggable="false" src={Member3} alt="Team Member 3" className=" h-full object-cover rounded-t-lg" />
          </div>
          <div className="mt-4 mx-auto text-center">
            <h3 className="text-[20px] lg:text-[31px] font-normal pr-10 font-monckeberg">Vinny K</h3>
            <p className="text-white text-[14px] lg:text-[22px] pr-10 font-bold font-adam">Blockchin Architect</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
