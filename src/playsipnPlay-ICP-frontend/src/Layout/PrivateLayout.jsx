import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { FetchingProvider } from "../utils/fetchingContext";

const PrivateLayout = ({ children }) => {
  return (
    <FetchingProvider>
      <div className="overflow-hidden">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </FetchingProvider>
  );
};

export default PrivateLayout;
