import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL:", API_URL); // Debugging line
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password }
      );

      // 🔥 use context (IMPORTANT)
      login(res.data);

      alert("Login successful!");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="contact-container">
        <h2>Login</h2>

        <form className="review-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <p
            style={{ marginTop: "10px", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Don’t have an account? Register
          </p>

          <p
            style={{ marginTop: "5px", cursor: "pointer" }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;