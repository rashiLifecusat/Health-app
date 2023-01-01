import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Top_doctors from "../Doctor/Top_doctors";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import ReactLoading from "react-loading";
import CardMedia from "@mui/material/CardMedia";
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DefaultDoctor from "../../images/DefaultDoctor.png";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { DialogContent } from "@mui/material";
import moment from "moment/moment";
// import Row from "react-bootstrap/esm/Row";
import SendIcon from "@mui/icons-material/Send";
import DatePicker from "react-date-picker";
// import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Server } from "../Server/Server";
import { useNavigate } from "react-router-dom";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Favourites() {
    var token= localStorage.getItem("token")
    const history=useNavigate()
    const [value, setValue] = React.useState("recents");
    const [dateValue, onChange] = useState(new Date());
    const [data, setData] = useState([]);
    const [single, setSingle] = React.useState({});
    const [skip,setSkip] = useState(0)
    const [limit,setLimit] =useState(5)
    const [totalDoc,setTotalDoc] = useState(0)
    useEffect(() => {
      fetchData();
      
    }, []);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    console.log(single,"lllll")
  
    const fetchData=()=>{
      
      axios
        .get(Server.serverForOthers.link+"/user/fav", {
          params:{skip:skip,limit:limit},headers: { "x-token":  token},
        })
        .then((res) => {
          // console.log(res.data.data,"this is the res")
          console.log(res.data.data,"this is the single")
          setData(res.data.data);
          setTotalDoc(res.data.totalDoc)
        }); 
    }
    const fetchMoreData = () => {
      console.log(skip+1,"jjjjjjjj")
      var a = skip+1
      console.log(a,"jjjj")
      // setSkip(skip+1)
      axios
        .get(Server.serverForOthers.link+"/user/fav", {
          params:{skip:a,limit:limit},headers: { "x-token":  token},
        })
        .then((res) => {
          var newArray=data.concat(res.data.data)
          console.log(newArray,"this is the res")
          setData(newArray);
          setTotalDoc(res.data.totalDoc)
        });
    };
      
  
    const [open, setOpen] = React.useState(false);
    // const [requestOpen, setRequestOpen] = React.useState(false);
  
    const handleClickOpen = (id) => {
      setOpen(true);
      data.map((row) => {
        if (row._id === id) {
          return setSingle(row);
        }
      });
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const sendRequest = (id) => {
      try {
        if (dateValue === NaN) {
          toast.error("Select a date");
        } else {
          var data = {
            doctorId: id,
            date: moment(dateValue).valueOf(),
          };
          axios
            .post(Server.serverForOthers.link + "/user/booking_request", data, {
              headers: { "x-token": localStorage.getItem("token") },
            })
            .then((res) => {
              console.log(res, "hey you response");
              if (res.data.code === 201) {
                toast.error("Select any date");
              } else if (res.data.code === 202) {
                toast.error(res.data.message);
              } else {
                toast.success(res.data.message);
              }
            });
        }
      } catch (e) {
        toast.error("Something went wrong !");
      }
    };
    console.log(data,"this is the single")
  
    const addOrRemoveFav=(id)=>{
      console.log("id,,,,,,,",id)
      axios.post(Server.serverForOthers.link +"/user/addFavRemove",{id:id},{headers:{"x-token":token}}).then(async(res)=>{
        if(res.data.code===200){
         await axios
        .get(Server.serverForOthers.link+"/user/fav", {
          params:{skip:skip,limit:limit},headers: { "x-token":  token},
        })
        .then((res) => {
          // console.log(res.data.data,"this is the res")
          console.log(res.data.data,"this is the single")
          setData(res.data.data);
          setTotalDoc(res.data.totalDoc)
        });
        }
      })
      
    }
  return (
    <>
       <InfiniteScroll
          dataLength={data.length}
          next={fetchMoreData}
          hasMore={data.length !==totalDoc}
          loader={<>
          <ReactLoading
            type={"spokes"}
            color={"rgb(9 167 167)"}
            height={50}
            width={50}
          />
          </>}
        >
          <Container style={{marginTop:"15px"}}>
            <Row>
              {data.map((row) => (
                <>
                  <Col lg={3} md={4} sm={6} className="doctors_list">
                    <Card sx={{ maxWidth: 345 ,minHeight:"100%",maxHeight:"100%"}}>
                      <CardMedia
                        component="img"
                        alt="green iguana"
                        style={{height:"290px !important"}}
                        image={row.profilePhoto ==="" ? DefaultDoctor : Server.serverForOthers.link+`/Profilephoto/${row.profilePhoto}`}
                      />
                      <CardContent>
                      
                        <Typography gutterBottom variant="h5" component="div">
                         {row.user_name}
                        </Typography>
                        <h6>Description</h6>
                        <Typography variant="body2" color="text.secondary">
                         {row.bio === "" ? "We will let you know about this doctor designation once the doctor profile got verified from our end":`${row.bio}` }
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          style={{ color: "Black" }}
                          onClick={() => handleClickOpen(row._id)}
                          size="small"
                        >
                          <ContactPageIcon style={{ marginRight: "2px" }} />{" "}
                          Learn More
                        </Button>
                        <Button style={{ color: row.isFavourite === false ? "black" :"red" }} onClick={()=> addOrRemoveFav(row._id)} size="small">
                          {row.isFavourite == true ?(<FavoriteIcon style={{ marginRight: "2px" , color:"black"}} />):(<FavoriteIcon style={{ marginRight: "2px" ,color:"red" }} />) }
                          
                        </Button>
                      </CardActions>
                    </Card>
                  </Col>
                </>
              ))}
            </Row>
          </Container>
        </InfiniteScroll>
        <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        aria-labelledby="responsive-dialog-title"
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {single.user_name}
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={() => sendRequest(single._id)}
            >
              <SendIcon style={{ marginRight: "2px" }} />
              Send Request
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <List>
            <ListItem button>
              {/* <Box sx={{ flexGrow: 1 }}> */}

              <Card sx={{ maxWidth: 345 }} className="profilePic_doc">
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="300"
                  width="auto"
                  image={single.profilePhoto ==="" ? DefaultDoctor : Server.serverForOthers.link+`/Profilephoto/${single.profilePhoto}`}
                />
              </Card>
            </ListItem>
            <ListItem>
              <ListItemText primary="Name" />
              <ListItemText primary={single.user_name} />
            </ListItem>
            {/* <ListItem>
          <ListItemText primary="Current Ho" />
          <ListItemText primary="Vipin" />
          </ListItem> */}
            <ListItem>
              <ListItemText primary="Qualification" />
              <ListItemText primary={single.bio} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Available Days" />
              <ListItemText primary={`${"Sunday,Monday,Tuesday"}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Select Date for booking" />
              <ListItemText
                primary={
                  <>
                    <DatePicker onChange={onChange} value={dateValue} />
                  </>
                }
              />
            </ListItem>
            {/* <DatePicker onChange={onChange} value={dateValue} /> */}
            <Divider />
          </List>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Favourites