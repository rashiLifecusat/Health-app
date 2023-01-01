import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DefaultDoctor from "../../images/DefaultDoctor.png";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import PageviewIcon from "@mui/icons-material/Pageview";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import {  DialogContent } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
// impor from '@mui/material/ListItemText';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Doctor_card() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          alt="green iguana"
          // height="0px"

          image={DefaultDoctor}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
        <CardActions>
         
          <Button
            style={{ color: "Black" }}
            onClick={handleClickOpen}
            size="small"
          >
            <ContactPageIcon style={{ marginRight: "2px" }} /> Learn More
          </Button>
          <Button style={{color:"Black"}} size="small"><PageviewIcon style={{marginRight:"2px"}}/> </Button>
        </CardActions>
      </Card>
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
              RAJESH MA
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              <SendIcon style={{marginRight:"2px"}}/>Send Request
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
                image="http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcQTBIkxproxJHBsj2ZOkeFr3CYyVJjrfW8qcovw9whTrkRjsqYnBRlprpmyAknfOsug43oiT9iqS9cJe6s"
              />
            </Card>
          
          
        
       
          </ListItem>
          <ListItem>
          <ListItemText primary="Name" />
          <ListItemText primary="Vipin" />
          </ListItem>
          {/* <ListItem>
          <ListItemText primary="Current Ho" />
          <ListItemText primary="Vipin" />
          </ListItem> */}
          <ListItem>
          <ListItemText primary="Qualification" />
          <ListItemText primary={"MBBS , MSC , Psycholagyst"} />
          
          
          </ListItem>
          <ListItem>
          <ListItemText primary="Available Days" />
          <ListItemText primary={`${"Sunday,Monday,Tuesday"}`} />
          </ListItem>
          <Divider />
        </List>
        </DialogContent>
        
      </Dialog>
    </>
  );
}

export default Doctor_card;
