// BranchContent.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchBranches,
  autoDetectSemesters,
  loadNotes,
  fetchPYQFromBackend
} from "../utils/dataFetcher";

const BACKEND_BASE = "http://localhost:5000";

const BranchContent = () => {
  const { yearSlug } = useParams();

  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [tab, setTab] = useState("notes");
  const [notes, setNotes] = useState([]);
  const [pyqGrouped, setPyqGrouped] = useState([]);
  const [loadingPYQ, setLoadingPYQ] = useState(false);

  const [openAccordions, setOpenAccordions] = useState({});

  /* LOAD BRANCHES */
  useEffect(() => {
    const list = fetchBranches(yearSlug) || [];
    setBranches(list);
    setSelectedBranch(list[0] || "");
  }, [yearSlug]);

  /* LOAD SEMESTERS */
  useEffect(() => {
    if (!selectedBranch) return;
    const semList = autoDetectSemesters(yearSlug, selectedBranch) || [];
    setSemesters(semList);
    setSelectedSemester(semList[0] || "");
  }, [selectedBranch, yearSlug]);

  /* LOAD NOTES FROM JSON */
  useEffect(() => {
    if (!selectedBranch || !selectedSemester) {
      setNotes([]);
      return;
    }

    const list = loadNotes(yearSlug, selectedBranch, selectedSemester);
    setNotes(Array.isArray(list) ? list : []);

    const acc = {};
    (Array.isArray(list) ? list : []).forEach((s) => {
      const key = s.subjectCode || s.subjectName;
      acc[key] = false;
    });
    setOpenAccordions(acc);
  }, [yearSlug, selectedBranch, selectedSemester]);

  /* BUILD PYQs FROM BACKEND ONLY */
  const buildPyqView = async () => {
    setLoadingPYQ(true);
    try {
      const backendData = await fetchPYQFromBackend(
        yearSlug,
        selectedBranch,
        selectedSemester,
        notes
      );

      if (!backendData || typeof backendData !== "object") {
        setPyqGrouped([]);
        return;
      }

      // Normalize backend format → UI format
      const normalized = Object.entries(backendData).map(([subjectName, info]) => ({
        subject: `${info.subjectName} (${info.subjectCode})`,
        pyqs: info.pyqs.map((p) => ({
          title: `${p.year} Paper (PDF Download)`,
          pdf: p.pdfLink
        }))
      }));

      setPyqGrouped(normalized);
    } catch (e) {
      console.error("PYQ loading failed:", e);
      setPyqGrouped([]);
    } finally {
      setLoadingPYQ(false);
    }
  };

  /* WATCH TAB CHANGE */
  useEffect(() => {
    if (tab === "pyq") buildPyqView();
  }, [tab, notes, selectedBranch, selectedSemester]);

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  /* RENDER NOTES */
  const renderNotesAccordion = () => {
    if (!notes.length) return <p>No subjects available.</p>;

    return (
      <div>
        <h3>Unit-wise Notes and Videos</h3>

        {notes.map((sub, idx) => {
          const key = sub.subjectCode || `${sub.subjectName}-${idx}`;
          const open = openAccordions[key];

          return (
            <div className="accordion" key={key}>
              <div
                className="accordion-header"
                onClick={() => toggleAccordion(key)}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span>{open ? "▾" : "▸"}</span>
                  <div style={{ fontWeight: 700 }}>
                    {sub.subjectName} <span style={{ color: "#666" }}>({sub.subjectCode})</span>
                  </div>
                </div>
              </div>

              {open && (
                <div className="accordion-body">
                  {(sub.units || []).map((u, ui) => (
                    <div key={ui} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 17, fontWeight: 700 }}>{u.unitName}</div>

                      <div style={{ display: "flex", gap: 18 }}>
                        <a className="resource-link" href={u.notesPDF} target="_blank">
                          📑 PDF Notes
                        </a>

                        <a className="resource-link" href={u.lectureLink} target="_blank">
                          ▶ YouTube Lecture
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  /* RENDER PYQ CARDS */
  const renderPyqCards = () => {
    if (loadingPYQ) return <p>Loading PYQs...</p>;
    if (!pyqGrouped.length) return <p>No PYQs available.</p>;

    return (
      <div>
        <h3>Previous Year Question Papers (Main Exam)</h3>

        {pyqGrouped.map((grp, i) => (
          <div className="resource-card" key={i}>
            <div className="resource-title">{grp.subject}</div>

            {grp.pyqs.map((q, idx) => (
              <a
                key={idx}
                className="resource-link"
                href={q.pdf.startsWith("http") ? q.pdf : `${BACKEND_BASE}${q.pdf}`}
                target="_blank"
              >
                📄 {q.title}
              </a>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: 25 }}>
      <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
        {yearSlug?.replace("-", " ").toUpperCase()} Resources
      </div>

      <div className="select-row">
        <label>Select Branch:</label>
        <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
          {branches.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <label style={{ marginLeft: 20 }}>Semester:</label>
        <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
          {semesters.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 10, margin: "15px 0" }}>
        <button className={`rt-tab-btn ${tab === "notes" ? "active" : ""}`} onClick={() => setTab("notes")}>
          Notes
        </button>
        <button className={`rt-tab-btn ${tab === "pyq" ? "active" : ""}`} onClick={() => setTab("pyq")}>
          PYQ of Main Exam
        </button>
      </div>

      {tab === "notes" ? renderNotesAccordion() : renderPyqCards()}
    </div>
  );
};

export default BranchContent;
