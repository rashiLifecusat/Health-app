import React from "react";
import {  Outlet ,Navigate} from "react-router-dom";

function ProtectedRoute() {
  var isAuthenticated = localStorage.getItem("token");
  return (
    isAuthenticated ? <Outlet/>:<Navigate to="/Signin"/>
  );
}

export default ProtectedRoute;