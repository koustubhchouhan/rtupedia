import  { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "./PDFViewer.css";
import { useAuth } from "../context/AuthContext";

// ✅ Worker setup (correct)
pdfjs.GlobalWorkerOptions.workerSrc =
  process.env.PUBLIC_URL + "/pdf.worker.min.js";

const PDFViewer = ({ file, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
  if (!user) {
    alert("Please login to view PDFs");
    navigate("/login");
  }
}, [user, navigate]);

  return (
    <div className="pdf-modal">
      
      {/* Close Button */}
      <button className="close-btn" onClick={onClose}>
        ✖ Close
      </button>

      {/* Zoom Controls */}
      <div className="zoom-controls">
        <button onClick={() => setScale(prev => Math.max(prev - 0.2, 0.5))}>
          ➖
        </button>

        <span>{Math.round(scale * 100)}%</span>

        <button onClick={() => setScale(prev => Math.min(prev + 0.2, 2.5))}>
          ➕
        </button>
      </div>

      {/* PDF */}
      <div
        className="pdf-container"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Document
          file={encodeURI(file)}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => console.error("PDF ERROR:", err)}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <div key={index} className="page-wrapper">
              
              {/* Page */}
              <Page
                pageNumber={index + 1}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
              {Array.from(new Array(numPages), (_, index) => (
                <div key={index} className="page-wrapper">
    
                {/* Page */}
                <Page
                 pageNumber={index + 1}
                 scale={scale}
                 renderTextLayer={false}
                 renderAnnotationLayer={false}
                 />

                 {/* ✅ Page Number */}
                 <div className="page-number">
                 Page {index + 1} of {numPages}
                 </div>

                 {/* Watermark */}
                 <div className="watermark">
                 <div className="watermark-text">RTUpedia</div>
                 </div>

                 </div>
                 ))}

              {/* Watermark */}
              <div className="watermark">
                <div className="watermark-text">RTUpedia</div>
              </div>

            </div>
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;