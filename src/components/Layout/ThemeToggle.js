// src/components/Layout/ThemeToggle.js

import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import "./Header.css";


const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
   <FontAwesomeIcon 
  icon={theme === "light" ? faToggleOff : faToggleOn}  
  className="theme-toggle-icon"
  onClick={toggleTheme}
/>

  );
};

export default ThemeToggle;