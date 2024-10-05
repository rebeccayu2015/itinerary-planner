import React from 'react'

const Navbar = () => {
  return (
    <div>
        <nav className="navbar">
            <ul>
                <img src="/path/to/logo.png" alt="Logo" className="logo" />
                <li className="nav-list"><a href="#hero" className="nav-link">Grouptinerary</a></li>
                <li className="nav-list"><a href="#form" className="nav-link">Form</a></li>
                <li className="nav-list"><a href="#locations" className="nav-link">Locations</a></li>
            </ul>
        </nav>
    </div>
  )
}

export default Navbar
