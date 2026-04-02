import { useEffect, useState } from "react";
import {
  getPendingReviews,
  approveReview,
  deleteReview
} from "../utils/reviewApi";
import { ADMIN_PASSWORD } from "../config/admin";
import { useAuth } from "../context/AuthContext";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState("");

  const loadReviews = async () => {
    const data = await getPendingReviews();
    setReviews(data);
  };

  const { user } = useAuth();
   useEffect(() => {
    if (authorized) loadReviews();
  }, [authorized]);

if (user?.email !== "rtupedia@gmail.com" && user?.email !== "manangupta902@gmail.com" && user?.email !== "kanchanprajapat208@gmail.com" && user?.email !== "koustubhchouhan9@gmail.com" && user?.email !== "manangupta9887@gmail.com" && user?.email !== "kanchanprajapat2926@gmail.com") {
  return <p>Not authorized</p>;
}

 

  /* 🔐 PASSWORD CHECK */
  if (!authorized) {
    return (
      <div className="admin-container">
        <h2 className="admin-title">Admin Access</h2>

        <input
          type="password"
          placeholder="Enter admin password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            padding: "12px",
            width: "100%",
            maxWidth: "320px",
            borderRadius: "8px",
            marginBottom: "12px",
            border: "1px solid #ccc"
          }}
        />

        <button
          className="admin-approve"
          onClick={() => {
            if (input === ADMIN_PASSWORD) {
              setAuthorized(true);
            } else {
              alert("Wrong password");
            }
          }}
        >
          Unlock
        </button>
      </div>
    );
  }

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
