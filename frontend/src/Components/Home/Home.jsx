import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Doctor_card from '../Doctor/Doctor_card';
import Top_doctors from '../Doctor/Top_doctors';
import IconButton from '@mui/material/IconButton';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import Button from '@mui/material/Button';

function Home() {
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
       <Col></Col>
       <Col>
       <Button style={{color:"white",alignItems:"center"}} size="big"><TrendingFlatIcon/> View More</Button>
       </Col>
       <Col></Col>
      
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