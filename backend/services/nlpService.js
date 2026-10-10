const natural = require("natural");
const { ALL_SKILLS, SKILLS_SET } = require("../utils/skills");

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

/* ---------------- STOPWORDS ---------------- */
const STOPWORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with","by","from",
  "up","about","into","through","during","is","are","was","were","be","been","being",
  "have","has","had","do","does","did","will","would","could","should","may","might",
  "shall","can","need","dare","ought","used","it","its","this","that","these","those",
  "i","me","my","myself","we","our","ours","ourselves","you","your","yours","he","him",
  "his","she","her","hers","they","them","their","theirs","what","which","who","whom",
  "when","where","why","how","all","both","each","few","more","most","other","some",
  "such","no","nor","not","only","own","same","so","than","too","very","s","t","just",
  "don","now","d","ll","m","o","re","ve","y","ain","aren","couldn","didn","doesn",
  "hadn","hasn","haven","isn","ma","mightn","mustn","needn","shan","shouldn","wasn",
  "weren","won","wouldn","also","well","like","use","using","used","work","years",
  "year","experience","strong","good","excellent","ability","skills","skill",
  "knowledge","understanding","proficiency","familiar","comfortable","working",
]);

/* ---------------- PREPROCESS ---------------- */
function preprocessText(text) {
  if (!text || typeof text !== "string") return [];

  const cleaned = text.toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, " ")
    .replace(/[^a-z0-9\s.#+\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = tokenizer.tokenize(cleaned) || [];
  return tokens.filter(t => t.length > 1 && !STOPWORDS.has(t));
}

/* ---------------- SKILL EXTRACTION ---------------- */
function extractSkills(text) {
  if (!text) return [];

  const lower = text.toLowerCase();
  const found = new Set();

  
  const multiWordSkills = ALL_SKILLS.filter(s =>
    s.includes(" ") || s.includes(".") || s.includes("-") || s.includes("/")
  );

  for (const skill of multiWordSkills) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "i");
    if (regex.test(lower)) found.add(skill);
  }

  const tokens = preprocessText(text);

  for (const token of tokens) {
    if (SKILLS_SET.has(token)) found.add(token);

    const stem = stemmer.stem(token);
    for (const skill of ALL_SKILLS) {
      if (!skill.includes(" ")) {
        if (stemmer.stem(skill) === stem) {
          found.add(skill);
        }
      }
    }
  }

  return [...found];
}

/* ----------------  ADVANCED JOB ROLE EXTRACTION ---------------- */
function extractJobRole(text) {
  if (!text) return "Unknown Role";

  const lower = text.toLowerCase();

  //  Strong patterns
  const rolePatterns = [
    /(frontend|front end)\s+(developer|engineer)/,
    /(backend|back end)\s+(developer|engineer)/,
    /(full\s?stack)\s+(developer|engineer)/,
    /(data scientist)/,
    /(data analyst)/,
    /(machine learning engineer|ml engineer)/,
    /(ai engineer)/,
    /(devops engineer)/,
    /(software engineer|software developer)/,
    /(android developer)/,
    /(ios developer)/,
  ];

  for (const pattern of rolePatterns) {
    const match = lower.match(pattern);
    if (match) return capitalize(match[0]);
  }

  //  Title-based extraction (very powerful for PDFs)
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  for (const line of lines.slice(0, 10)) {
    if (
      line.length < 80 &&
      /(developer|engineer|scientist|analyst)/i.test(line)
    ) {
      return capitalize(line);
    }
  }

  //  Skill-based guessing (fallback AI logic)
  const skills = extractSkills(text);

  if (skills.includes("react") || skills.includes("javascript"))
    return "Frontend Developer";

  if (skills.includes("node") || skills.includes("express"))
    return "Backend Developer";

  if (skills.includes("python") && skills.includes("machine learning"))
    return "Machine Learning Engineer";

  if (skills.includes("python") && skills.includes("pandas"))
    return "Data Scientist";

  if (skills.includes("docker") || skills.includes("kubernetes"))
    return "DevOps Engineer";

  return "Software Engineer"; //  final fallback (never unknown)
}

function capitalize(str) {
  return str
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ---------------- TF-IDF ---------------- */
function buildTFIDFVectors(text1, text2) {
  const tfidf = new natural.TfIdf();

  tfidf.addDocument(preprocessText(text1).join(" "));
  tfidf.addDocument(preprocessText(text2).join(" "));

  const terms = new Set([
    ...preprocessText(text1),
    ...preprocessText(text2)
  ]);

  const vec1 = [];
  const vec2 = [];

  for (const term of terms) {
    vec1.push(tfidf.tfidf(term, 0));
    vec2.push(tfidf.tfidf(term, 1));
  }

  return { vec1, vec2 };
}

/* ---------------- COSINE ---------------- */
function cosineSimilarity(vec1, vec2) {
  let dot = 0, mag1 = 0, mag2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dot += vec1[i] * vec2[i];
    mag1 += vec1[i] ** 2;
    mag2 += vec2[i] ** 2;
  }

  const denom = Math.sqrt(mag1) * Math.sqrt(mag2);
  return denom === 0 ? 0 : dot / denom;
}

/* ---------------- SUGGESTIONS ---------------- */
function generateSuggestions(missingSkills, matchedSkills) {
  const suggestions = [];

  if (missingSkills.length === 0) {
    suggestions.push(" Excellent! Your resume matches very well.");
    return suggestions;
  }

  suggestions.push(` Learn: ${missingSkills.slice(0,3).join(", ")}`);

  suggestions.push(" Improve resume with JD keywords");

  if (matchedSkills.length > 5) {
    suggestions.push(" Highlight your strengths with projects");
  }

  return suggestions;
}

/* ---------------- MAIN ---------------- */
function analyzeMatch(resumeText, jdText) {
  if (!resumeText || !jdText) {
    throw new Error("Both resume text and job description text are required.");
  }

  const resumeSkills = extractSkills(resumeText);
  const jdSkills = extractSkills(jdText);

  const resumeSet = new Set(resumeSkills);

  const matchedSkills = jdSkills.filter(s => resumeSet.has(s));
  const missingSkills = jdSkills.filter(s => !resumeSet.has(s));

  const { vec1, vec2 } = buildTFIDFVectors(resumeText, jdText);
  const textSimilarity = cosineSimilarity(vec1, vec2);

  const skillMatchPct = jdSkills.length
    ? (matchedSkills.length / jdSkills.length) * 100
    : 0;

  const finalScore = Math.round(skillMatchPct * 0.7 + textSimilarity * 100 * 0.3);

  return {
    matchPercentage: Math.min(100, Math.max(0, finalScore)),
    matchedSkills: matchedSkills.map(s => s.toLowerCase()),
    missingSkills: missingSkills.map(s => s.toLowerCase()),
    resumeSkills: resumeSkills.map(s => s.toLowerCase()),
    jdSkills: jdSkills.map(s => s.toLowerCase()),
    textSimilarity: Math.round(textSimilarity * 100),
    suggestions: generateSuggestions(missingSkills, matchedSkills),
    jobRole: extractJobRole(jdText), //  ALWAYS RETURNS VALUE
  };
}

module.exports = {
  analyzeMatch,
  extractSkills,
  preprocessText,
  extractJobRole,
};