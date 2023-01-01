import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import axios from 'axios'
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useNavigate } from "react-router-dom";
import Server from "../Server/Server";
import { toast } from "react-toastify";


export default function Register() {
  const history=useNavigate()
  const [open, setOpen] = React.useState(true);
  const [latitude,setLatitude]=React.useState("")
  const [longitude,setLongitude]=React.useState("")
  const [radioValue, setValue] = React.useState('Doctor');
  const [user, setUser] = React.useState({ email: "", password: "",countryCode:"",contact:"" ,user_name:""});
  let name, value;
  const handaleinput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };
  
  window.navigator.geolocation
  .getCurrentPosition((res)=>setLatitude(res.coords.latitude));
  window.navigator.geolocation
  .getCurrentPosition((res)=> setLongitude(res.coords.longitude))
 
  // var a=user
  // a.role=radioValue
  // console.log(a,"hey user....")
  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const Register = () => {
    var data=user
    data.role=radioValue
    data.latitude=latitude.toString()
    data.longitude=longitude.toString()
    console.log(data,"the data is here")
    axios.post(Server.Server.serverForOthers.link+"/user/generateOTP",data).then((res)=>{
      if(res.data.code===200){
        localStorage.clear("retrunToken")
        localStorage.setItem("retrunToken",res.data.returnToken)
        localStorage.setItem("email",data.email)
        history("/VerifyOtp")
      } else if (res.data.code===201){
        toast.error(res.data.message)
      }
    })    
  };

  const returnTo = () => {
    history("/Signin")
  };


  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog open={open}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create your new account with health app
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
          <TextField
            autoFocus
            margin="dense"
            id="country_code"
            label="Country code"
            type="text"
            name="countryCode"
            fullWidth
            variant="standard"
            onChange={handaleinput}
          />
          <TextField
            autoFocus
            margin="dense"
            id="contact"
            label="contact number"
            name="contact"
            type="text"
            fullWidth
            variant="standard"
            onChange={handaleinput}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            name="password"
            fullWidth
            variant="standard"
            onChange={handaleinput}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="user_name"
            label="User name"
            type="text"
            fullWidth
            variant="standard"
            onChange={handaleinput}
          />
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">
              Role
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={radioValue}
              onChange={handleChange}
            >
              <FormControlLabel
                value="Doctor"
                control={<Radio />}
                label="Doctor"
              />
              <FormControlLabel value="User" control={<Radio />} label="User" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={returnTo}>Sign In</Button>
          <Button onClick={Register}>Register</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
