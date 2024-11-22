import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import { AuthProvider } from "./utils/useAuthClient";
// import Payment from './Pages/Payment';
import PrivateLayout from "./Layout/PrivateLayout";
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
        <Route path="/*" element={<PrivateLayout>
          <NotFound />
        </PrivateLayout>} />
      </Routes>
    </AuthProvider>
  );
}

export default AllRoutes;
