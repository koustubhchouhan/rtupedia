import yearFirst from "../data/rtu_first_year.json";
import yearSecond from "../data/rtu_second_year.json";
import yearThird from "../data/rtu_third_year.json";
import yearFourth from "../data/rtu_fourth_year.json";
import yearFirstLab from "../data/rtu_first_year_lab.json";

/* =========================
   BACKEND
========================= */
const BACKEND_BASE = "https://rtupedia-backend-2.onrender.com";

/* =========================
   CACHE
========================= */
const cache = {
  notes: {},
  pyq: {},
  lab: {},
  extraMore: {}
};

/* =========================
   GET YEAR JSON
========================= */
const getYearJSON = (yearSlug) => {
  switch (yearSlug) {
    case "first-year": return yearFirst;
    case "second-year": return yearSecond;
    case "third-year": return yearThird;
    case "fourth-year": return yearFourth;
    default: return null;
  }
};

/* =========================
   NORMALIZER (PYQ MATCHING)
========================= */
const normalize = (str) =>
  String(str || "").toLowerCase().replace(/[^a-z0-9]/g, "");

/* =========================
   FETCH BRANCHES
========================= */
export const fetchBranches = (yearSlug) => {
  if (yearSlug === "first-year") return ["COMMON"];

  const data = getYearJSON(yearSlug);
  return data ? Object.keys(data).map((b) => b.toUpperCase()) : [];
};

/* =========================
   LOAD NOTES (BASE DATA)
========================= */
export const loadNotes = (yearSlug, branch, semester) => {
  const key = `${yearSlug}-${branch}-${semester}`;
  if (cache.notes[key]) return cache.notes[key];

  const data = getYearJSON(yearSlug);
  if (!data) return [];

  const subjects =
    yearSlug === "first-year"
      ? data.COMMON?.[semester] || []
      : data[branch]?.[semester] || [];

  cache.notes[key] = subjects;
  return subjects;
};

/* =========================
   FETCH PYQs (BACKEND)
========================= */
export const fetchPYQFromBackend = async (branch, semester, subjects) => {
  const key = `${branch}-${semester}`;
  if (cache.pyq[key]) return cache.pyq[key];

  try {
    const res = await fetch(`${BACKEND_BASE}/api/pyq/${branch}/${semester}`);
    if (!res.ok) return [];

    const files = await res.json();
    if (!Array.isArray(files)) return [];

    const groups = subjects.map((s) => ({
      subjectName: s.subjectName,
      subjectCode: s.subjectCode,
      pyqs: []
    }));

    files.forEach((file) => {
      const clean = normalize(file.title);

      groups.forEach((g) => {
        if (
          clean.includes(normalize(g.subjectName)) ||
          clean.includes(normalize(g.subjectCode))
        ) {
          const year = file.title.match(/\d{4}/)?.[0] || "Unknown";
          g.pyqs.push({
            title: `${year} Paper`,
            pdf: `${BACKEND_BASE}${file.pdf}`
          });
        }
      });
    });

    const final = groups.filter((g) => g.pyqs.length > 0);
    cache.pyq[key] = final;
    return final;

  } catch (err) {
    console.error("PYQ fetch failed", err);
    return [];
  }
};

/* =========================
   LOAD LABS (FIRST YEAR ONLY)
========================= */
export const loadLabs = (yearSlug, branch, semester) => {
  const key = `${yearSlug}-${branch}-${semester}`;
  if (cache.lab[key]) return cache.lab[key];

  if (yearSlug !== "first-year") return [];

  const subjects = yearFirstLab.COMMON?.[semester] || [];
  cache.lab[key] = subjects;
  return subjects;
};

/* =========================
   LOAD EXTRA MORE (NO SUBJECT)
========================= */
export const loadExtraMore = (yearSlug) => {
  if (cache.extraMore[yearSlug]) return cache.extraMore[yearSlug];

  const data = getYearJSON(yearSlug);
  if (!data) return [];

  // Only COMMON has Extra
  const extra =
    data.COMMON?.Extra?.[0]?.More && Array.isArray(data.COMMON.Extra[0].More)
      ? data.COMMON.Extra[0].More
      : [];

  cache.extraMore[yearSlug] = extra;
  return extra;
};

/* =========================
   DEFAULT EXPORT
========================= */
export default {
  fetchBranches,
  loadNotes,
  fetchPYQFromBackend,
  loadLabs,
  loadExtraMore
};
