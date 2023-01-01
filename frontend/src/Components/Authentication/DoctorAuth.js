import React from "react";
import {  Outlet ,Navigate} from "react-router-dom";

function DoctorProute() {
  var isAuthenticated = localStorage.getItem("doctorToken");
  return (
    isAuthenticated ? <Outlet/>:<Navigate to="/Signin"/>
  );
}

export default DoctorProute;