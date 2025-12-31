import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendReviewNotification = async ({ name, message, rating }) => {
  await transporter.sendMail({
    from: `"RTUpedia" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "🆕 New Review Submitted on RTUpedia",
    html: `
      <h2>New Review Received</h2>
      <p><strong>Name:</strong> ${name || "Anonymous"}</p>
      <p><strong>Rating:</strong> ⭐ ${rating}/5</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <br />
      <p>Status: <b>Pending Approval</b></p>
    `
  });
};
