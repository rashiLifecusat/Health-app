import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import axios from "axios";
import Server from "../Server/Server";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Userupdate() {
    const history = useNavigate()
    var token = localStorage.getItem("token")
    const [data,setData]= useState({})
  const [user, setUser] =useState({
    countrycode: "",
    contact: "",
    bio: "",
    user_name: "",
  });

  useEffect(()=>{
    fetchData()
  },[])
  const fetchData=()=>{
    axios.get(Server.Server.serverForOthers.link+"/user/getUser",{headers:{"x-token":token}}).then((response)=>{
        // console.log(,".,......")
        if(response.data.code===203){
            history("/Signin")
            localStorage.clear()
            toast.error(response.data.message)
        }else if(response.data.code===200){
            setData(response.data.results)
            // toast.success(response.data.message)
        }
    })
  }
  const [image,setImage] =useState("")
  let name;
  let value;
  const handaleinput = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };  
  const handleSubmit =()=>{
   
    const formData = new FormData()
    formData.append("file", image);
    formData.append("bio", user.bio);
    formData.append("contact", user.contact);
    formData.append("countrycode", user.countrycode);
    formData.append("user_name", user.user_name);
    axios.post(Server.Server.serverForOthers.link+"/user/updateProfile",formData,{headers:{'x-token':token}}).then((response)=>{
        console.log('kkkkk',response)
    })
  }


  return (
    <div>
      <Form
        style={{ backgroundColor: "white", height: "91vh", padding: "20px" }}
        onSubmit={handleSubmit}
      >
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Country code</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            id="countrycode"
            name="countrycode"
            defaultValue={data.countryCode}
            onChange={handaleinput}
          />
          <Form.Label>Contact</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            id="contact"
            name="contact"
            defaultValue={data.contact}
            onChange={handaleinput}
          />
          <Form.Label>User name</Form.Label>
          <Form.Control
            type="text"
            placeholder=""
            id="user_name"
            name="user_name"
            defaultValue={data.user_name}
            onChange={handaleinput}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            id="bio"
            name="bio"
            defaultValue={data.bio}
            onChange={handaleinput}
          />
        </Form.Group>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Select new profile pic</Form.Label>
          <Form.Control
            type="file"
            size="lg"
            id="file"
            name="file"
            onChange={(e)=>setImage(e.target.files[0])}
          />
        </Form.Group>
        <Button type="submit">Update profile</Button>
      </Form>
    </div>
  );
}

export default Userupdate;
