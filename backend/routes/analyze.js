const express = require("express");
const multer = require("multer");
const { extractTextFromBuffer } = require("../services/fileService");
const { analyzeMatch } = require("../services/nlpService");
const { fetchJobDescription } = require("../services/jobApiService");

const router = express.Router();

/* ================= MULTER ================= */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ];
  const allowedExt = [".pdf", ".doc", ".docx", ".txt"];
  const ext = require("path").extname(file.originalname || "").toLowerCase();

  if (allowed.includes(file.mimetype) || allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, DOCX, and TXT are allowed."), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

const uploadFields = upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "jd", maxCount: 1 },
]);

/* ================= ROLE EXTRACTION ================= */

function extractJobRoleFromText(text) {
  if (!text) return "Unknown Role";

  const lower = text.toLowerCase();

  
  const firstLines = text.split("\n").slice(0, 10).join(" ").toLowerCase();

  const rolePatterns = [
    /(\b\w+\s?(engineer|developer|scientist|analyst|manager|architect)\b)/gi,
    /(frontend|backend|full stack|data|ml|ai|devops|software)\s+(engineer|developer)/gi,
    /(data scientist|machine learning engineer|ai engineer|devops engineer|software engineer)/gi,
  ];

  for (const pattern of rolePatterns) {
    const match = firstLines.match(pattern);
    if (match && match[0]) {
      return capitalize(match[0]);
    }
  }

  
  const roleKeywords = {
    "Data Scientist": ["machine learning", "statistics", "pandas", "numpy", "model"],
    "Machine Learning Engineer": ["ml", "tensorflow", "pytorch", "deep learning"],
    "Frontend Developer": ["react", "html", "css", "frontend", "ui"],
    "Backend Developer": ["node", "api", "backend", "server", "express"],
    "Full Stack Developer": ["frontend", "backend", "full stack"],
    "DevOps Engineer": ["docker", "kubernetes", "ci/cd", "devops"],
    "Software Engineer": ["algorithms", "data structures", "system design"],
  };

  let bestMatch = "Unknown Role";
  let maxScore = 0;

  for (const [role, keywords] of Object.entries(roleKeywords)) {
    let score = 0;

    for (const keyword of keywords) {
      if (lower.includes(keyword)) score++;
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = role;
    }
  }

  return bestMatch;
}

/* helper */
function capitalize(str) {
  return str
    .split(" ")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ================= ROUTE ================= */

router.post("/analyze", (req, res, next) => {
  uploadFields(req, res, async (err) => {
    if (err) return next(err);

    try {
      const resumeFile = req.files?.resume?.[0];
      if (!resumeFile) {
        return res.status(400).json({ error: "Resume file is required." });
      }

      // Extract resume
      let resumeText = await extractTextFromBuffer(
        resumeFile.buffer,
        resumeFile.mimetype,
        resumeFile.originalname
      );

      if (!resumeText || resumeText.length < 50) {
        return res.status(400).json({ error: "Resume too short." });
      }

      const jdFile = req.files?.jd?.[0];
      const jobRoleInput = req.body?.jobRole?.trim();

      let jdText = "";
      let jdSource = "file";
      let finalJobRole = "Unknown Role";

      if (jdFile) {
        
        jdText = await extractTextFromBuffer(
          jdFile.buffer,
          jdFile.mimetype,
          jdFile.originalname
        );

        finalJobRole = extractJobRoleFromText(jdText);
      } else if (jobRoleInput) {
        
        const result = await fetchJobDescription(jobRoleInput);
        jdText = result.text;
        jdSource = result.source;
        finalJobRole = jobRoleInput;
      } else {
        return res.status(400).json({
          error: "Upload JD or provide job role",
        });
      }

      if (!jdText || jdText.length < 30) {
        return res.status(400).json({
          error: "JD too short",
        });
      }

      const result = analyzeMatch(resumeText, jdText);

      res.json({
        success: true,
        jdSource,
        jobRole: finalJobRole, 
        ...result,
      });

    } catch (err) {
      console.error("Analysis error:", err);
      next(err);
    }
  });
});

/* ================= TEXT ROUTE ================= */

router.post("/analyze/text", express.json(), async (req, res, next) => {
  try {
    const { resumeText, jdText, jobRole } = req.body;

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ error: "resumeText required" });
    }

    let finalJdText = jdText;
    let finalRole = jobRole || "Unknown Role";

    if (!finalJdText && jobRole) {
      const result = await fetchJobDescription(jobRole);
      finalJdText = result.text;
      finalRole = jobRole;
    }

    if (!finalJdText) {
      return res.status(400).json({ error: "jdText or jobRole required" });
    }

    if (!jobRole) {
      finalRole = extractJobRoleFromText(finalJdText);
    }

    const result = analyzeMatch(resumeText, finalJdText);

    res.json({
      success: true,
      jobRole: finalRole,
      ...result,
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;