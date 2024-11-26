import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import BlackJack from "./Pages/BlackJack";
import { AuthProvider } from "./utils/useAuthClient";
import PrivateLayout from "./Layout/PrivateLayout";
import AdminPanel from "./Pages/Admin";
import TetrisGame from "./Pages/Tetris";
import NotFound from "./Pages/NotFound";

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
        <Route path="/tetris" element={<TetrisGame />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route
          path="/*"
          element={
            <PrivateLayout>
              <NotFound />
            </PrivateLayout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default AllRoutes;
