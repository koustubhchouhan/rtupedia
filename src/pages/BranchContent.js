import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchBranches,
  loadNotes,
  fetchPYQFromBackend
} from "../utils/dataFetcher";
import "./SGPACalculator.css";
import "../styles/global.css";

const yearSemesterMap = {
  "first-year": ["1", "2"],
  "second-year": ["3", "4"],
  "third-year": ["5", "6"],
  "fourth-year": ["7", "8"]
};

const BranchContent = () => {
  const { yearSlug } = useParams();

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");

  const [tab, setTab] = useState("notes");

  const [notes, setNotes] = useState([]);
  const [pyqGrouped, setPyqGrouped] = useState([]);
  const [loadingPYQ, setLoadingPYQ] = useState(false);

  /* LOAD BRANCHES */
  useEffect(() => {
    const list = fetchBranches(yearSlug) || [];
    setBranches(list);
    setSelectedBranch(list[0] || "");
  }, [yearSlug]);

  /* SET SEMESTERS (ODD DEFAULT) */
  useEffect(() => {
    const semList = yearSemesterMap[yearSlug] || [];
    setSemesters(semList);
    setSelectedSemester(semList[0] || "");
  }, [yearSlug]);

  /* LOAD NOTES */
  useEffect(() => {
    if (!selectedBranch || !selectedSemester) return;
    const data = loadNotes(yearSlug, selectedBranch, selectedSemester);
    setNotes(Array.isArray(data) ? data : []);
  }, [yearSlug, selectedBranch, selectedSemester]);

  /* LOAD PYQs FROM BACKEND */
  useEffect(() => {
    if (tab !== "pyq" || !selectedBranch || !selectedSemester) return;

    setLoadingPYQ(true);

    fetchPYQFromBackend(selectedBranch, selectedSemester, notes)
      .then((data) => {
        setPyqGrouped(Array.isArray(data) ? data : []);
      })
      .catch(() => setPyqGrouped([]))
      .finally(() => setLoadingPYQ(false));

  }, [tab, selectedBranch, selectedSemester, notes]);

  return (
    <div style={{ padding: 25 }}>
      <h2>{yearSlug.replace("-", " ").toUpperCase()} Resources</h2>

      {/* Branch + Semester Selector */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <div>
          <label>Branch:</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Semester:</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            {semesters.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-row">
  <button
    className={`rt-tab-btn ${tab === "notes" ? "active" : ""}`}
    onClick={() => setTab("notes")}
  >
    Notes
  </button>

  <button
    className={`rt-tab-btn ${tab === "pyq" ? "active" : ""}`}
    onClick={() => setTab("pyq")}
  >
    PYQ (Main Exam)
  </button>
</div>

      {/* NOTES */}
      {tab === "notes" && (
        <div>
          <h3>Unit-wise Notes & Videos</h3>

          {notes.length === 0 && <p>No notes available.</p>}

       {notes.map((sub, i) => (
  <div className="resource-card" key={i}>
    <details>
      <summary style={{ fontWeight: "bold" }}>
        {sub.subjectName} ({sub.subjectCode})
      </summary>

      {(sub.units || []).map((u, j) => (
        <div key={j} style={{ marginLeft: 20, marginTop: 10 }}>
          <div style={{ fontWeight: 700 }}>{u.unitName}</div>

          <a href={u.notesPDF} target="_blank" rel="noreferrer" style={{color: "var(--color-tertiary)", fontWeight: "500"}}>
            📑 PDF Notes
          </a>{" "}
          <span style={{ margin: "0 6px" }}>|</span>
          <a href={u.lectureLink} target="_blank" rel="noreferrer"  style={{color: "var(--color-tertiary)", fontWeight: "500"}}>
            ▶ Video Lecture
          </a>
        </div>
      ))}
    </details>
  </div>
))}

        </div>
      )}

      {/* PYQs */}
      {tab === "pyq" && (
        <div>
          <h3>Previous Year Question Papers (Main Exam)</h3>

          {loadingPYQ && <p>Loading PYQs...</p>}

          {!loadingPYQ && pyqGrouped.map((grp, i) => (
            <div className="pyq-subject-box" key={i}>
              <div className="pyq-subject-title">
                {grp.subjectName} ({grp.subjectCode})
              </div>

              {grp.pyqs.map((q, idx) => (
                <a
                  key={idx}
                  className="pyq-paper-link"
                  href={q.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 {q.title}
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BranchContent;
