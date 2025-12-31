import { useEffect, useState } from "react";
import { getReviews } from "../utils/reviewApi";
import ReviewCard from "../components/Review/ReviewCard";
import "./SGPACalculator.css";  

export default function AllReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReviews().then(setReviews);
  }, []);

  return (
    <div className="all-reviews-container">
      <h2 className="all-reviews-title">
        What Students Say About RTUpedia
      </h2>

      <div className="all-reviews-grid">
        {reviews.map((r) => (
          <ReviewCard key={r._id} review={r} />
        ))}
      </div>
    </div>
  );
}
