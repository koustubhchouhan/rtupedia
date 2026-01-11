import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchBranches,
  loadNotes,
  fetchPYQFromBackend,
  loadLabs,
  loadExtraMore
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

  /* =========================
     STATE
  ========================= */
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");

  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");

  const [tab, setTab] = useState("notes");

  const [notes, setNotes] = useState([]);
  const [pyqGrouped, setPyqGrouped] = useState([]);
  const [labGrouped, setLabGrouped] = useState([]);
  const [moreGrouped, setMoreGrouped] = useState([]);
  const [extraMore, setExtraMore] = useState([]);

  const [loadingPYQ, setLoadingPYQ] = useState(false);

  /* =========================
     LOAD BRANCHES
  ========================= */
  useEffect(() => {
    const list = fetchBranches(yearSlug);
    setBranches(list);
    setSelectedBranch(list[0] || "");
  }, [yearSlug]);

  /* =========================
     LOAD SEMESTERS
  ========================= */
  useEffect(() => {
    const semList = yearSemesterMap[yearSlug] || [];
    setSemesters(semList);
    setSelectedSemester(semList[0] || "");
  }, [yearSlug]);

  /* =========================
     RESET VIEW ON SELECTION CHANGE
  ========================= */
  useEffect(() => {
    setTab("notes");
    setPyqGrouped([]);
    setLabGrouped([]);
    setMoreGrouped([]);
    setExtraMore([]);
  }, [yearSlug, selectedBranch, selectedSemester]);

  /* =========================
     LOAD NOTES
  ========================= */
  useEffect(() => {
    if (!selectedBranch || !selectedSemester) return;

    const data = loadNotes(yearSlug, selectedBranch, selectedSemester);
    setNotes(Array.isArray(data) ? data : []);
  }, [yearSlug, selectedBranch, selectedSemester]);

  /* =========================
     LOAD PYQs (BACKEND)
  ========================= */
  useEffect(() => {
    if (tab !== "pyq" || notes.length === 0) return;

    setLoadingPYQ(true);

    fetchPYQFromBackend(yearSlug, selectedBranch, selectedSemester, notes)
      .then((data) => setPyqGrouped(Array.isArray(data) ? data : []))
      .finally(() => setLoadingPYQ(false));

  }, [tab, yearSlug, selectedBranch, selectedSemester, notes]);

  /* =========================
     LOAD LABS
  ========================= */
  useEffect(() => {
    if (tab !== "lab") return;

    const labs = loadLabs(yearSlug, selectedBranch, selectedSemester);
    setLabGrouped(Array.isArray(labs) ? labs : []);

  }, [tab, yearSlug, selectedBranch, selectedSemester]);

  /* =========================
     LOAD MORE (SUBJECT + EXTRA)
  ========================= */
  useEffect(() => {
    if (tab !== "more") return;

    // SUBJECT-WISE MORE
    const subjectMore = notes
      .filter((s) => Array.isArray(s.More) && s.More.length > 0)
      .map((s) => ({
        subjectName: s.subjectName,
        subjectCode: s.subjectCode,
        items: s.More
      }));

    setMoreGrouped(subjectMore);

    // SEMESTER-LEVEL EXTRA
    const extra = loadExtraMore(yearSlug, selectedBranch, selectedSemester);
    setExtraMore(Array.isArray(extra) ? extra : []);

  }, [tab, notes, yearSlug, selectedBranch, selectedSemester]);

  /* =========================
     UI
  ========================= */
  return (
    <div style={{ padding: 25 }}>
      <h2>{yearSlug.replace("-", " ").toUpperCase()} Resources</h2>

      {/* Branch + Semester */}
      <div className="select-row">
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          {branches.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          {semesters.map((s) => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="tab-row">
        {[
          { id: "notes", label: "Notes" },
          { id: "pyq", label: "PYQ (Main Exam)" },
          { id: "lab", label: "Lab" },
          { id: "more", label: "More" }
        ].map((t) => (
          <button
            key={t.id}
            className={`rt-tab-btn ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* NOTES */}
      {tab === "notes" && notes.map((sub, i) => (
        <div className="resource-card" key={i}>
          <details>
            <summary style={{ fontWeight: "bold" }}>
              {sub.subjectName} ({sub.subjectCode})
            </summary>

            {sub.units.map((u, j) => (
              <div key={j} style={{ marginTop: 10 }}>
                <strong>{u.unitName}</strong>
                <div style={{ display: "flex", gap: 12 }}>
                  <a className="resource-link" href={u.notesPDF} target="_blank" rel="noopener noreferrer">📑 PDF</a>
                  <a className="resource-link" href={u.lectureLink} target="_blank" rel="noopener noreferrer">▶ Video</a>
                </div>
              </div>
            ))}
          </details>
        </div>
      ))}

      {/* PYQs */}
      {tab === "pyq" && (
        <>
          {loadingPYQ && <p>Loading PYQs...</p>}
          {pyqGrouped.map((grp, i) => (
            <div className="pyq-subject-box" key={i}>
              <div className="pyq-subject-title">
                {grp.subjectName} ({grp.subjectCode})
              </div>
              {grp.pyqs.map((q, idx) => (
                <a key={idx} className="pyq-paper-link" href={q.pdf} target="_blank" rel="noopener noreferrer">
                  📄 {q.title}
                </a>
              ))}
            </div>
          ))}
        </>
      )}

      {/* LABS */}
      {tab === "lab" && labGrouped.map((grp, i) => (
        <div className="pyq-subject-box" key={i}>
          <div className="pyq-subject-title">
            {grp.subjectName} ({grp.subjectCode})
          </div>
          {grp.examPapers?.map((paper, idx) => (
            <a key={idx} className="pyq-paper-link" href={paper.pdfLink} target="_blank" rel="noopener noreferrer">
              📄 {paper.examType}
            </a>
          ))}
        </div>
      ))}

      {/* MORE (SUBJECT-WISE) */}
      {tab === "more" && moreGrouped.map((grp, i) => (
        <div className="pyq-subject-box" key={i}>
          <div className="pyq-subject-title">
            {grp.subjectName} ({grp.subjectCode})
          </div>
          {grp.items.map((m, idx) => (
            <a key={idx} className="pyq-paper-link" href={m.pdfLink} target="_blank" rel="noopener noreferrer">
              📄 {m.examType}
            </a>
          ))}
        </div>
      ))}

      {/* EXTRA (SEMESTER-LEVEL) */}
      {tab === "more" && (
        <div className="pyq-subject-box">
          <div className="pyq-subject-title">Extra Resources</div>

          {extraMore.length > 0 ? (
            extraMore.map((m, idx) => (
              <a key={idx} className="pyq-paper-link" href={m.pdfLink} target="_blank" rel="noopener noreferrer">
                📄 {m.examType}
              </a>
            ))
          ) : (
            <div className="pyq-empty-text">
              No extra resources available for this selection.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BranchContent;
