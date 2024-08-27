import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import BlackJack from "./Pages/BlackJack";
import { AuthProvider } from "./utils/useAuthClient";
// import Payment from './Pages/Payment';
import PrivateLayout from "./Layout/PrivateLayout";
import AdminPanel from "./Pages/Admin";
function AllRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateLayout>
              <Home />
            </PrivateLayout>
          }
        />
        <Route path="/blackjack" element={<BlackJack />} />
        <Route
          path="/register"
          element={
            <PrivateLayout>
              <Home />
            </PrivateLayout>
          }
        />
        {/* <Route
          path="/payment"
          element={
            <Payment />
          }
        /> */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </AuthProvider>
  );
}

export default AllRoutes;
