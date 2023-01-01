import React, {  useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import Server from '../Server/Server';
import { toast } from 'react-toastify';
import { useNavigate} from 'react-router-dom'

function ForgotPassword() {
  const history=useNavigate()
  const [open,setOpen]=useState(true)
  const [user, setUser] = React.useState({ email: ""});
//   const [latitude,setLatitude]=React.useState(0)
//   const [longitude,setLongitude]=React.useState(0)
  console.log("hey user",user)
//   window.navigator.geolocation
//   .getCurrentPosition((res)=>setLatitude(res.coords.latitude));
//   window.navigator.geolocation
//   .getCurrentPosition((res)=> setLongitude(res.coords.longitude))
  let name, value;
  const handaleinput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };
  const returnTo = () => {
    history("/Signup")
  };
  const submitLogin=()=>{
    var data=user
    // data.longitude=longitude.toString()
    // data.latitude=latitude.toString()
    axios.post(Server.Server.serverForOthers.link+"/user/forgotPassword",data).then((res)=>{
      console.log("res")
      if(res.data.code===200){
        
       toast.success("Check your mail to setup new password")
        
      }else{
        toast.error(res.data.message)
      }
    })
  }
  return (
  <>
     <Dialog open={open}>
        <DialogTitle>HEALTH APP</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Login to health app
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            onChange={handaleinput}
          />
             
          
        </DialogContent>
        <DialogActions>
        <Button onClick={submitLogin}>Submit</Button>
        </DialogActions>
        <DialogActions>
        <Button onClick={()=>history("/Signin")}>Signin</Button>
        </DialogActions>
        <DialogActions>
        <Button onClick={returnTo}>Create Your new Account</Button>
        </DialogActions>
        {/* <DialogActions>
          <Button >Forgot Password</Button>
        </DialogActions> */}
      </Dialog>
      </>
  )
}

export default ForgotPassword