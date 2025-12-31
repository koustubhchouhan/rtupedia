import "../../styles/global.css";

export default function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <h4>{review.name}</h4>
      <div className="stars">
        {"★".repeat(review.rating)}
      </div>
      <p>{review.message}</p>
    </div>
  );
}
