import React from 'react'
import './hero.css'
import backgroundVideo from "../assets/sample.mp4"
import logo from "../assets/logoTransparent.png"

const Hero = () => {
  return (
    <div id="hero">
      <section className="hero">

        <div className="hero-content">
          <video className="video-background" autoPlay muted loop>
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <h1>Welcome to <span>GROUP</span>tinerary</h1>
          <p>Your ultimate solution for group travel planning. <br />
            Create, manage, and share your itineraries effortlessly!</p>
          <a href="#form" className="cta-button">Get Started</a>
        </div>
      </section>
    </div>
  )
}

export default Hero