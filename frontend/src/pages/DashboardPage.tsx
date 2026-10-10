import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { setGlobalResult } from "../App";

type HistoryItem = {
  role: string;
  score: number;
  date: string;
  data: any;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history
  useEffect(() => {
    if (!user) return;

    const stored = localStorage.getItem(`history_${user.email}`);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, [user]);

  // Open result
  const openResult = (item: HistoryItem) => {
    setGlobalResult(item.data);
    navigate("/results");
  };

  // Delete
  const deleteItem = (index: number) => {
    if (!user) return;

    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);

    localStorage.setItem(
      `history_${user.email}`,
      JSON.stringify(updated)
    );
  };

  return (
    <div style={s.page}>
      <Navbar />

      <main style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Dashboard</h1>
            <p style={s.subtitle}>Your previous comparisons</p>
          </div>

          <button
            onClick={() => navigate("/upload")}
            style={s.newBtn}
          >
            + New Comparison
          </button>
        </div>

        {/* History */}
        <div style={s.grid}>
          {history.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>
              No history yet. Start a new comparison.
            </p>
          ) : (
            history.map((item, i) => (
              <div
                key={i}
                style={s.card}
                onClick={() => openResult(item)}
              >
                {/* 🗑️ DELETE BUTTON (BOTTOM RIGHT) */}
                <button
                  style={s.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(i);
                  }}
                >
                  🗑️
                </button>

                <div style={s.cardTop}>
                  <h3 style={s.role}>{item.role}</h3>
                  <span style={s.score}>{item.score}%</span>
                </div>

                <div style={s.date}>📅 {item.date}</div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #0f172a)",
    color: "#fff",
  },

  main: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "40px 20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: 700,
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
  },

  newBtn: {
    background: "linear-gradient(90deg, #3b82f6, #6366f1)",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },

  card: {
    position: "relative",
    background: "linear-gradient(135deg, #1e293b, #0f172a)",
    borderRadius: 14,
    padding: 20,
    cursor: "pointer",
    transition: "0.2s",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  role: {
    fontSize: 16,
    fontWeight: 600,
  },

  score: {
    background: "#ef4444",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },

  date: {
    fontSize: 13,
    color: "#94a3b8",
  },

 
  deleteBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,        
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    color: "#ef4444",
    borderRadius: "50%",
    width: 32,
    height: 32,
    cursor: "pointer",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.2s",
  },
};