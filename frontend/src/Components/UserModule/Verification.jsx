import React from 'react'
import OTPInput from "otp-input-react";
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


function Verification() {
    var history=useNavigate()
    const [open, setOpen] = React.useState(true);
    const [OTP, setOTP] = React.useState("");
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const submitOtp=()=>{
        var email=localStorage.getItem("email")
        var token=localStorage.getItem("retrunToken")
        // console.log(Server.Server.serverForOthers.link,"sss")
        axios.post(Server.Server.serverForOthers.link+"/user/verifyOTP",{otp:OTP,email:email,token:token}).then((res)=>{
            console.log("res is here",res)
            if(res.data.code===200){
                axios.post(Server.Server.serverForOthers.link+"/user/Register",{},{headers:{"x_token":token}}).then((res)=>{
                    if(res.data.code===200){
                      localStorage.setItem("token",res.data.result)
                      localStorage.setItem("auth",true)
                      toast.success(res.data.message)
                      history("/")
                    } else {
                      toast.error(res.data.message)
                    }
                })
            }else if(res.data.code===201){
                toast.error(res.data.message)
            }
            localStorage.clear("email")
        })
      }
      const resendOtp=()=>{

      }
    return (
      <>
      <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button> */}
      <Dialog open={open}>
        <DialogTitle>Verify Otp</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please check your mail to get the otp
          </DialogContentText>
          <OTPInput value={OTP} onChange={setOTP} autoFocus OTPLength={4} otpType="number" disabled={false} secure />
        
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Resend otp</Button>
          <Button onClick={submitOtp}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
      
      </>
    );
}

export default Verification