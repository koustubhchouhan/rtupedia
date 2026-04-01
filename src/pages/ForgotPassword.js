import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL:", API_URL); // Debugging line
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/forgot-password`,
        { email }
      );

      const token = res.data.resetToken;

      if (!token) {
        setMessage("Error generating reset link");
        return;
      }

      // 🔥 generate reset link
      const resetLink = `${window.location.origin}/reset-password/${token}`;

      setMessage("Reset link generated 👇");

      // open link automatically (optional)
      window.open(resetLink, "_blank");

    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="container">
      <div className="contact-container">
        <h2>Forgot Password</h2>

        <form className="review-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Send Reset Link</button>
        </form>

        {message && (
          <p style={{ marginTop: "10px" }}>{message}</p>
        )}

        <p
          style={{ marginTop: "10px", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;