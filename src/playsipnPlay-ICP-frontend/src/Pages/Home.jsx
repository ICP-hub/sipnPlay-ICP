import React, { useEffect } from "react";
import GamesList from "../components/Games/GamesList";
import TagManager from "react-gtm-module";
import { useAuth } from "../utils/useAuthClient";
function Home() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const tagManagerArgs = {
      dataLayer: {
        event: "pageView",
        page: "HomePage",
        userStatus: isAuthenticated ? "logged-in" : "un-registered",
      },
    };
    TagManager.dataLayer(tagManagerArgs);
  }, []);

  return (
    <>
      <GamesList />
    </>
  );
}

export default Home;
