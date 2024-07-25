import React from 'react'

const GradientText = ({ children }) => {
    return (
        <span className='transition-all duration-500 bg-gradient-to-r font-adam font-[300]  from-white to-[#EE3EC9] text-transparent bg-clip-text'>
            {children}
        </span>
    )
}

export default GradientText;