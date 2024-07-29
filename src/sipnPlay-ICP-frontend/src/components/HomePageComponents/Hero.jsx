
import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="grid grid-cols-1 lg:grid-cols-2 mb-[9%] px-[8%]">
      {/* Left Div */}
      <div className="flex-1 flex-col items-center  lg:border-t-[0.5px] lg:border-r-[0.5px] lg:border-white justify-center bg-black text-white">
        <div className='flex justify-center md:justify-start pt-[45px] relative md:pt-[98px] font-monckeberg lg:pt-[151px] '> <p className="text-[42px] lg:text-8xl px-[9%] font-thin">GameFi <br/> Beyond</p><p className='text-[#EE3EC9] absolute left-[65%] md:left-[256px] lg:left-auto lg:right-0 md:top-16 lg:top-12 text-[107px] lg:text-[253px] '>&</p></div>
        <p className="mt-4 text-center md:text-left tet-[14px] md:text-[21px] px-[9%] font-adam">
          Sipnplay is a casual Web3 Gaming Arcade. The<br /> name speaks for itself,
          just sip your drink & play<br /> our games on the go anytime, anywhere.
          Our<br /> games are designed to be hyper-casual, fun, and<br /> easy to understand.
          We're here to onboard web2 <br />users to our web3 universe backed by a loyal<br /> community.
          Join our waitlist to get early access to<br /> our NFT passport.
        </p>
      </div>

      {/* Right Div */}
      <div className="lg:border-b-[0.5px] h-[392px] md:h-[722px] relative">
        <p className="font-monument absolute -left-4 md:-left-6 bottom-3 font-bold opacity-10 w-full text-[156px] md:text-[330px] ">NFT</p>
        <p className='font-monument absolute -left-2 bottom-0 opacity-10 font-bold text-[55px] md:text-[100px]'>PASSPORT</p>
        
        <div
          className="absolute hidden md:block -top-[124px] opacity-85 -right-[500px] rounded-full h-[120%] blur-lg w-[1587px] "
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(136, 47, 93, 0.6), rgba(169, 62, 62, 0.4), rgba(37, 29, 118, 0.4), transparent)',
          }}
        >
        </div>
      </div>
    </section> 
  );
};

export default Hero;
