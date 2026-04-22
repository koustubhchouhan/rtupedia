import { useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "./PDFViewer.css";
import { useAuth } from "../context/AuthContext";


pdfjs.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ file, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔒 Auth check
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const onDocumentLoadSuccess = useCallback(({ numPages }) => {
    setNumPages(numPages);
  }, []);

  

  useEffect(() => {
  const disable = (e) => e.preventDefault();

  document.addEventListener("contextmenu", disable);
  document.addEventListener("copy", disable);
  document.addEventListener("cut", disable);

   const preventDoubleClick = (e) => e.preventDefault();
  document.addEventListener("dblclick", preventDoubleClick);

  const handleVisibility = () => {
    if (document.hidden) {
      document.body.style.filter = "blur(10px)";
    } else {
      document.body.style.filter = "none";
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    document.removeEventListener("contextmenu", disable);
    document.removeEventListener("copy", disable);
    document.removeEventListener("cut", disable);
    document.removeEventListener("dblclick", preventDoubleClick);
    document.addEventListener("visibilitychange", handleVisibility);
  };
}, []);

useEffect(() => {
  const handleKey = (e) => {
    if (e.key === "ArrowRight") {
      setPage(p => Math.min(p + 1, numPages));
    }
    if (e.key === "ArrowLeft") {
      setPage(p => Math.max(p - 1, 1));
    }
  };


  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, [numPages]);


useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === "Escape") window.close();
  };

  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
}, []);


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

  return () => {
    document.removeEventListener("keydown", blockKeys);
  };
}, []);

console.log("PDF FILE RECEIVED:", file);



  return (
    <div className="pdf-modal">

      {/* Zoom */}
      <div className="zoom-controls">
        <button  onClick={() => setScale(s => Math.max(s - 0.2, 0.5))}>-</button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(s + 0.2, 2.5))}>+</button>
      </div>

      {/* Navigation */}
      <div className="nav-controls">
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
          ⬅
        </button>

        <span>
          Page {page} of {numPages || "--"}
        </span>

        <button
          disabled={page >= numPages}
          onClick={() => setPage(p => p + 1)}
        >
        ➡
        </button>
      </div>

      {/* PDF */}
      <div className="pdf-container">
        {error ? (
          <div style={{ color: "white" }}>
            Failed to load PDF. Try again.
          </div>
        ) : (
         <Document
           key={file}
  file={{ url: file,
  withCredentials: false 
   }}
     // 🔥 THIS FIXES YOUR ISSUE
  onLoadSuccess={onDocumentLoadSuccess}
  onLoadError={(err) => {
    console.error("PDF LOAD ERROR:", err);
    setError(true);
  }}
  loading="Loading PDF..."
>
            <div className="page-wrapper">
   {/* PREVIOUS */}
{page > 1 && (
  <div style={{ display: "none" }}>
    <Page
      pageNumber={page - 1}
      scale={scale}
      renderTextLayer={false}
      renderAnnotationLayer={false}
    />
  </div>
)}

{/* CURRENT */}
<Page
  pageNumber={page}
  scale={scale}
  renderTextLayer={false}
  renderAnnotationLayer={false}
/>

{/* NEXT */}
{page < numPages && (
  <div style={{ display: "none" }}>
    <Page
      pageNumber={page + 1}
      scale={scale}
      renderTextLayer={false}
      renderAnnotationLayer={false}
    />
  </div>
)}


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