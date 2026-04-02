import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faMessage, faCircleUser} from '@fortawesome/free-solid-svg-icons';
import "./Header.css";


const Header = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <div className="header-container">

        {/* Logo */}
        <Link to="/" className="logo">
          RTUpedia
        </Link>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/about"> <FontAwesomeIcon icon={faCircleInfo} className="nav-icon" /></Link>
          <Link to="/contact"><FontAwesomeIcon icon={faMessage} className="nav-icon" /></Link>
          <ThemeToggle />
          {/* 👤 PROFILE */}
          {user ? (
            <div className="profile-wrapper">
              <img
                src={
                  user?.profileImage ||
                  user?.picture ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                className="profile-img"
                alt="profile"
                onClick={() => setOpen(!open)}
              />

              {open && (
                <div className="profile-dropdown">
                  <p><b>{user.name}</b></p>
                  <p>{user.email}</p>

                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <FontAwesomeIcon
              icon={faCircleUser}
              className="nav-icon user-icon"
              onClick={() => navigate("/login")}
            />
          )}


        </nav>
      </div>
    </header>
  );
};

export default Header;