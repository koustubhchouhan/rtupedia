import React, { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";


const Header = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="main-header">
      <div className="header-container">

        <Link to="/" className="logo">
          RTUpedia
        </Link>

        <nav className="nav-links">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>

          {user ? (
            <div className="profile-wrapper">
              <div
                className="profile-icon"
                onClick={() => setOpen(!open)}
              >
                👤
              </div>

              {open && (
                <div className="profile-dropdown">
                  <p><b>{user.name}</b></p>
                  <p>{user.email}</p>

                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;