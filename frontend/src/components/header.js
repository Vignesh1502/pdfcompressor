import React from 'react';
// import logo from '../assets/pdf-compressor.png'; // Adjust the path as needed
import logo from '../assets/headerlogo.png'

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      {/* <nav className="menu">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav> */}
    </header>
  );
};

export default Header;
