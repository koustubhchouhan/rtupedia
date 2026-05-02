import { useEffect, useState } from "react";
import {
  getPendingReviews,
  approveReview,
  deleteReview
} from "../utils/reviewApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminReviews.css";

 const adminEmails = [
    "rtupedia@gmail.com",
    "manangupta902@gmail.com",
    "kanchanprajapat208@gmail.com",
    "koustubhchouhan9@gmail.com",
    "manangupta9887@gmail.com",
    "kanchanprajapat2926@gmail.com",
    "mayankphalodia@gmail.com"
  ];

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

 

  /* 🔐 AUTH CHECK */
 useEffect(() => {
  if (!user) {
    navigate("/login");
  } else if (!adminEmails.includes(user.email)) {
    navigate("/");
  }
}, [user, navigate]);

  /* 📥 LOAD REVIEWS */
  const loadReviews = async () => {
    try {
      const data = await getPendingReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setReviews([]);
    }
  };

 useEffect(() => {
  if (!user) return;

  if (adminEmails.includes(user.email)) {
    loadReviews();
  }
}, [user]);

  /* ⛔ SAFETY UI */
  if (!user) return null;
  if (!adminEmails.includes(user.email)) return null;

  /* ✅ ADMIN DASHBOARD */
  return (
    <div className="admin-container">
      <h2 className="admin-title">Pending Reviews</h2>

      {reviews.length === 0 && <p>No pending reviews</p>}

      {reviews.map((r) => (
        <div key={r._id} className="admin-card">
          <div className="admin-name">{r.name}</div>
          <div className="admin-message">{r.message}</div>
          <div className="admin-rating">⭐ {r.rating}</div>

          <div className="admin-actions">
            <button
              className="admin-approve"
              onClick={async () => {
                await approveReview(r._id);
                loadReviews();
              }}
            >
              Approve
            </button>

            <button
              className="admin-delete"
              onClick={async () => {
                await deleteReview(r._id);
                loadReviews();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}