import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import {useLocation} from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 
  const from = location.state?.from?.pathname || "/";

  const API_URL = process.env.REACT_APP_API_URL;

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/google`,
        {
          token: credentialResponse.credential,
        }
      );

      // ✅ save user
      login(res.data);

      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));

      navigate(from);

    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

return (
   <div className="login-container">
  <div className="login-card">

    <h2>Welcome to RTUpedia</h2>
    <p>Continue with Google to access notes & PYQs</p>

    {/* <div className="google-btn">
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="google"
      />
      <span>Continue with Google</span>
    </div> */}
       <button className="google-btn"   >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => alert("Google Login Failed")}
        />
        </button>
      </div>
    </div>
  );
};


export default Login;