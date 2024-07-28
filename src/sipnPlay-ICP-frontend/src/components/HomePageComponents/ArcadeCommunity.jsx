import React from 'react'
import person1 from "../../assets/images/community/person1.png";
import person2 from "../../assets/images/community/person2.png";
import person3 from "../../assets/images/community/person3.png";
import person4 from "../../assets/images/community/person4.png";
import person5 from "../../assets/images/community/person5.png";
import person6 from "../../assets/images/community/person6.png";
import person7 from "../../assets/images/community/person7.png";
import person8 from "../../assets/images/community/person8.png";
import person9 from "../../assets/images/community/person9.png";
import person10 from "../../assets/images/community/person10.png";
import person11 from "../../assets/images/community/person11.png";
import person12 from "../../assets/images/community/person12.png";
import person13 from "../../assets/images/community/person13.png";
import person14 from "../../assets/images/community/person14.png";
import person15 from "../../assets/images/community/person15.png";
import person16 from "../../assets/images/community/person16.png";
import person17 from "../../assets/images/community/person17.png";


const ArcadeCommunity = () => {
  return (
    <div className=' px-[8%] py-[2%]'>

      <div className=' text-[30px] md:text-[64px] font-inter font-[900]  text-center '>
        <h1>Join <span className='text-[#EE3EC9]'>SipnPlay</span> Arcade Community</h1>
        </div>

        {/* Community person images */}
        <div className='relative  flex  h-[310.02px] md:h-screen'>
        <div className='md:w-[131px]  w-[68.72px] absolute right-[0.01%] bottom-[10%] md:right-[20%] md:bottom-[25%] '>
        <img  src={person1} draggable="false" />
    </div>
    <div className='absolute md:left-[30%] md:bottom-[22%] w-[46.16px] md:w-[88px] bottom-[1%] left-[5%]'>
        <img  src={person2} draggable="false" />
    </div>
    <div className='absolute md:left-[30%] md:top-[10%] left-[20%] top-[10%] w-[50.88px] md:w-[97px]  '>
        <img  src={person3} draggable="false" />
    </div>
    <div className='absolute w-[98.09px] md:w-[187px] right-[10%] bottom-[35%] md:right-[30%] md:bottom-[44%] '>
        <img  src={person4} draggable="false" />
    </div>
    <div className='absolute w-[56.65px] md:w-[108px]  right-[28%] top-[10%] md:right-[39%] md:bottom-[77%]  '>
        <img  src={person5} draggable="false" />
    </div>
    <div className=' absolute w-[69.24px] md:w-[132px] right-[20%] bottom-[2%] md:right-[32%] md:bottom-[19%]'>
        <img  src={person6} draggable="false" />
    </div>
    <div className='absolute md:left-[28%] md:bottom-[42%] left-[20%] bottom-[8%] w-[98.09px] md:w-[187px]  '>
        <img  src={person7} draggable="false" />
    </div>
    <div className='md:w-[94px] w-[49.31px] absolute right-[5%] top-[15%] md:right-[26%] md:bottom-[70%]'>
        <img  src={person8} draggable="false" />
    </div>
    <div className=' absolute hidden md:block  md:w-[94px] md:right-[8%] md:bottom-[35%]  '>
        <img  src={person9} draggable="false" />
    </div>
    <div className=' absolute hidden md:block  md:w-[94px] md:right-[1%] md:bottom-[55%]'>
        <img  src={person10} draggable="false" />
    </div>
    <div className='absolute w-[49.31px] left-[50%] bottom-[30%] md:w-[94px] md:left-[45%] md:bottom-[42%] '>
        <img  src={person11} draggable="false" />
    </div>
    <div className='absolute hidden md:block md:left-[17%] md:bottom-[30%]  md:w-[128px]  '>
        <img  src={person12} draggable="false" />
    </div>
    <div className='absolute w-[80.78px] md:w-[187px] left-[45%] -bottom-[10%] md:left-[40%] md:bottom-[10%] '>
        <img  src={person13} draggable="false" />
    </div>
    <div className='absolute w-[53px] md:w-[154px] -right-[5%] top-[34%] md:right-[15%] md:bottom-[50%] '>
        <img  src={person14} draggable="false" />
    </div>
    <div className=' absolute top-[35%] left-[10%]  md:left-[15%] md:top-[20%]  w-[80.78px] md:w-[154px]  '>
        <img  src={person15} draggable="false" />
    </div>
    <div className='absolute left-[40%] top-[25%] md:left-[40%] md:top-[15%] w-[65.05px]  md:w-[124px]  '>
        <img  src={person16} draggable="false" />
    </div>
    <div className='absolute md:left-[5%] md:bottom-[42%] hidden md:block md:w-[128px]  '>
        <img  src={person17} draggable="false" />
    </div>
    </div>
    </div>
  )
}

export default ArcadeCommunity;