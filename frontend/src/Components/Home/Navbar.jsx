import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import RequestPageIcon from '@mui/icons-material/RequestPage';
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
// import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import logo from "../../images/HP.png";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PolicyIcon from "@mui/icons-material/Policy";
import QuizIcon from "@mui/icons-material/Quiz";
import CloseIcon from "@mui/icons-material/Close";
import Chat from "@mui/icons-material/Chat";
import { useEffect } from "react";
import Slide from "@mui/material/Slide";
import Server from "../Server/Server";
import axios from "axios";
import VerifiedIcon from '@mui/icons-material/Verified';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

function Navbar() {
  var history=useNavigate()
  const [auth, setAuth] = useState(false);
  const [profile, setProfile] = useState(false);
  const [logout,setLogout]= useState(false)
  var authentication = localStorage.getItem("auth");
  if (authentication === true) {
    setAuth(true);
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [data,setData]=useState({})
  const [profilePhoto,setProfilePhoto]=useState("")
  console.log(auth, "this is auth");
  var userToken = localStorage.getItem("token");
  var docToken = localStorage.getItem("doctorToken");
  console.log(data,"kkkkk")
  var tokenOf;
  if(userToken){
    tokenOf=1
  }else if(docToken){
    tokenOf=2
  }else{
    tokenOf=3
  }

  useEffect(() => {
    if (userToken || docToken) {
      setAuth(true);
    }
  });

  useEffect(()=>{
    fetchData()
  },[])
  var token = userToken ? userToken :docToken
  const fetchData=()=>{
    axios.get(Server.Server.serverForOthers.link+"/user/getUser",{headers:{"x-token":token}}).then((response)=>{
      if(response.data.code===203){
        localStorage.clear()
        history("/Signin")
      }
      // window.location.reload()
        // console.log(,".,......")
        setData(response.data.results)
        setProfilePhoto(response.data.results.profilePhoto)
    })
  }

  const  logoutSubmit = ()=>{
    axios.post(Server.Server.serverForOthers.link+"/user/logout",{},{headers:{"x-token":token}}).then((response)=>{
      if(response.data.code ===200){
        history("/Signin")
        localStorage.clear()
        handleClose()
        setLogout(false)
        toast.success("logged out successfully")
      }
    })
  }

  const closeDrawer = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseProfile = () => {
    setProfile(false);
  };

  const handleOpenProfile = () => {
    setProfile(true);
    handleClose()
  };
  // var images =data.profilePhoto === undefined ? "" :data.profilePhoto
  var image = profilePhoto==="" ? "https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg": Server.Server.serverForOthers.link+`/Profilephoto/${profilePhoto}`

  // console.log(image,"kkkkk",data.profilePhoto)

  return (
    <>
      <Box sx={{ flexGrow: 1 }} className="healthapp_navbar">
        <AppBar position="static" className="healthapp">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => setOpen(!open)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="div" sx={{ flexGrow: 1 }}>
              <img src={logo} style={{ width: "50px", height: "50px" }} />
            </Typography>
            <div className="search">
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </div>

            {auth === true ? (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleOpenProfile}>View Profile</MenuItem>
                  <MenuItem onClick={()=>setLogout(true)}>Log out</MenuItem>
                </Menu>
              </div>
            ) : (
              ""
              // <Button variant="outlined" >Login</Button>""
            )}
          </Toolbar>
        </AppBar>
        <Drawer open={open} anchor="left" onClose={closeDrawer}>
          <DrawerHeader>
            <IconButton onClick={closeDrawer}>
              <CloseIcon />
            </IconButton>
            <Typography component="div" sx={{ flexGrow: 1 }}>
              {/* <img src={logo} style={{ maxWidth: "50px", height: "50px" }} /> */}
              HEALTH APP
            </Typography>
          </DrawerHeader>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={()=> {tokenOf ===1 ? history("/") : history("/Requests")}}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
                
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={()=>{tokenOf ===1 ? history("/userupdate") : history("/Doctorupdate")}}>
                <ListItemIcon>
                  <ManageAccountsIcon />
                </ListItemIcon>
                <ListItemText primary="Profile Management" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={()=>history("/requestStatus")}>
                <ListItemIcon>
                  <RequestPageIcon />
                </ListItemIcon>
                <ListItemText primary="Request Status" />
              </ListItemButton>
            </ListItem>
            {tokenOf ===1 ? (
              <>
                     
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary="Favorites" />
              </ListItemButton>
            </ListItem>
              </>
            ):""
}
    

            {/* <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem> */}
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <PolicyIcon />
                </ListItemIcon>
                <ListItemText primary="Privacy policy" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <QuizIcon />
                </ListItemIcon>
                <ListItemText primary="FAQ" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        {/* <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={auth}
                onChange={handleChange}
                aria-label="login switch"
              />
            }
            label={auth ? "Logout" : "Login"}
          />
        </FormGroup> */}
      </Box>
     {auth===true ? (
     <>  
     <Dialog
       open={profile}
       TransitionComponent={Transition}
       keepMounted
       onClose={handleCloseProfile}
       aria-describedby="alert-dialog-slide-description"
     >
       <Card sx={{ maxWidth: 345 }}>
         <CardMedia
           component="img"
           alt="green iguana"
           height="140"
           image={image}
         />
         <CardContent>
           <Typography gutterBottom variant="h5" component="div">
             {data.user_name}
           </Typography>
           <Typography variant="body2" color="text.secondary">
            Bio:- {data.bio}
           </Typography>
           <Typography variant="body2" color="text.secondary">
             Contact : -{data.countryCode}{data.contact}
           </Typography>
           <Typography variant="body2" color="text.secondary">
             Email :-{data.email}
           </Typography>
           <Typography variant="body2" color="text.secondary">
             {data.isEmailVerified ===true ? (<>Email Verified <VerifiedIcon style={{color:"green"}}/></>):(<>Email Not Verified <VerifiedIcon style={{color:"red"}}/></>)}
           </Typography>
         </CardContent>
         <CardActions>
           <Button onClick={handleCloseProfile}>Close</Button>
           {/* <Button onClick={handleCloseProfile}>Edit</Button> */}
         </CardActions>
       </Card>
     </Dialog>
     <Dialog
       open={logout}
       TransitionComponent={Transition}
       keepMounted
       onClose={()=>setLogout(false)}
       aria-describedby="alert-dialog-slide-description"
     >
     <DialogTitle>{"Would you like to logout?"}</DialogTitle>
        <DialogActions>
          <Button onClick={()=>setLogout(false)}>Cancel</Button>
          <Button onClick={logoutSubmit}>Agree</Button>
        </DialogActions>
     </Dialog>
     </>

     
     ):""}
    </>
  );
}

export default Navbar;
