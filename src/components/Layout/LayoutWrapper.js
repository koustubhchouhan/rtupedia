import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  const isPDFPage = location.pathname === "/pdfview";

  return (
    <>
      {!isPDFPage && <Header />}

      <div id="progressBar"></div>

      <main style={{ flexGrow: 1 }}>
        {children}
      </main>
 <Footer />
    </>
  );
};

export default LayoutWrapper;