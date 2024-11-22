import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import BlackJack from "./Pages/BlackJack";
import { AuthProvider } from "./utils/useAuthClient";
import PrivateLayout from "./Layout/PrivateLayout";
import AdminPanel from "./Pages/Admin";
import OffTheLine from "./Pages/OffTheLine";
import TetrisGame from "./Pages/Tetris";
import NotFound from "../../sipnPlay-ICP-frontend/src/Pages/NotFound";

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

        <Route path="/off-the-line" element={<OffTheLine />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default AllRoutes;
