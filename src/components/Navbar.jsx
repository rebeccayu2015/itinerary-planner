import React from 'react'
import "./navbar-styles.css";
import logo from "../assets/logoTransparent.png";

const Navbar = () => {
    return (
        <div>
            <nav className="navbar">
                <img src={logo} alt="Logo" className="logo" />
                <ul>
                    <li className="nav-list"><a href="#hero" className="nav-link">Home</a></li>
                    <li className="nav-list"><a href="#form" className="nav-link">Form</a></li>
                    <li className="nav-list"><a href="#locations" className="nav-link">Locations</a></li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar