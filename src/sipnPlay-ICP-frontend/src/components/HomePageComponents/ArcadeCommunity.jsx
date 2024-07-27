import React from 'react'
import person1 from "../../assets/images/community/person1.png";
const ArcadeCommunity = () => {
  return (
    <div>
        <div className='bg-white rounded-full h-[131px] overflow-hidden w-[131px]  '>
        <img className='h-[161px] object-cover  bottom-0 ' src={person1} draggable="false" />
    </div>
    </div>
  )
}

export default ArcadeCommunity