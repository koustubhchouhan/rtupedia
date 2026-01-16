import { Link } from "react-router-dom";
import "./reviews.css";

export default function ReviewCard({ review, preview = false }) {
  return (
    <div className="review-card">
      <h4 className="review-name">{review.name}</h4>

      <div className="stars">
        {"★".repeat(review.rating)}
      </div>

      <p className={`review-message ${preview ? "preview" : ""}`}>
        {review.message}
      </p>

      {preview && (
        <Link to="/reviews" className="read-more">
          … Read more
        </Link>
      )}
    </div>
  );
}
