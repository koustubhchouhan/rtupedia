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
  const [visiblePages, setVisiblePages] = useState([1,2,3]);
  const [error, setError] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);


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
  setVisiblePages([1,2,3]);
  setCurrentPage(1);
}, [file]);


  // ✅ Load success
  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
 
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

useEffect(() => {
  const container = document.querySelector(".pdf-container");
  if (!container) return;

  const handleScroll = () => {

    // 🔥 PAGE DETECTION
    const pages = container.querySelectorAll(".page-wrapper");

    pages.forEach((page, index) => {
      const rect = page.getBoundingClientRect();
      const containerTop = container.getBoundingClientRect().top;

      if (rect.top >= containerTop && rect.top < containerTop + container.clientHeight / 2) {
        setCurrentPage(index + 1);
      }
    });

    // 🔥 LAZY LOAD
    const scrollBottom =
      container.scrollTop + container.clientHeight >= container.scrollHeight - 200;

    if (scrollBottom && numPages) {
      setVisiblePages((prev) => {
        const nextPage = prev.length + 1;

        if (nextPage <= numPages && !prev.includes(nextPage)) {
          return [...prev, nextPage];
        }
        return prev;
      });
    }
  };

  container.addEventListener("scroll", handleScroll);
  return () => container.removeEventListener("scroll", handleScroll);
}, [numPages]);


  // ⌨️ Arrow navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (loadingPage) return;

   
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

<div className="page-indicator">
  {currentPage} / {numPages || "--"}
</div>
     
     

      {/* 📄 PDF */}
      <div className="pdf-container"
      >
        {error ? (
          <div style={{ color: "white" }}>
            Failed to load PDF. Try again.
          </div>
        ) : (
         <Document
  file={pdfFile}
  onLoadSuccess={onDocumentLoadSuccess}
  onLoadError={(err) => {
    console.error("PDF ERROR:", err);
    setError(true);
  }}
  loading="Loading PDF..."
>
  {visiblePages.map((p) => (
    <div key={p} className="page-wrapper">
      <Page
        pageNumber={p}
        scale={scale}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />

      {/* Watermark */}
      <div className="watermark">
        <div className="watermark-text">RTUpedia</div>
      </div>
    </div>
  ))}
</Document>
        )}
      </div>
    </div>
  );
};

export default memo(PDFViewer);