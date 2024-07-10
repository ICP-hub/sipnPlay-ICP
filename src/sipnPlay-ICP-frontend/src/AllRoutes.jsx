import React, { useState } from 'react'
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
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
    
    </Routes>
    // </AuthProvider>
  )
}

export default AllRoutes;