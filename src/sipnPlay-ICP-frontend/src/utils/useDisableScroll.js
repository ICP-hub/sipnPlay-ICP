import { useEffect } from "react";

const useDisableScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset scroll behavior
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
};

export default useDisableScroll;
