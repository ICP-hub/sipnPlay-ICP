import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { FetchingProvider } from "../utils/fetchingContext";

const PrivateLayout = ({ children }) => {
  return (
    <FetchingProvider>
      <div className="overflow-auto flex flex-col h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </FetchingProvider>
  );
};

export default PrivateLayout;
