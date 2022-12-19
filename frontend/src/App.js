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

function App() {
  return (
  <>
  <Routes>
  <Route path="/Signup" element={<Register/>}/>
    <Route path="/Signin" element={<Login/>}/>
    
    <Route path="/VerifyOtp" element={<Verification/>}/>
  <Route element={<ProtectedRoute />}>
  <Route path="/" element={<Home/>}/>
  <Route path="/chat" element={<Chat/>}/>
  <Route path="/inbox" element={<Inbox/>}/>
  </Route>
   
  
   
  </Routes>
  <ToastContainer/>
  </>
  )
}

export default App;
