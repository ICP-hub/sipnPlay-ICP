import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const PrivateLayout = ({ children }) => {
  return (
    <div className="overflow-hidden max-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;
