// src/utils/dataFetcher.js

import yearFirst from "../data/rtu_first_year.json";
import yearSecond from "../data/rtu_second_year.json";
import yearThird from "../data/rtu_third_year.json";
import yearFourth from "../data/rtu_fourth_year.json";

/* ✅ BACKEND BASE */
const BACKEND_BASE = "https://rtupedia-backend-2.onrender.com";

/* CACHE */
const cache = {
  notes: {},
  pyq: {}
};

/* YEAR JSON */
const getYearJSON = (yearSlug) => {
  switch (yearSlug) {
    case "first-year": return yearFirst;
    case "second-year": return yearSecond;
    case "third-year": return yearThird;
    case "fourth-year": return yearFourth;
    default: return null;
  }
};

/* NORMALIZER */
const normalize = (str) =>
  String(str || "").toLowerCase().replace(/[^a-z0-9]/g, "");

/* FETCH BRANCHES */
export const fetchBranches = (yearSlug) => {
  const data = getYearJSON(yearSlug);
  if (!data) return [];

  if (yearSlug === "first-year") return ["COMMON"];
  return Object.keys(data).map((b) => b.toUpperCase());
};

/* LOAD NOTES */
export const loadNotes = (yearSlug, branch, semester) => {
  const key = `${yearSlug}-${branch}-${semester}`;
  if (cache.notes[key]) return cache.notes[key];

  const data = getYearJSON(yearSlug);
  if (!data) return [];

  let subjects = [];

  if (yearSlug === "first-year") {
    subjects = data["COMMON"]?.[semester] || [];
  } else {
    subjects = data[branch]?.[semester] || [];
  }

  cache.notes[key] = subjects;
  return subjects;
};

/* FETCH PYQs */
export const fetchPYQFromBackend = async (
  branch,
  semester,
  subjectsList = []
) => {
  const key = `${branch}-${semester}`;
  if (cache.pyq[key]) return cache.pyq[key];

  try {
    const res = await fetch(
      `${BACKEND_BASE}/api/pyq/${branch}/${semester}`
    );

    if (!res.ok) return [];

    const files = await res.json();
    if (!Array.isArray(files)) return [];

    const groups = subjectsList.map((sub) => ({
      subjectName: sub.subjectName,
      subjectCode: sub.subjectCode,
      pyqs: []
    }));

    files.forEach((file) => {
      const cleanFile = normalize(file.title);

      groups.forEach((grp) => {
        if (
          cleanFile.includes(normalize(grp.subjectName)) ||
          cleanFile.includes(normalize(grp.subjectCode))
        ) {
          const year = file.title.match(/\d{4}/)?.[0] || "Unknown";

          grp.pyqs.push({
            title: `${year} Paper (PDF Download)`,
            pdf: `${BACKEND_BASE}${file.pdf}`
          });
        }
      });
    });

    const finalGroups = groups.filter((g) => g.pyqs.length > 0);
    cache.pyq[key] = finalGroups;
    return finalGroups;

  } catch {
    return [];
  }
};

export default {
  fetchBranches,
  loadNotes,
  fetchPYQFromBackend
};
