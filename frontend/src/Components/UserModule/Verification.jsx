import React, { useEffect } from 'react'
import OTPInput from "otp-input-react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import Server from '../Server/Server';
import { toast } from 'react-toastify';
import { useNavigate} from 'react-router-dom'
import { useState } from 'react';
// var role;

function Verification() {
    var history=useNavigate()
    const [open, setOpen] = React.useState(true);
    const [OTP, setOTP] = React.useState("");
    const [role,setRole] = useState('')
    
      const handleClose = () => {
        setOpen(false);
      };

      useEffect(()=>{
        setRole(localStorage.getItem("role"))
      })

      console.log(role,".....sss",localStorage.getItem("role"))

      const submitOtp=()=>{
        var email=localStorage.getItem("email")
        var token=localStorage.getItem("retrunToken")
        // console.log(Server.Server.serverForOthers.link,"sss")
        axios.post(Server.Server.serverForOthers.link+"/user/verifyOTP",{otp:OTP,email:email,token:token}).then((res)=>{
            console.log("res is here",res)
            if(res.data.code===200){
                axios.post(Server.Server.serverForOthers.link+"/user/Register",{},{headers:{"x_token":token}}).then((res)=>{
                    if(res.data.code===200){
                      console.log(res.data.results,"the res[ponse")
                      if(res.data.results.role==="Doctor"){
                        localStorage.setItem("doctorToken",res.data.results.accessToken)
                        localStorage.setItem("role",res.data.results.role)
                        setTimeout(()=>{
                          // if(role==="Doctor"){
                            toast.success(res.data.message)
                            history("/Requests")
                            window.location.reload()
                          // }
                        },1000)

                      }else if(res.data.results.role==="User"){
                        localStorage.setItem("token",res.data.results.accessToken)
                        localStorage.setItem("role",res.data.results.role)
                        setTimeout(()=>{
                          // if(role==="User"){
                            toast.success(res.data.message)
                            history("/")
                            window.location.reload() 
                          // }
                        },1000)
                        // if(role==="User"){
                        //   history("/")
                        // }else if(role==="Doctor"){
                        //   toast.success(res.data.message)
                        //   history("/Requests")
                        // }
                      }
                      // var role = localStorage.getItem("role")
                      // setTimeout(
                      //   ()=>{
                      //       if(role==="User"){
                      //         history("/")
                      //       }else if(role==="Doctor"){
                      //         toast.success(res.data.message)
                      //         history("/Requests")
                      //       }
                      //    }
                      // ,1000)
                      
                      
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
      // const resendOtp=()=>{

      // }
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