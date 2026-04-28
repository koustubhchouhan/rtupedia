import React, { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faCircleInfo,
  faMessage,
  faCircleUser,
  faHouse,
  faBars,
  faBook,
  faCalculator,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

 const scrollToSection = (id) => {
  if (window.location.pathname !== "/") {
    navigate("/", { state: { scrollTo: id } });
  } else {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
  setSidebarOpen(false);
};

  return (
    <>
      <header className="main-header">
        <div className="header-container">

          {/* ☰ MENU (ONLY MOBILE) */}
          <FontAwesomeIcon
            icon={faBars}
            className="menu-btn"
            onClick={() => setSidebarOpen(true)}
          />

          {/* Logo */}
          <div className="logo-group">
            <Link to="/" className="logo">RTUpedia</Link>
            <h5>Smart Study Hub for RTU Students</h5>
          </div>

          {/* 🔥 DESKTOP NAV */}
          <nav className="nav-links">

            <Link to="/" className="nav-link">
              <FontAwesomeIcon icon={faHouse} />
            </Link>

            <div className="nav-link" onClick={() => scrollToSection("sgpa")}>
              <FontAwesomeIcon icon={faCalculator} />
            </div>

            <Link to="/about" className="nav-link">
              <FontAwesomeIcon icon={faCircleInfo} />
            </Link>

            <Link to="/contact" className="nav-link">
              <FontAwesomeIcon icon={faMessage} />
            </Link>

            <ThemeToggle />

            {/* PROFILE */}
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
                  onClick={() => setProfileOpen(!profileOpen)}
                />

                {profileOpen && (
                  <div className="profile-dropdown">
                    <p><b>{user.name}</b></p>
                    <p>{user.email}</p>
                    <button onClick={logout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <FontAwesomeIcon icon={faCircleUser} className="nav-link" />
            )}
          </nav>
        </div>
      </header>

      {/* 📱 SIDEBAR (ONLY MOBILE) */}
      <div className={`mobile-sidebar ${sidebarOpen ? "active" : ""}`}>

        <button className="close-btn" onClick={() => setSidebarOpen(false)}>✖</button>

        <Link to="/" className="sidebar-item">
  <FontAwesomeIcon icon={faHouse} /> <span>Home</span>
</Link>

        <div className="sidebar-item" onClick={() => scrollToSection("notes")}>
          <FontAwesomeIcon icon={faBook} /> <span>Notes</span>
        </div>

        <div className="sidebar-item" onClick={() => scrollToSection("syllabus")}>
          <FontAwesomeIcon icon={faFileLines} /> <span>Syllabus</span>
        </div>

        <div className="sidebar-item" onClick={() => scrollToSection("sgpa")}>
          <FontAwesomeIcon icon={faCalculator} /> <span>SGPA Calculator</span>
        </div>

        <Link to="/about" className="sidebar-item">
          <FontAwesomeIcon icon={faCircleInfo} /> <span>About</span>
        </Link>

        <Link to="/contact" className="sidebar-item">
          <FontAwesomeIcon icon={faMessage} /> <span>Contact</span>
        </Link>
        
<div className="sidebar-item">
  <span>Theme</span>
  <div className="theme-toggle-wrap">
    <ThemeToggle />
  </div>
</div>


        {/* PROFILE (SIDEBAR) */}
{user ? (
  <div className="sidebar-item profile-side">
    <img
      src={
        user?.profileImage ||
        user?.picture ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
      }
      className="sidebar-profile-img"
      alt="profile"
    />
    <div className="sidebar-profile-info">
      <span>{user.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  </div>
) : (
  <Link to="/login" className="sidebar-item">
    <FontAwesomeIcon icon={faCircleUser} /> <span>Login</span>
  </Link>
)}

      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  );
};

export default Header;