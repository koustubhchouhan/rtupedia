// src/App.js

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import BranchContent from './pages/BranchContent';
import SGPACalculator from "./pages/SGPACalculator";
import AdminReviews from "./pages/AdminReview";
import AllReviews from "./pages/AllReviews";
import AOS from "aos";
import "aos/dist/aos.css";
import Login from "./pages/Login";





const App = () => {

 useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
  }, []);

  useEffect(() => {
    const progress = document.getElementById("progressBar");

    const handleScroll = () => {
      const scrolled =
        (document.documentElement.scrollTop /
          (document.documentElement.scrollHeight -
            document.documentElement.clientHeight)) *
        100;

      if (progress) progress.style.width = scrolled + "%";
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Router>
      <Header />
      <div id="progressBar"></div>

      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/year/:yearSlug" element={<BranchContent />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/SGPACalculator" element={<SGPACalculator />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/reviews" element={<AllReviews />} />
          <Route path="*" element={<div className="container"><h2>404 - Page Not Found</h2></div>} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </main>

      <Footer />
    </Router>
  );
};

export default App;