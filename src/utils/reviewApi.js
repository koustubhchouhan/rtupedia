// src/utils/reviewApi.js


const BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://rtupedia-backend-2.onrender.com";


/* =========================
   SUBMIT REVIEW
========================= */
export const submitReview = (data) =>
  fetch(`${BASE}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to submit review");
    }
    return res.json();
  });

/* =========================
   GET APPROVED REVIEWS
========================= */
export const getReviews = async () => {
  try {
    const res = await fetch(`${BASE}/api/reviews`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("getReviews failed:", err);
    return []; // ✅ prevents UI crash
  }
};

/* =========================
   ADMIN: GET PENDING REVIEWS
========================= */
export const getPendingReviews = () =>
  fetch(`${BASE}/api/admin/reviews`, {
    headers: {
      "x-admin-key": "rtupedia_admin_secret",
    },
  }).then((res) => res.json());

/* =========================
   ADMIN: APPROVE REVIEW
========================= */
export const approveReview = (id) =>
  fetch(`${BASE}/api/admin/reviews/${id}/approve`, {
    method: "PUT",
    headers: {
      "x-admin-key": "rtupedia_admin_secret",
    },
  });

/* =========================
   ADMIN: DELETE REVIEW
========================= */
export const deleteReview = (id) =>
  fetch(`${BASE}/api/admin/reviews/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-key": "rtupedia_admin_secret",
    },
  });
