import { useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "./PDFViewer.css";
import { useAuth } from "../context/AuthContext";

// Worker
pdfjs.GlobalWorkerOptions.workerSrc =
  process.env.PUBLIC_URL + "/pdf.worker.min.js";

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

  // ⚡ Preload next page (smooth navigation)
  useEffect(() => {
    if (numPages && page < numPages) {
      const preload = new Image();
      preload.src = file;
    }
  }, [page, numPages, file]);

  return (
    <div className="pdf-modal">

      {/* Close */}
      <button className="close-btn" onClick={onClose}>
        ✖ Close
      </button>

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
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={() => setError(true)}
            loading="Loading PDF..."
          >
            <div className="page-wrapper">
             {page > 1 && (
      <Page
        pageNumber={page - 1}
        scale={scale}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        className="hidden-page"
      />
    )}

    {/* Current Page (visible) */}
    <Page
      pageNumber={page}
      scale={scale}
      renderTextLayer={false}
      renderAnnotationLayer={false}
    />

    {/* Next Page */}
    {page < numPages && (
      <Page
        pageNumber={page + 1}
        scale={scale}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        className="hidden-page"
      />
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