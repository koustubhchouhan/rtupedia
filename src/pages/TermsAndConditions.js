import React from "react";
import "./terms.css";

const Terms = () => {
  return (
    <div className="legal-page">

      <h1>Terms & Conditions</h1>

      <p className="legal-intro">
        By using RTUpedia, you agree to use the platform responsibly and for
        educational purposes only.
      </p>

      <div className="legal-card">

        <h2>1. Use of Content</h2>
        <p>
          All notes, PYQs, and materials are provided for learning purposes only.
        </p>

        <h2>2. Accuracy</h2>
        <p>
          Content may not always reflect the latest university updates.
        </p>

        <h2>3. User Responsibility</h2>
        <ul>
          <li>Do not misuse the platform</li>
          <li>Do not upload harmful content</li>
          <li>Respect study materials</li>
        </ul>

        <h2>4. Account</h2>
        <p>
          You are responsible for your account activity and login details.
        </p>

        <h2>5. Limitation</h2>
        <p>
          RTUpedia is not responsible for academic results or outcomes.
        </p>

      </div>
    </div>
  );
};

export default Terms;