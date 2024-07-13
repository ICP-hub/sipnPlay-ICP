import React, { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import BlackJack from "./Pages/BlackJack";
import {AuthProvider} from "./utils/useAuthClient"
function AllRoutes() {
  const [loggedIn,setLoggedIn]=useState(localStorage.getItem("loggedIn")||true)
  return (
    // <AuthProvider setLoggedIn={setLoggedIn}>
    <Routes>
      <Route
        path="/"
        element={
          <Home />
        }
      />
       <Route
        path="/blackjack"
        element={
          <BlackJack />
        }
      />
    
    </Routes>
  )
}

export default AllRoutes;