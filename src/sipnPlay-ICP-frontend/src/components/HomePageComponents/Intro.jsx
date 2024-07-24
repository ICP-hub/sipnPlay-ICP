import React from 'react';
import textOutline from "../../assets/images/textOutline.png";
import girl from "../../assets/images/girl.png";
import kOT from "../../assets/images/kOT.png";
const Intro = () => {
    return (
        <div className='mx-[9%] grid grid-cols-2 '>
            <div className='pb-[129px] relative'>
                <p className='font-inter text-[54px] w-[60%] font-[900]'>THE GAMING
                    ECOSYSTEM
                    YOU OWN.</p>
                <p className='font-adam text-[24px] w-[79%] mt-[44px] font-[300]'>
                    Enter the world of possibilities with SipnPlay. A fully decentralized gameFi ecosystem of casual and hyper casual games for players to enjoy, play and earn on ICP.
                </p>
                <div className=' absolute bottom-0 right-0 w-[70%] h-[300px] border-b-[0.5px] border-r-[0.5px]'></div>
            </div>
            <div className='relative'>
                <div className='absolute left-0 top-[55px] '>
                    <div className='relative'>
                        <img src={textOutline} draggable="false" className='w-[230px] h-[120px]' />
                        <p className='absolute font-adam font-[300] w-[90px] text-[32px] top-2 left-16'>play & win </p>
                    </div>
                </div>
                <img src={girl} draggable="false" className='w-[297px] absolute left-[128px] ' />
            </div>

            <div>
                <img src={kOT} draggable="false" className='w-[406px]'/>
            </div>

            <div className='pb-[129px] relative'>
                <div className='pl-[80px] mt-[70px] pt-[38px] relative '>
                <p className='font-inter text-[54px] font-[900]'>WHAT ARE WE COOKING?</p>
                <p className='font-adam text-[24px] w-[79%] mt-[44px] font-[300]'>
                Our ecosystem will contain a bundle of games with all gaming modes i.e Single player game, F2P, PVP, P2E etc which are both mobile and desktop friendly.
                </p>
                <div className=' absolute top-0 left-0 w-[70%]  border-t-[0.5px] '></div>
                </div>
                <div className=' absolute top-0 left-0 w-[70%] h-[300px] border-l-[0.5px] '></div>
            </div>


        </div>
    )
}

export default Intro