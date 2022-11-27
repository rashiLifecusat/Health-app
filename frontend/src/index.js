import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import Navbar from './Components/Home/Navbar';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  <Navbar/>
   <BrowserRouter>
    <App />
   </BrowserRouter>
  </>
 
    
);
