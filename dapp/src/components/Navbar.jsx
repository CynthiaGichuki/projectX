import React from "react";
import "../styles/navbar.css";
import logo from "../assets/logo2.png";
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Project X Logo" className="logo-img" />
        </Link>

        {/* Buttons */}
        <div className="navbar-buttons">
          <Link to="/projects" className="btn btn-primary">Projects</Link>
          <button className="btn btn-primary">Vote</button>
          <button className="btn btn-secondary">Connect Wallet</button>
          <button className="btn btn-secondary">Log In</button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
