//reviewApi.js

const BASE =
  process.env.NODE_ENV === "production"
    ? "https://rtupedia-backend-2.onrender.com"
    : "http://localhost:5000";



export const submitReview = (data) =>
  fetch(`${BASE}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());

export const getReviews = async () => {
  try {
    const res = await fetch(`${BASE}/api/reviews`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("getReviews failed:", err);
    return []; // ✅ prevent app crash
  }
};

export const getPendingReviews = () =>
  fetch(`${BASE}/admin/reviews`, {
    headers: { "x-admin-key": "rtupedia_admin_secret" }
  }).then(res => res.json());

export const approveReview = (id) =>
  fetch(`${BASE}/admin/reviews/${id}/approve`, {
    method: "PUT",
    headers: { "x-admin-key": "rtupedia_admin_secret" }
  });

export const deleteReview = (id) =>
  fetch(`${BASE}/admin/reviews/${id}`, {
    method: "DELETE",
    headers: { "x-admin-key": "rtupedia_admin_secret" }
  });

