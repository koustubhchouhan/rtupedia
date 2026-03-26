import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./PDFViewer.css";

// ✅ worker
pdfjs.GlobalWorkerOptions.workerSrc =
  process.env.PUBLIC_URL + "/pdf.worker.min.js";

const PDFViewer = ({ file, onClose }) => {
  const [numPages, setNumPages] = useState(null);

  return (
    <div className="pdf-modal">
      <button className="close-btn" onClick={onClose}>
        ✖ Close
      </button>

      <div
        className="pdf-container"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Document
          file={encodeURI(file)}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={(err) => console.error("PDF ERROR:", err)}
        >
          {/* ✅ SINGLE LOOP ONLY */}
          {Array.from(new Array(numPages), (_, index) => (
            <div key={index} style={{ position: "relative" }}>
              
              {/* PDF PAGE */}
              <Page
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />

              {/* WATERMARK */}
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