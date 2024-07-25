import React from 'react'

const AnimationButton = ({ text }) => {
    return (
        <>
            <button className='border relative flip-card font-adam px-[42px] py-[8px] text-[15px] font-[300] border-[#EE3EC9]'>
                {text}
                <div className='absolute h-[5px] w-[5px] -top-[0.5px] -left-[0.5px] border-t-[1px] border-l-[1px] '></div>
                <div className='absolute h-[5px] w-[5px] -top-[0.5px] -right-[1px] border-t-[1px] border-r-[1px] '></div>
                <div className='absolute h-[5px] w-[5px] -bottom-[0.5px] -left-[0.5px] border-b-[1px] border-l-[1px] '></div>
                <div className='absolute h-[5px] w-[5px] -bottom-[0.5px] -right-[1px] border-b-[1px] border-r-[1px] '></div>

                <div class="flip-card-inner relative w-full h-[100%] text-center transition-all duration-700">
                    <div class="flip-card-front absolute w-full h-full"></div>
                    <div class="flip-card-back absolute w-full h-full"></div>
                </div>

            </button>
        </>
    )
}

export default AnimationButton