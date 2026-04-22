
import PDFViewer from "../components/PDFViewer";

const PDFViewerPage = () => {
const query = new URLSearchParams(window.location.search);
const rawFile = query.get("file");

 const file = decodeURIComponent(rawFile);
 const finalFile = file.startsWith("http")
  ? file
  : window.location.origin + file;

  console.log("FINAL FILE:", file);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
    <PDFViewer file={finalFile} onClose={() => window.close()} />
    </div>
  );
};

export default PDFViewerPage;