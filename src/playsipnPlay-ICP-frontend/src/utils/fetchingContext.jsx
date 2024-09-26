import React, { createContext, useContext, useState } from "react";

const FetchingContext = createContext();

export const FetchingProvider = ({ children }) => {
  const [isFetching, setIsFetching] = useState(false);

  return (
    <FetchingContext.Provider value={{ isFetching, setIsFetching }}>
      {children}
    </FetchingContext.Provider>
  );
};

export const useFetching = () => {
  return useContext(FetchingContext);
};
