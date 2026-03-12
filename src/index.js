// src/index.js (No change in imports, just confirmation of all assets)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './hooks/useTheme'; 
import './styles/global.css';
import './styles/themes.css';

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({ duration: 800 });

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
