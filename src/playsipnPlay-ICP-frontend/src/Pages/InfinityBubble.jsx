import React from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../utils/useAuthClient";

const InfinityBubble = () => {
  const { isAuthenticated } = useAuth();
  const userData = useSelector((state) => state.user);

  useEffect(() => {
    if (!userData.id || !userData.email) {
      toast.error("You are not logged in! ");
      navigate("/");
    } else if (!isAuthenticated) {
      navigate("/");
      toast.error("You are not logged in! ");
    } else {
      // getDetails();
    }
  }, []);

  return (
    <iframe
      title="Infinity Bubble"
      src="bubble/index.html"
      style={{ width: "100vw", height: "100vh", border: "none" }}
    />
  );
};

export default InfinityBubble;
