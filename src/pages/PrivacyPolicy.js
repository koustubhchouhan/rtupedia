import React from "react";
import "./terms.css";

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">

      <h1>Privacy Policy</h1>

      <p className="legal-intro">
        At RTUpedia, your privacy matters. We keep things simple, transparent,
        and safe for every student using our platform.
      </p>

      <div className="legal-card">

        <h2>1. What We Collect</h2>
        <p>
          We only collect your name, email, and profile picture through Google Sign-In.
          No unnecessary personal data is collected.
        </p>

        <h2>2. How We Use It</h2>
        <p>
          Your data is used to personalize your experience, save preferences,
          and improve platform performance.
        </p>

        <h2>3. Data Safety</h2>
        <p>
          We do not sell or share your data. Everything stays secure within RTUpedia.
        </p>

        <h2>4. Third-Party Services</h2>
        <p>
          We use Google authentication. Google may process your data as per their policies.
        </p>

        <h2>5. Updates</h2>
        <p>
          This policy may change over time. Continued use means you accept updates.
        </p>

      </div>
    </div>
  );
};

export default PrivacyPolicy;