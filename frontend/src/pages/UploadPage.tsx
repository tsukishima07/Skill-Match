import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Dropzone from "../components/Dropzone";
import { analyze } from "../utils/api";
import { setGlobalResult } from "../App";
import { useAuth } from "../hooks/useAuth";

type JDMode = "file" | "text";

export default function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [resume, setResume] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [jdMode, setJdMode] = useState<JDMode>("file");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid =
    resume &&
    (jdMode === "file" ? jdFile !== null : jobRole.trim().length > 0);

  const handleSubmit = async () => {
    if (!resume) return setError("Upload resume");
    if (jdMode === "file" && !jdFile)
      return setError("Upload job description");
    if (jdMode === "text" && !jobRole)
      return setError("Enter job role");

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", resume);

      if (jdMode === "file" && jdFile) {
        formData.append("jd", jdFile);
      } else {
        formData.append("jobRole", jobRole);
      }

      const result = await analyze(formData);

      setGlobalResult(result);

      
      if (user) {
        const key = `history_${user.email}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");

        const newItem = {
          role: result.jobRole || jobRole || "Unknown Role",
          score: result.matchPercentage,
          date: new Date().toLocaleDateString(),
          data: result,
        };

        localStorage.setItem(key, JSON.stringify([newItem, ...existing]));
      }

      navigate("/results");
    } catch (e: any) {
      setError(e.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <Navbar />

      <main style={s.main}>
        <h1 style={s.title}>New Comparison</h1>

        {/* Resume */}
        <div style={s.card}>
          <h2 style={s.step}>1 Upload Resume</h2>
          <Dropzone
            label="Upload Resume (PDF/DOCX)"
            file={resume}
            onFile={setResume}
            onRemove={() => setResume(null)}
          />
        </div>

        {/* JD */}
        <div style={s.card}>
          <h2 style={s.step}>2 Provide Job Description</h2>

          <div style={s.toggle}>
            <button
              onClick={() => setJdMode("file")}
              style={{
                ...s.toggleBtn,
                background: jdMode === "file" ? "#3b82f6" : "#1e293b",
              }}
            >
              Upload PDF
            </button>

            <button
              onClick={() => setJdMode("text")}
              style={{
                ...s.toggleBtn,
                background: jdMode === "text" ? "#3b82f6" : "#1e293b",
              }}
            >
              Enter Job Role
            </button>
          </div>

          {jdMode === "file" ? (
            <Dropzone
              label="Upload Job Description"
              file={jdFile}
              onFile={setJdFile}
              onRemove={() => setJdFile(null)}
            />
          ) : (
            <input
              type="text"
              placeholder="e.g. Data Scientist"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              style={s.input}
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          style={s.button}
        >
          {loading ? "Analyzing..." : "Analyze & Compare"}
        </button>

        {error && <p style={s.error}>{error}</p>}
      </main>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
  },

  main: {
    maxWidth: 700,
    margin: "auto",
    padding: 40,
  },

  title: {
    textAlign: "center",
    color: "#fff",
    marginBottom: 30,
  },

  card: {
    background: "rgba(30,41,59,0.7)",
    backdropFilter: "blur(10px)",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    color: "#fff",
  },

  step: {
    marginBottom: 10,
  },

  toggle: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
  },

  toggleBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    color: "#fff",
  },

  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "none",
  },

  button: {
    width: "100%",
    padding: 14,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    cursor: "pointer",
  },

  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
};