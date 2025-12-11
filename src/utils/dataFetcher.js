// src/utils/dataFetcher.js

import yearFirst from "../data/rtu_first_year.json";
import yearSecond from "../data/rtu_second_year.json";
import yearThird from "../data/rtu_third_year.json";
import yearFourth from "../data/rtu_fourth_year.json";

const BACKEND_BASE_URL = "http://localhost:5000";

const memoryCache = {
  notes: {},
  pyq: {}
};

const getYearJSON = (yearSlug) => {
  switch (yearSlug) {
    case "first-year": return yearFirst;
    case "second-year": return yearSecond;
    case "third-year": return yearThird;
    case "fourth-year": return yearFourth;
    default: return null;
  }
};

const normalize = (str) =>
  String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

/* --------------------------------------------------------
   1) FETCH BRANCHES
--------------------------------------------------------- */
export const fetchBranches = (yearSlug) => {
  const data = getYearJSON(yearSlug);
  if (!data) return [];

  if (yearSlug === "first-year") return ["COMMON"];

  return Object.keys(data).map((b) => b.toUpperCase());
};

/* --------------------------------------------------------
   2) AUTO-DETECT SEMESTERS
--------------------------------------------------------- */
export const autoDetectSemesters = (yearSlug, branch) => {
  const data = getYearJSON(yearSlug);
  if (!data || !branch) return [];

  if (yearSlug === "first-year") return ["1", "2"];

  const branchData = data[branch.toUpperCase()];
  if (!branchData) return [];

  return Object.keys(branchData);
};

/* --------------------------------------------------------
   3) LOAD NOTES (ALWAYS FROM JSON)
--------------------------------------------------------- */
export const loadNotes = (yearSlug, branch, semester) => {
  const key = `${yearSlug}-${branch}-${semester}`;
  if (memoryCache.notes[key]) return memoryCache.notes[key];

  const data = getYearJSON(yearSlug);
  if (!data) return [];

  if (yearSlug === "first-year") {
    memoryCache.notes[key] = data["COMMON"][semester] || [];
    return memoryCache.notes[key];
  }

  const branchData = data[branch.toUpperCase()];
  if (!branchData) return [];

  const subjects = branchData[semester] || [];
  memoryCache.notes[key] = subjects;

  return subjects;
};

/* --------------------------------------------------------
   4) FETCH PYQ FROM BACKEND ONLY
   → ALWAYS returns clean grouped structure:
   {
     "Subject Name": {
        subjectName: "...",
        subjectCode: "...",
        pyqs: [
          { year: "2025", pdfLink: "http://localhost:5000/main/...pdf" }
        ]
     }
   }
--------------------------------------------------------- */
export const fetchPYQFromBackend = async (yearSlug, branch, semester, subjectsList = []) => {
  const key = `${branch}-${semester}`;
  if (memoryCache.pyq[key]) return memoryCache.pyq[key];

  try {
    const url = `${BACKEND_BASE_URL}/api/pyq/${branch}/${semester}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.error("Backend PYQ error:", res.statusText);
      return {};
    }

    const pdfFiles = await res.json();
    if (!Array.isArray(pdfFiles)) return {};

    // Build subject buckets
    const groups = {};

    subjectsList.forEach((sub) => {
      groups[sub.subjectName] = {
        subjectName: sub.subjectName,
        subjectCode: sub.subjectCode,
        pyqs: []
      };
    });

    // Match PDFs to subjects
    pdfFiles.forEach((file) => {
      const cleanFile = normalize(file.title || file.pdf || file);

      let matchedSubject = null;

      for (const sub of subjectsList) {
        const cleanSubName = normalize(sub.subjectName);
        const cleanSubCode = normalize(sub.subjectCode);

        if (cleanFile.includes(cleanSubName) || cleanFile.includes(cleanSubCode)) {
          matchedSubject = sub.subjectName;
          break;
        }
      }

      if (!matchedSubject) return;

      const year = file.title?.match(/\d{4}/)?.[0] || "Unknown";

      groups[matchedSubject].pyqs.push({
        year,
        pdfLink: `${BACKEND_BASE_URL}${file.pdf}` 
      });
    });

    memoryCache.pyq[key] = groups;
    return groups;
  } catch (error) {
    console.error("PYQ backend fetch failed:", error);
    return {};
  }
};

export default {
  fetchBranches,
  autoDetectSemesters,
  loadNotes,
  fetchPYQFromBackend
};
