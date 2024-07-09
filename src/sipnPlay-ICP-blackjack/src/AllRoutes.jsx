import React from 'react'
import { Route, Routes } from "react-router-dom";

function AllRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <iframe title="Blackjack Game" src="/blackjack.html" style={{ width: '100%', height: '100vh', border: 'none' }} />
        }
      />
    </Routes>
  )
}

export default AllRoutes