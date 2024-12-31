import React, { useEffect } from "react";
import TagManager from "react-gtm-module";
import SendMessage from "../components/HomePageComponents/SendMessage";
import OurTeam from "../components/HomePageComponents/OurTeam";
import TrustedBy from "../components/HomePageComponents/TrustedBy";
import Intro from "../components/HomePageComponents/Intro";
import Hero from "../components/HomePageComponents/Hero";
import GameMania from "../components/HomePageComponents/GameMania";
import ArcadeCommunity from "../components/HomePageComponents/ArcadeCommunity";

function Home() {
  useEffect(() => {
    const tagManagerArgs = {
      dataLayer: {
        event: "pageView",
        page: "LandingPage",
      },
    };
    TagManager.dataLayer(tagManagerArgs);
  }, []);

  return (
    <>
      <Hero />
      <TrustedBy />
      <Intro />
      <GameMania />
      <OurTeam />
      <ArcadeCommunity />
      <SendMessage />
    </>
  );
}

export default Home;
