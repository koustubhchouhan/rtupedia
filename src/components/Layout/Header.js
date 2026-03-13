// src/components/Layout/Header.js

import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./Header.css"

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">

        {/* Logo */}
        <Link to="/" className="logo">
          RTUpedia
        </Link>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <ThemeToggle />
        </nav>

      </div>
    </header>
  );
};

export default Header;
