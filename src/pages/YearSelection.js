// src/pages/YearSelection.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import LoadingSpinner from "../components/UI/LoadingSpinner";

import yearDataJSON from "../data/year_data.json";
import syllabusLinks from "../data/syllabus_links.json";
import ReviewSlider from "../components/Review/ReviewSlider";

import "./YearSelection.css";

import { FaRegHandshake } from "react-icons/fa6";
import { GiBookshelf } from "react-icons/gi";
import { MdVideoSettings } from "react-icons/md";
import { PiMedalFill } from "react-icons/pi";


const YearSelection = () => {
  const [yearData, setYearData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* Load years from local JSON */
  useEffect(() => {
    if (yearDataJSON?.years) {
      setYearData(yearDataJSON.years);
    }
    setLoading(false);
  }, []);

  const handleYearSelect = (yearSlug) => {
    navigate(`/year/${yearSlug}`);
  };

  const downloadSyllabus = (link) => {
    window.open(link, "_blank");
  };

  if (loading) return <LoadingSpinner />;

  const branches = [...new Set(syllabusLinks.map((item) => item.branch))];

  return (
    <>
      <h2 style={{marginTop:"10px"}}>Select Your Academic Year</h2>
      <p>Choose your current B.Tech year to access notes, PYQs, and resources.</p>

  {/* YEAR CARDS SECTION */}
<div className="year-card-grid">
  {yearData.map((year) => (
    <Card
      key={year.slug}
      title={`${year.year} Notes`}
      onClick={() => handleYearSelect(year.slug)}
    >
      <p style={{ marginTop: "10px", color: "var(--color-text)" }}>
        Click to view branches and subjects.
      </p>
    </Card>
  ))}
</div>

      <hr style={{ marginLeft:"30px",borderColor: "var(--color-border)",marginTop:"60px",marginBottom:"40px" }} />

      {/* SYLLABUS SECTION */}
      <div style={{ textAlign: "center" }}>
        <h2>Official RTU Syllabus</h2>
        <p style={{ marginBottom: "20px" }}>
          Download the official B.Tech syllabus
        </p>

        <div className="card-grid">
          {branches.map((branch) => {
            const branchSyllabus = syllabusLinks.filter(
              (i) => i.branch === branch
            );

            return (
              <Card
                key={branch}
                title={branchFullName(branch)}
                style={{ textAlign: "center", minHeight: "180px" }}
              >
                {branchSyllabus.map((linkItem) => (
                  <Button
                    key={`${linkItem.branch}-${linkItem.year}`}
                    onClick={() => downloadSyllabus(linkItem.link)}
                    style={{ margin: "5px", padding: "6px 10px" }}
                  >
                    {linkItem.year}
                  </Button>
                ))}
              </Card>
            );
          })}
        </div>
      </div>

      {/* SGPA CALCULATOR */}
      <div className="home-container" style={{marginTop:"50px"}}>
        <div className="sgpa-card" onClick={() => navigate("/SGPACalculator")}>
          <h2>SGPA Calculator</h2>
          <p>Calculate your RTU B.tech. SGPA instantly using semester-wise credits.</p>
          <button className="sgpa-btn">Open Calculator</button>
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="why-container">
        <h2 className="why-title">Why Choose RTUpedia?</h2>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">
              <FaRegHandshake />
            </div>
            <h3 className="why-heading">Student-Driven Platform</h3>
            <p className="why-text">
              Designed by RTU students to simplify the journey for every RTU B.tech. student
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <GiBookshelf />
            </div>
            <h3 className="why-heading">Comprehensive Coverage</h3>
            <p className="why-text">
              Notes, PYQs, syllabus, tools, and branch-wise content — everything organized semester-wise.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <MdVideoSettings />
            </div>
            <h3 className="why-heading">Fast & Modern Tools</h3>
            <p className="why-text">
              SGPA calculators, utilities, and smart study features designed for speed and accuracy with reference videos.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon">
              <PiMedalFill />
            </div>
            <h3 className="why-heading">Trusted & Reliable</h3>
            <p className="why-text">
             Clean UI, accurate tools, and verified content make RTUpedia a dependable study companion.
            </p>
          </div>
        </div>
      </div>
    
      <ReviewSlider limit={3} />
    </>
  );
};

const branchFullName = (code) => {
  const map = {
    CSE: "Computer Science & Engineering",
    EE: "Electrical Engineering",
    ME: "Mechanical Engineering",
    CE: "Civil Engineering",
    CHEM: "Chemical Engineering",
    CY: "Cyber Security",
    IT: "Information Technology",
    IOT: "Internet of Things",
    AIDS: "AI & Data Science",
  };
  return map[code] || code;
};

export default YearSelection;
