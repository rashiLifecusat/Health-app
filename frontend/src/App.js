import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import  { Route, Routes } from 'react-router-dom'
import Home from "./Components/Home/Home";

function App() {
  return (
  <>
  <Routes>
    <Route path="/" element={<Home/>}/>
  </Routes>
  </>
  )
}

export default App;
