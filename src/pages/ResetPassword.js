import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL;

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/reset-password/${token}`,
        { password }
      );

      // 🔥 auto login after reset
      login(res.data);

      alert("Password reset successful!");
      navigate("/");

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Reset failed"
      );
    }
  };

  return (
    <div className="container">
      <div className="contact-container">
        <h2>Reset Password</h2>

        <form className="review-form" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Reset Password</button>
        </form>

        {message && (
          <p style={{ marginTop: "10px", color: "red" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;