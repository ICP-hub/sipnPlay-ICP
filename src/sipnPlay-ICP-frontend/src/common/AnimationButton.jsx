import React from 'react'
import './AnimationButton.css'
const AnimationButton = ({ text, onClick }) => {
    return (
        <>
            <button onClick={onClick} className='border text-white relative flip-card font-adam  text-[15px] font-[300] border-[#EE3EC9]'>
                {text}
                <div className='absolute h-[5px] w-[5px] -top-[1px] -left-[1px] border-t-[1px] border-l-[1px] '></div>
                <div className='absolute h-[5px] w-[5px] -top-[1px] -right-[1px] border-t-[1px] border-r-[1px] '></div>
                <div className='absolute h-[5px] w-[5px] -bottom-[1px] -left-[1px] border-b-[1px] border-l-[1px] '></div>
                <div className='absolute h-[5px] w-[5px] -bottom-[1px] -right-[1px] border-b-[1px] border-r-[1px] '></div>

                <div className="flip-card-inner absolute top-0 left-0 z-[-1] w-full h-[100%] text-center transition-all duration-700">
                    <div className="flip-card-front absolute w-full h-full"></div>
                    <div className="flip-card-back bg-[#EE3EC9] opacity-30 absolute w-full h-full"></div>
                </div>

            </button>
        </>
    )
}

export default AnimationButton