import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const PrivateLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;
