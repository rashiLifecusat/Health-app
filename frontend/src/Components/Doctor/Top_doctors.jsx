import React from 'react'
import Carousel from 'react-bootstrap/Carousel';

function Top_doctors() {
  return (
    <>
        <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://wallpapercave.com/wp/wp2789228.jpg"
          alt="First slide"
        />
        <Carousel.Caption style={{color:"black"}}>
          <h3 style={{color:"black"}}>First slide label</h3>
          <p style={{color:"black"}}>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://wallpapercave.com/wp/wp2789215.jpg"
          alt="Second slide"
        />

        <Carousel.Caption style={{color:"black"}}>
          <h3 style={{color:"black"}}>Second slide label</h3>
          <p style={{color:"black"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://wallpapercave.com/wp/wp2789194.jpg"
          alt="Third slide"
        />

        <Carousel.Caption style={{color:"black"}}>
          <h3 style={{color:"black"}}>Third slide label</h3>
          <p style={{color:"black"}}>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    </>
  )
}

export default Top_doctors