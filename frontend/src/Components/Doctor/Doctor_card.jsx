import React from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DefaultDoctor from '../../images/DefaultDoctor.png'
import ChatIcon from '@mui/icons-material/Chat';
import ContactPageIcon from '@mui/icons-material/ContactPage';
function Doctor_card() {
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
        <Button style={{color:"Black"}} size="small"><ChatIcon style={{marginRight:"2px"}}/> Message</Button>
        <Button style={{color:"Black"}}  size="small">< ContactPageIcon style={{marginRight:"2px"}}/> Learn More</Button>
      </CardActions>
    </Card>
    </>
  )
}

export default Doctor_card