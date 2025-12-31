import { useEffect, useState } from "react";
import { getReviews } from "../../utils/reviewApi";
import ReviewCard from "./ReviewCard";
import "../../pages/YearSelection.css";
import { Link } from "react-router-dom";

export default function ReviewSlider({ limit = 3 }) {
  const [reviews, setReviews] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getReviews().then(setReviews);
  }, []);

  if (!reviews.length) return null;

  const visible = reviews.slice(index, index + limit);

  const next = () => {
    if (index + limit < reviews.length) {
      setIndex(index + limit);
    }
  };

  const prev = () => {
    if (index - limit >= 0) {
      setIndex(index - limit);
    }
  };

  return (
    <section className="review-section">
      <h2 className="review-title">What Students Say</h2>

      <div className="review-slider">
        {visible.map((r) => (
          <ReviewCard key={r._id} review={r} />
        ))}
      </div>

      <div className="review-controls">
        <button onClick={prev} disabled={index === 0}>‹</button>
        <button onClick={next} disabled={index + limit >= reviews.length}>›</button>
      </div>

      <Link to="/reviews" className="view-all">
        View all reviews →
      </Link>
    </section>
  );
}
