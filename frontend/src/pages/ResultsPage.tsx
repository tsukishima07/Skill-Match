import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";
import { AnalysisResult } from "../types";
import { getGlobalResult } from "../App";

export default function ResultsPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const r = getGlobalResult();
    if (!r) {
      navigate("/upload");
      return;
    }
    setResult(r);
  }, [navigate]);

  if (!result) return null;

  const {
    matchPercentage,
    matchedSkills,
    missingSkills,
    suggestions,
    jobRole = "Analysis Result",
  } = result;

  const pieData = [
    { name: "Matched", value: matchedSkills.length, color: "#22c55e" },
    { name: "Missing", value: missingSkills.length, color: "#ef4444" },
  ];

  return (
    <div style={s.page}>
      <Navbar />

      <main style={s.main}>
        <button onClick={() => navigate("/")} style={s.back}>
          ← Back to Dashboard
        </button>

        <h1 style={s.title}>{jobRole}</h1>

        {/* TOP */}
        <div style={s.top}>
          {/* CHART */}
          <div style={s.chartBox}>
            <div style={{ width: 220, height: 220, margin: "auto", position: "relative" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={70}
                    outerRadius={100}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div style={s.scoreText}>{matchPercentage}%</div>
              <div style={s.scoreSub}>Overall Match</div>
            </div>
          </div>

          {/* MATCHED */}
          <div style={s.skillCard}>
            <h3 style={{ color: "#22c55e" }}>
              ✔ Matched Skills ({matchedSkills.length})
            </h3>

            <div style={s.scrollBox}>
              <div style={s.pills}>
                {matchedSkills.map((skill, i) => (
                  <span key={i} style={s.greenPill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* MISSING */}
          <div style={s.skillCard}>
            <h3 style={{ color: "#ef4444" }}>
              ✖ Missing Skills ({missingSkills.length})
            </h3>

            <div style={s.scrollBox}>
              <div style={s.pills}>
                {missingSkills.map((skill, i) => (
                  <span key={i} style={s.redPill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUGGESTIONS */}
        <div style={s.suggestBox}>
          <h2 style={s.suggestTitle}>💡 Suggestions</h2>

          {suggestions.map((sug, i) => (
            <div key={i} style={s.suggestCard}>
              <p style={s.suggestText}>{sug}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
  },

  main: {
    maxWidth: 1100,
    margin: "auto",
    padding: 30,
  },

  back: {
    marginBottom: 10,
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "#3b82f6",
  },

  title: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 20,
    color: "#fff",
  },

  top: {
    display: "grid",
    gridTemplateColumns: "260px 1fr 1fr",
    gap: 20,
    alignItems: "start",
  },

  chartBox: {
    background: "#1e293b",
    padding: 30,
    borderRadius: 16,
    textAlign: "center",
    position: "relative",
  },

  scoreText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -60%)",
    fontSize: 32,
    fontWeight: 700,
    color: "#fff",
  },

  scoreSub: {
    position: "absolute",
    top: "65%",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 14,
    color: "#94a3b8",
  },

  skillCard: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 12,
    color: "#fff",
  },

  
  scrollBox: {
    maxHeight: 220,
    overflowY: "auto",
    marginTop: 10,
    paddingRight: 5,
  },

  pills: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },

  greenPill: {
    background: "#22c55e33",
    color: "#22c55e",
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 12,
  },

  redPill: {
    background: "#ef444433",
    color: "#ef4444",
    padding: "6px 12px",
    borderRadius: 20,
    fontSize: 12,
  },

  suggestBox: {
    marginTop: 30,
  },

  suggestTitle: {
    color: "#fff",
  },

  suggestCard: {
    background: "#1e293b",
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
  },

  suggestText: {
    color: "#cbd5f5",
    fontSize: 14,
  },
};