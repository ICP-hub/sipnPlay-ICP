
import React from 'react';

const Hero = () => {
  return (
    <section className="grid grid-cols-2 mb-[9%] px-[8%]">
      {/* Left Div */}
      <div className="flex-1 flex-col items-center  border-t-[0.5px] border-r-[0.5px] border-white justify-center bg-black text-white">
        <h1 className="text-8xl font-monckeberg px-[9%] pt-[151px] font-thin relative">GameFi <span className='text-[#EE3EC9] text-[2em] absolute '>&</span> Beyond</h1>
        <p className="mt-4 text-[21px] px-[9%] font-adam">
          Sipnplay is a casual Web3 Gaming Arcade. The<br /> name speaks for itself,
          just sip your drink & play<br /> our games on the go anytime, anywhere.
          Our<br /> games are designed to be hyper-casual, fun, and<br /> easy to understand.
          We're here to onboard web2 <br />users to our web3 universe backed by a loyal<br /> community.
          Join our waitlist to get early access to<br /> our NFT passport.
        </p>
      </div>

      {/* Right Div */}
      <div className="border-b-[0.5px] h-[722px] relative">
        <p className="font-monument absolute -left-6 bottom-0 font-bold opacity-10 w-full text-[330px] text-center">NFT</p>
        <p className='font-monument absolute -left-2 bottom-0 opacity-10 font-bold text-[100px]'>PASSPORT</p>
        
        <div
          className="absolute -top-[124px] opacity-85 -right-[500px] rounded-full h-[120%] blur-lg w-[1587px] "
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
