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

      <div className=' text-[30px] xl:text-[64px] font-inter font-[900]  text-center '>
        <h1>Join <span className='text-[#EE3EC9]'>SipnPlay</span> Arcade Community</h1>
        </div>

             {/* Community person images */}
      <div className='relative flex h-[310.02px] xl:h-screen'>
        <div className='absolute right-[0.01%] bottom-[10%] xl:right-[20%] xl:bottom-[25%] w-[68.72px] dlg:w-[90px] xl:w-[131px]'>
          <img src={person1} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute left-[5%] bottom-[1%] xl:left-[30%] xl:bottom-[22%] w-[46.16px] dlg:w-[60px] xl:w-[88px]'>
          <img src={person2} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute left-[20%] top-[10%] xl:left-[30%] xl:top-[10%] w-[50.88px] dlg:w-[70px] xl:w-[97px]'>
          <img src={person3} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute right-[10%] bottom-[35%] ss4:w-[81px] xl:right-[30%] xl:bottom-[44%] w-[98.09px] dlg:w-[130px] xl:w-[187px]'>
          <img src={person4} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute right-[28%] top-[10%] xl:right-[39%] xl:bottom-[77%] w-[56.65px] dlg:w-[75px] xl:w-[108px]'>
          <img src={person5} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute right-[20%] bottom-[2%] xl:right-[32%] xl:bottom-[19%] w-[50px] xxs1:w-[69.24px]    dlg:w-[90px] xl:w-[132px]'>
          <img src={person6} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute left-[20%] bottom-[8%] xl:left-[28%] xl:bottom-[42%] w-[98.09px] dlg:w-[130px] xl:w-[187px]'>
          <img src={person7} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute right-[5%] top-[15%] xl:right-[26%] xl:bottom-[70%] w-[49.31px] dlg:w-[65px] xl:w-[94px]'>
          <img src={person8} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute hidden xl:block xl:right-[8%] xl:bottom-[35%] xl:w-[94px]'>
          <img src={person9} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute hidden xl:block xl:right-[1%] xl:bottom-[55%] xl:w-[94px]'>
          <img src={person10} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute left-[50%] bottom-[30%] xl:left-[45%] xl:bottom-[42%] w-[49.31px] dlg:w-[65px] xl:w-[94px]'>
          <img src={person11} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute hidden xl:block xl:left-[17%] xl:bottom-[30%] xl:w-[128px]'>
          <img src={person12} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute left-[45%] -bottom-[10%] xl:left-[40%] xl:bottom-[10%] ss4:w-[65px] xxs:w-[80.78px] dlg:w-[100px] xl:w-[187px]'>
          <img src={person13} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute right-[-5%] top-[34%] xl:right-[15%] xl:bottom-[50%] w-[53px] dlg:w-[75px] xl:w-[154px]'>
          <img src={person14} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute left-[10%] top-[35%] xl:left-[15%] xl:top-[20%] w-[80.78px] dlg:w-[100px] xl:w-[154px]'>
          <img src={person15} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute left-[40%] top-[25%] xl:left-[40%] xl:top-[15%] w-[65.05px] dlg:w-[85px] xl:w-[124px]'>
          <img src={person16} draggable="false" className='w-full h-auto' />
        </div>
        <div className='absolute hidden xl:block xl:left-[5%] xl:bottom-[42%] xl:w-[128px]'>
          <img src={person17} draggable="false" className='w-full h-auto' />
        </div>

    </div>
    </div>
  )
}

export default ArcadeCommunity;