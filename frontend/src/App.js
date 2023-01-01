import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import  { Route, Routes } from 'react-router-dom'
import Home from "./Components/Home/Home";
import Chat from "./Components/Chat/Chat";
import Inbox from "./Components/Chat/Inbox";
import Register from "./Components/UserModule/Register";
import Login from "./Components/UserModule/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verification from "./Components/UserModule/Verification";
import ProtectedRoute from "./Components/Authentication/Auth";
import DoctorProute from "./Components/Authentication/DoctorAuth";
import DoctorHome from "./Components/Doctor/DoctorHome";
import Userupdate from "./Components/UserModule/Userupdate";
import UpdateDoc from "./Components/Doctor/UpdateDoc";
import UserRequests from "./Components/UserModule/UserRequests";
import Favourites from "./Components/UserModule/Favourites";
import ForgotPassword from "./Components/UserModule/ForgotPassword";

function App() {
  return (
  <>
  <Routes>
  <Route path="/Signup" element={<Register/>}/>
    <Route path="/Signin" element={<Login/>}/>
    <Route path="/Forgot" element={<ForgotPassword/>}/>
    
    <Route path="/VerifyOtp" element={<Verification/>}/>
      <Route element={<DoctorProute/>}>
      <Route path="/Requests" element={<DoctorHome/>}/>
      <Route path="/Doctorupdate" element={<UpdateDoc/>}/>
      </Route>
      <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Home/>}/>
      <Route path="/chat" element={<Chat/>}/>
      <Route path="/inbox" element={<Inbox/>}/>
      <Route path="/userupdate" element={<Userupdate/>}/>
      <Route path="/requestStatus" element={<UserRequests/>}/>
      <Route path="/Favourites" element={<Favourites/>}/>
      </Route>
   
  
   
  </Routes>
  <ToastContainer/>
  </>
  )
}

export default App;
