import { useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "./PDFViewer.css";
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";

// ✅ Worker (ONLY THIS — do not change)
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ file, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const pdfFile = useMemo(() => ({
  url: file
}), [file]);

  // 🔒 Auth check
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
  setPage(1);
}, [file]);

  // ✅ Load success
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
    setPage(1);
  }, []);

  // 🔐 Disable copy, right click etc
  useEffect(() => {
    const disable = (e) => e.preventDefault();
    const preventDoubleClick = (e) => e.preventDefault();

    document.addEventListener("contextmenu", disable);
    document.addEventListener("copy", disable);
    document.addEventListener("cut", disable);
    document.addEventListener("dblclick", preventDoubleClick);

    const handleVisibility = () => {
      document.body.style.filter = document.hidden ? "blur(10px)" : "none";
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("contextmenu", disable);
      document.removeEventListener("copy", disable);
      document.removeEventListener("cut", disable);
      document.removeEventListener("dblclick", preventDoubleClick);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // ⌨️ Arrow navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (loadingPage) return;

      if (e.key === "ArrowRight") {
        setLoadingPage(true);
        setPage((p) => Math.min(p + 1, numPages));
      }

      if (e.key === "ArrowLeft") {
        setLoadingPage(true);
        setPage((p) => Math.max(p - 1, 1));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [numPages, loadingPage]);

  // ❌ Block inspect
  useEffect(() => {
    const blockKeys = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", blockKeys);
    return () => document.removeEventListener("keydown", blockKeys);
  }, []);

  // ❌ ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") window.close();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  console.log("PDF FILE:", file);

  return (
    <div className="pdf-modal">

      {/* 🔍 Zoom */}
      <div className="zoom-controls">
        <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))}>-</button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(s + 0.2, 2.5))}>+</button>
      </div>

      {/* 🔁 Navigation */}
      <div className="nav-controls">
        <button
          disabled={page <= 1 || loadingPage}
          onClick={() => {
            setLoadingPage(true);
            setPage((p) => Math.max(p - 1, 1));
          }}
        >
          ⬅
        </button>

        <span>
          Page {page} of {numPages || "--"}
        </span>

        <button
          disabled={page >= numPages || loadingPage}
          onClick={() => {
            setLoadingPage(true);
            setPage((p) => Math.min(p + 1, numPages));
          }}
        >
          ➡
        </button>
      </div>

      {/* 📄 PDF */}
      <div className="pdf-container">
        {error ? (
          <div style={{ color: "white" }}>
            Failed to load PDF. Try again.
          </div>
        ) : (
          <Document
          
            file={ pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(err) => {
              console.error("PDF ERROR:", err);
              setError(true);
            }}
            loading="Loading PDF..."
          >
            <div className="page-wrapper">
              <Page
                key={page} // ✅ CRITICAL FIX
                pageNumber={page}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                onLoadSuccess={() => setLoadingPage(false)}
              />

              {/* Watermark */}
              <div className="watermark">
                <div className="watermark-text">RTUpedia</div>
              </div>
            </div>
          </Document>
        )}
      </div>
    </div>
  );
};

export default memo(PDFViewer);