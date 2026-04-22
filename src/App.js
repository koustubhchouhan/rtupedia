import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import ProtectedRoute from "./components/ProtectedRoute";
import LayoutWrapper from "./components/Layout/LayoutWrapper";

const Home = lazy(() => import("./pages/Home"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const BranchContent = lazy(() => import("./pages/BranchContent"));
const SGPACalculator = lazy(() => import("./pages/SGPACalculator"));
const AdminReviews = lazy(() => import("./pages/AdminReview"));
const AllReviews = lazy(() => import("./pages/AllReviews"));
const Login = lazy(() => import("./pages/Login"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/TermsAndConditions"));
const PDFViewerPage = lazy(() => import("./pages/PDFViewerPage"));

const App = () => {

  useEffect(() => {
    if (window.innerWidth > 768) {
      AOS.init({ duration: 800, once: true });
    }
  }, []);

  return (
    <Router>
      <LayoutWrapper>
        <Suspense fallback={
          <div style={{ color: "white", textAlign: "center", marginTop: "60px" }}>
            Loading RTUpedia...
          </div>
        }>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/year/:yearSlug" element={<BranchContent />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/SGPACalculator" element={<SGPACalculator />} />

            <Route
              path="/admin/reviews"
              element={
                <ProtectedRoute>
                  <AdminReviews />
                </ProtectedRoute>
              }
            />

            <Route path="/reviews" element={<AllReviews />} />
            <Route path="/pdfview" element={<PDFViewerPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />

            <Route path="*" element={
              <div className="container">
                <h2>404 - Page Not Found</h2>
              </div>
            } />
          </Routes>

        </Suspense>
      </LayoutWrapper>
    </Router>
  );
};

export default App;