import React from 'react';
import SendMessage from '../components/HomePageComponents/SendMessage';
import OurTeam from '../components/HomePageComponents/OurTeam';
import TrustedBy from '../components/HomePageComponents/TrustedBy';
import Intro from '../components/HomePageComponents/Intro';
import Hero from '../components/HomePageComponents/Hero';
import GameMania from '../components/HomePageComponents/GameMania';

function Home() {
  return (
    <div className="p-4">
      <Hero />
      <TrustedBy />
      <Intro />
      <GameMania />
      <OurTeam />
      <SendMessage />
    </div>
  );
}

export default Home;
