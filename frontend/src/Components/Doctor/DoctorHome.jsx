import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Button, ButtonGroup, IconButton, Tooltip ,Tab } from "@mui/material";
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Server from "../Server/Server";
import { toast } from "react-toastify";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { useNavigate } from "react-router-dom";
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const moment = require("moment");

function DoctorHome() {
  var token = localStorage.getItem("doctorToken");
  const history = useNavigate();
  const [data, setData] = useState([]);
  const [value, setValue] = React.useState('0');
  console.log("data",token)
  const handleChange = (event, newValue) => { 
    setValue(newValue);
    fetchData(newValue)
  };

  console.log(data, "....s....");
  useEffect(() => {
    fetchData(value);

  }, []);

  const fetchData = async (value) => {
    console.log(value,"hey type")
    await axios
      .get(Server.Server.serverForOthers.link + "/user/getRequestsforUser", {
        params:{type:value},headers: { "x-token": token },
      })
      .then((res) => {
        console.log(res, "this is the response...", res.data.data);
        if (res.data.code === 203) {
          toast.error(res.data.message);
          localStorage.clear();
          history("/Signin");
        } else if (res.data.code === 201) {
          toast.error(res.data.message);
        } else {
          setData(res.data.data);
          // toast.success(res.data.message);
        }
      });
  };

  const acceptDeclineRequest = async (id, type) => {
    try {
      await axios
        .post(
          Server.Server.serverForOthers.link + "/user/accept_or_decline",
          {
            requestId: id,
            type: type,
          },
          { headers: { "x-token": token } }
        )
        .then((res) => {
          if (res.data.code === 203) {
            localStorage.clear();
            history("/Signin");
            toast.error(res.data.message);
          } else if (res.data.code === 201) {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            fetchData();
          }
        });
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
     
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "#d9dadf" }}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Requests" value="0" />
            <Tab label="Accepted" value="1" />
            <Tab label="Rejected" value="2" />
          </TabList>
        </Box>
        <TabPanel value="0">
        {data.map((data) => (
          <Row>
            <Col sm={8}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt="Remy Sharp"
                    src="http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcQTBIkxproxJHBsj2ZOkeFr3CYyVJjrfW8qcovw9whTrkRjsqYnBRlprpmyAknfOsug43oiT9iqS9cJe6s"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={data.name}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {moment(data.date).format("MM/DD/YYYY")}
                      </Typography>
                      <br />
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {`consultation duration:- ${data.consultingDuration}`}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </Col>
            <Col sm={4}>
              <ButtonGroup>
                <Tooltip title="Delete the request">
                  <Button
                    edge="end"
                    aria-label="delete"
                    onClick={() => acceptDeclineRequest(data._id, 2)}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>
                <Tooltip title="Accept Request">
                  <Button
                    edge="end"
                    aria-label="delete"
                    onClick={() => acceptDeclineRequest(data._id, 1)}
                  >
                    <AddBoxIcon />
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </Col>
          </Row>
        ))}
        </TabPanel>
        <TabPanel value="1">
        {data.map((data) => (
          <Row>
            <Col sm={8}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt="Remy Sharp"
                    src="http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcQTBIkxproxJHBsj2ZOkeFr3CYyVJjrfW8qcovw9whTrkRjsqYnBRlprpmyAknfOsug43oiT9iqS9cJe6s"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={data.name}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {moment(data.date).format("MM/DD/YYYY")}
                      </Typography>
                      <br />
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {`consultation duration:- ${data.consultingDuration}`}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </Col>
            <Col sm={4}>
              {data.date===moment().valueOf() ? (<>
                <IconButton aria-label="chat">
                  <ChatBubbleOutlineIcon />
                </IconButton>
              </>):(<><Tooltip title="Available at the date"><SpeakerNotesOffIcon/></Tooltip></>)}
            </Col>
          </Row>
        ))}
        </TabPanel>
        <TabPanel value="2">
        {data.map((data) => (
          <Row>
            <Col sm={8}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar
                    alt="Remy Sharp"
                    src="http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcQTBIkxproxJHBsj2ZOkeFr3CYyVJjrfW8qcovw9whTrkRjsqYnBRlprpmyAknfOsug43oiT9iqS9cJe6s"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={data.name}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {moment(data.date).format("MM/DD/YYYY")}
                      </Typography>
                      <br />
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {`consultation duration:- ${data.consultingDuration}`}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </Col>
            <Col sm={4}>
              <Tooltip title="Request cancelled"><DoDisturbIcon/></Tooltip>
            </Col>
          </Row>
        ))}
          </TabPanel>
      </TabContext>
    </Box>
       
      </List>
    </>
  );
}

export default DoctorHome;
