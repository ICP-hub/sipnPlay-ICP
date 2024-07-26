
import React from 'react';

const Hero = () => {
  return (
    <section className="flex h-screen mb-[9%] px-[8%]">
      {/* Left Div */}
      <div className="flex-1 flex-col items-center  border-t-[0.5px] border-r-[0.5px] border-white  w-[628px] h-[822px] justify-center bg-black text-white">
        <h1 className="text-8xl font-monckeberg px-[9%] pt-[30%] font-thin relative">GameFi <span style={{ color: '#EE3EC9', fontSize: '2em',position:'absolute'  }}>&</span> Beyond</h1>
        <p className="mt-4 text-[21px] px-[9%] font-adam">
            Sipnplay is a casual Web3 Gaming Arcade. The<br/> name speaks for itself, 
            just sip your drink & play<br/> our games on the go anytime, anywhere.
             Our<br/> games are designed to be hyper-casual, fun, and<br/> easy to understand.
              We're here to onboard web2 <br/>users to our web3 universe backed by a loyal<br/> community. 
              Join our waitlist to get early access to<br/> our NFT passport.
              </p>
      </div>

      {/* Right Div */}
      <div className="flex-1 flex items-end justify-center border-b-[0.5px] h-[822px] w-[655] bg-balck relative">
        <h1 className="font-monument font-bold opacity-10 absolute w-full text-center"><span className='absolute -bottom-[10px] -left-[30px]  text-[330px]'>NFT</span> <br/>
        <span className='absolute -bottom-[33px] -left-[11px] font-monument text-[100px]'>PASSPORT</span>
        </h1>
      </div>
    </section>
  );
};

export default Hero;
