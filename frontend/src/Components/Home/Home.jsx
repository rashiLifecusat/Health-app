import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Doctor_card from '../Doctor/Doctor_card';
import Top_doctors from '../Doctor/Top_doctors';
import IconButton from '@mui/material/IconButton';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import Button from '@mui/material/Button';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

function Home() {
    const [value, setValue] = React.useState('recents');

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
  return (
    <>
      <Container>
      <Row>
        <Col lg={3} md={4} sm={6} style={{"width":"100%",marginTop:"1%" ,paddingBottom:"15px"}}>
        <Top_doctors/>
        </Col>
      </Row>
      <Row>
           
           <Col lg={3} md={4} sm={6} className="doctors_list">
               <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6}  className="doctors_list">
               <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6}  className="doctors_list">
               <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6}  className="doctors_list">
           <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6} className="doctors_list">
               <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6}  className="doctors_list">
               <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6}  className="doctors_list">
               <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6}  className="doctors_list">
           <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6} className="doctors_list">
               <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6}  className="doctors_list">
               <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6}  className="doctors_list">
               <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6}  className="doctors_list">
           <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6} className="doctors_list">
               <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6}  className="doctors_list">
               <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6}  className="doctors_list">
               <Doctor_card/>
           </Col>
           <Col lg={3} md={4} sm={6}  className="doctors_list">
           <Doctor_card/>
           </Col>
       </Row>
       <Row>
      
       <BottomNavigation sx={{ width: 3050 }} value={value} onChange={handleChange}>
      <BottomNavigationAction
        label="Recents"
        value="recents"
        icon={<RestoreIcon />}
      />
      <BottomNavigationAction
        label="Favorites"
        value="favorites"
        icon={<FavoriteIcon />}
      />
      <BottomNavigationAction
        label="Nearby"
        value="nearby"
        icon={<LocationOnIcon />}
      />
      <BottomNavigationAction label="Chats" value="chat" icon={<ChatBubbleIcon />} />
    </BottomNavigation>
      
      
       {/* <Col></Col>
        <Col> */}
        {/* <IconButton color="standard" aria-label="add to shopping cart"  >
                <h6>View More</h6>
                < TrendingFlatIcon />
            </IconButton> */}
        {/* </Col>
        <Col></Col> */}
      
       </Row>
    </Container>
    </>
  )
}

export default Home