import React, { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import BlackJack from "./Pages/BlackJack";
import {AuthProvider} from "./utils/useAuthClient"
import Register from './Pages/Register';
import Payment from './Pages/Payment';
function AllRoutes() {
  const [loggedIn,setLoggedIn]=useState(localStorage.getItem("loggedIn")||true)
  return (
    <AuthProvider >
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
       <Route
        path="/register"
        element={
          <Register />
        }
      />
          <Route
        path="/payment"
        element={
          <Payment />
        }
      />

    </Routes>
    </AuthProvider>
  )
}

export default AllRoutes;