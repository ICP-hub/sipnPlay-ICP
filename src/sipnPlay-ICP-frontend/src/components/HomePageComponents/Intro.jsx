import React from 'react';
import textOutline from "../../assets/images/textOutline.png";
import girl from "../../assets/images/girl.png";
import kOT from "../../assets/images/kOT.png";
const Intro = () => {
    return (
        <div>
            <div id='lets-cook' className='px-[9%] grid grid-cols-1 lg:grid-cols-2 '>
                <div className='lg:pb-[129px] relative'>
                    <p className='font-inter text-[30px] md:text-[42px] lg:text-[54px] lg:w-[60%] font-[900]'>THE GAMING
                        ECOSYSTEM
                        YOU OWN.</p>
                    <div className='flex justify-end  lg:justify-center'>
                        <svg className='w-[132px] lg:w-auto mr-20' width="325" height="45" viewBox="0 0 325 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 40.6104C43.5828 22.291 162.396 -9.44062 320.989 10.1872" stroke="white" strokeWidth="7" strokeLinecap="round" />
                        </svg>
                    </div>

                    <p className='font-adam text-[14px] md:text-[19px] lg:text-[24px] w-[79%] mt-[8px] font-[300]'>
                        Enter the world of possibilities with SipnPlay. A fully decentralized gameFi ecosystem of casual and hyper casual games for players to enjoy, play and earn on ICP.
                    </p>
                    <div className='hidden lg:block absolute bottom-0 right-0 w-[70%] h-[300px] border-b-[0.5px] border-r-[0.5px]'></div>
                </div>
                <div className='relative flex lg:block mt-5 lg:mt-0 '>
                    <div className='lg:absolute ml-auto left-0 top-[55px] '>
                        <div className='relative'>
                            <img src={textOutline} draggable="false" className='w-[110px] lg:w-[230px] lg:h-[120px]' />
                            <p className='absolute font-adam font-[300] w-[90px]  text-[15px] lg:text-[32px] top-2 left-4 lg:left-16'>play & win </p>
                        </div>
                    </div>
                    <img src={girl} draggable="false" className='w-[145px] md:w-[209px] lg:w-[297px] lg:absolute mr-auto left-[128px] ' />
                    <div
                        className="absolute hidden lg:block top-[10px] -right-[200px] rounded-full h-[700px] blur-lg opacity-70 w-[700px] "
                        style={{
                            backgroundImage: 'radial-gradient(circle, rgba(136, 47, 93, 0.4), rgba(169, 62, 62, 0.2), rgba(37, 29, 118, 0.2), transparent)',
                        }}
                    >
                    </div>
                </div>
            </div>
            <div className='px-[9%] lg:grid flex flex-col-reverse lg:grid-cols-2 '>
                <div className='relative'>
                    <img src={kOT} draggable="false" className='w-[197px]  mx-auto lg:w-[406px]' />
                    <div
                        className="absolute hidden lg:block -top-[100px] -left-[250px] rounded-full h-[700px] blur-lg opacity-70 w-[700px] "
                        style={{
                            backgroundImage: 'radial-gradient(circle, rgba(136, 47, 93, 0.4), rgba(169, 62, 62, 0.2), rgba(37, 29, 118, 0.2), transparent)',
                        }}
                    >
                    </div>
                </div>

                <div className='pb-4 lg:pb-[129px] relative'>
                    <div className='lg:pl-[80px] mt-[70px] lg:pt-[38px] relative '>
                        <p className='font-inter text-[30px] md:text-[42px] lg:text-[54px] font-[900]'>WHAT ARE WE COOKING?</p>
                        <div className='flex justify-end lg:justify-center'>
                            <svg className='w-[132px] lg:w-auto mr-20' width="325" height="45" viewBox="0 0 325 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 40.6104C43.5828 22.291 162.396 -9.44062 320.989 10.1872" stroke="white" strokeWidth="7" strokeLinecap="round" />
                            </svg>
                        </div>
                        <p className='font-adam  text-[14px] md:text-[19px] lg:text-[24px] lg:w-[79%] mt-[2px] font-[300]'>
                            Our ecosystem will contain a bundle of games with all gaming modes i.e Single player game, F2P, PVP, P2E etc which are both mobile and desktop friendly.
                        </p>
                        <div className='hidden lg:block absolute top-0 left-0 w-[70%]  border-t-[0.5px] '></div>
                    </div>
                    <div className='hidden lg:block absolute top-0 left-0 w-[70%] h-[300px] border-l-[0.5px] '></div>
                </div>
            </div>
        </div>
    )
}

export default Intro