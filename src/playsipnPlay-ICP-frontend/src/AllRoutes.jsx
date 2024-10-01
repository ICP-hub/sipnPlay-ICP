import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import BlackJack from "./Pages/BlackJack";
import { AuthProvider } from "./utils/useAuthClient";
// import Payment from './Pages/Payment';
import PrivateLayout from "./Layout/PrivateLayout";
import AdminPanel from "./Pages/Admin";
import Gush from "./Pages/Gush";
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

        <Route path="/gush" element={ <Gush /> }
        />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </AuthProvider>
  );
}

export default AllRoutes;
