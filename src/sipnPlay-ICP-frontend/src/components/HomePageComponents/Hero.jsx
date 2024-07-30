
import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="grid grid-cols-1 lg:grid-cols-2 mb-[9%]   px-[8%]">
      {/* Left Div */}
      <div className="h-[392px] lg:h-screen lg:border-t-[0.5px] lg:border-r-[0.5px] lg:border-white  xl:h-[722px] flex-1 flex-col items-center   justify-center bg-black text-white">
        <div className='flex justify-center xl:justify-start pt-[45px] relative xl:pt-[98px] font-monckeberg lg:justify-start  lg:pt-[151px] '> 
          <p className="text-[42px] xl:text-8xl lg:text-6xl px-[9%] font-thin">GameFi  <p className='text-[#EE3EC9] absolute right-[38px] top-[24px] text-[107px] md:top-[20%] md:left-[65%] xl:left-[430px] xl:top-[80px] xl:text-[230px]  lg:left-[290px]  lg:top-[150px]  lg:text-[130px] '>&</p><br/> Beyond</p>
       </div>
        <p className="mt-4 text-center text-[20px]  w-full md:text-[25px] font-bold lg:text-start lg:text-[15px] xl:text-left xl:text-[21px]  font-adam">
          Sipnplay is a casual Web3 Gaming Arcade. The<br /> name speaks for itself,
          just sip your drink & play<br /> our games on the go anytime, anywhere.
          Our<br /> games are designed to be hyper-casual, fun, and<br /> easy to understand.
          We're here to onboard web2 <br />users to our web3 universe backed by a loyal<br /> community.
          Join our waitlist to get early access to<br /> our NFT passport.
        </p>
      </div>

      {/* Right Div */}
      <div className="lg:border-b-[0.5px] lg:h-screen h-[392px]  xl:h-[722px] relative">
        <p className="font-monument absolute -left-4 xl:left-0 bottom-8 font-bold opacity-10 w-full text-[156px] xl:text-[200px] ">NFT</p>
        <p className='font-monument absolute left-0 bottom-0 opacity-10 font-bold text-[55px] xl:text-[100px]'>PASSPORT</p>
        
        <div
          className="absolute hidden xl:block -top-[124px] opacity-85 -right-[500px] rounded-full h-[120%] blur-lg w-[1587px] "
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
