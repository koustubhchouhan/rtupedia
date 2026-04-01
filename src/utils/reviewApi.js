const BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://rtupedia-backend-2.onrender.com";

/* =========================
   HELPER: GET TOKEN
========================= */
const getToken = () => localStorage.getItem("userToken");

/* =========================
   SUBMIT REVIEW (🔐 PROTECTED)
========================= */
export const submitReview = async (data) => {
  const res = await fetch(`${BASE}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`, // 🔥 IMPORTANT
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Login required or failed to submit");
  }

  return res.json();
};

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
    return [];
  }
};

/* =========================
   ADMIN: GET PENDING REVIEWS
========================= */
export const getPendingReviews = async () => {
  const res = await fetch(`${BASE}/api/admin/reviews/pending`, {
    headers: {
      Authorization: `Bearer ${getToken()}`, // 🔐 now using JWT
    },
  });

  return res.json();
};

/* =========================
   ADMIN: APPROVE REVIEW
========================= */
export const approveReview = async (id) => {
  await fetch(`${BASE}/api/admin/reviews/approve/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

/* =========================
   ADMIN: DELETE REVIEW
========================= */
export const deleteReview = async (id) => {
  await fetch(`${BASE}/api/admin/reviews/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};