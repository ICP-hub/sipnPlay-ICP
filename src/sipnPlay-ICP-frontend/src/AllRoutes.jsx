import React from 'react'
import { Route, Routes } from "react-router-dom";
import BlackJack from "./Pages/BlackJack"
function AllRoutes() {
  return (
    <Routes>
        <Route
        path="/"
        element={
          
            <BlackJack />
          
        }
      />
    </Routes>
  )
}

export default AllRoutes