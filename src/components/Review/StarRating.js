import React from "react";

export default function StarRating({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "8px", margin: "10px 0", justifyContent: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          style={{
            cursor: "pointer",
            fontSize: "24px",
            color: star <= value ? "#f5b301" : "#ccc",
            transition: "0.2s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
