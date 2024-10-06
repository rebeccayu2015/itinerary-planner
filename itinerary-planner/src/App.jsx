import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

import Form from './components/Form'
import Locations from './components/Locations'

import "./styles.css";

const App = () => {
  return (
    <>
      <div class="app-container">
        <Navbar />
        <div className="content-wrapper">
          <Hero />
          <Form />
          <Locations />
        </div>
      </div>
    </>
  )
}

export default App