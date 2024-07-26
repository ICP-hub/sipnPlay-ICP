import React from 'react';
import Member2 from '../../assets/images/ParasKatoch.png'; 
import Member3 from '../../assets/images/VinayakKalra.png'; 
import Member1 from '../../assets/images/ankurBansal.png'; 
import backgroundImage from '../../assets/images/ourTeambg.png';

const OurTeam = () => {
  return (
    <div className="relative p-10 mx-36 bg-black-100 overflow-hidden">
      

      {/* Background Image */}
      <div
        className="absolute inset-0 transform -rotate-45"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      <h2 className="text-5xl  font-black font-inter text-center mb-10">Our Team</h2>

      {/* Grid of Team Member Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
        
        <div className="rounded-lg shadow-md p-6 ">
          <div style={{
            backgroundColor:'black',
            width:'2em',
            height:'2em',
            border:'0.01em solid #696969',
            position:'absolute',
            transform:'translate(-50%,-50%) rotate(45deg)',
            top:'50%',
            borderLeft:'none',
            borderBottom:'none',
            }}></div>
          <div className=' bg-slate-100 h-96 w-64 bg-opacity-10 border  rounded'
          style={{ borderColor: '#696969' }}>
          <img draggable="false" src={Member1} alt="Team Member 1" className=" h-96 w-64 object-cover   rounded-t-lg"/>
          </div>
          <div className="mt-4 text-center ">
            <h3 className="text-xl font-normal pr-10 font-monckeberg">Ankz</h3>
            <p className="text-white pr-10 font-bold font-adam">Business Strategy Sage </p>
          </div>
        </div>

     
        <div className="bg-black rounded-lg shadow-md p-6">
        <div className=' bg-slate-100 h-96 w-64 bg-opacity-10 border  rounded'
          style={{ borderColor: '#696969' }}>
          <img draggable="false" src={Member2} alt="Team Member 2" className=" h-96 w-64 object-cover   rounded-t-lg" />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-xl font-normal pr-10 font-monckeberg">KatochXcrypto</h3>
            <p className="text-white pr-10 font-bold font-adam">Community Crusander</p>
          </div>
        </div>

        
        <div className="bg-black rounded-lg shadow-md p-6">
        <div style={{
            backgroundColor:'black',
            width:'2em',
            height:'2em',
            border:'0.01em solid #696969',
            position:'absolute',
            transform:'translate(50%,50%) rotate(45deg)',
            top:'46%',
            left:'86.2%',
            borderRight:'none',
            borderTop:'none',
            }}></div>
        <div className=' bg-slate-100 h-96 w-64 bg-opacity-10 border  rounded'
          style={{ borderColor: '#696969' }}>
          <img draggable="false" src={Member3} alt="Team Member 3" className=" h-96 w-64 object-cover   rounded-t-lg" />
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-xl font-normal pr-10 font-monckeberg">Vinny K</h3>
            <p className="text-white pr-10 font-bold font-adam">Blockchin Architect</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
