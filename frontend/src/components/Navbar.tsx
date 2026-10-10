import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <button onClick={() => navigate("/")} style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>
            SkillMatch<span style={{ color: "var(--accent)" }}>AI</span>
          </span>
        </button>

        {/* Nav links */}
        <div style={styles.links}>
          <NavLink to="/" current={location.pathname} label="Dashboard" />
          <NavLink to="/upload" current={location.pathname} label="Analyze" />
        </div>

        {/* User menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            style={styles.avatar}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              {initials}
            </span>
          </button>

          {menuOpen && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownUser}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {user?.name ?? "User"}
                </div>
              </div>

              <div style={styles.dropdownDivider} />

              <button onClick={handleSignOut} style={styles.dropdownItem}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  to,
  current,
  label,
}: {
  to: string;
  current: string;
  label: string;
}) {
  const navigate = useNavigate();
  const active = current === to;

  return (
    <button
      onClick={() => navigate(to)}
      style={{
        ...styles.navLink,
        color: active ? "var(--text)" : "var(--text-muted)",
        background: active ? "var(--bg-elevated)" : "transparent",
      }}
    >
      {label}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(10,10,15,0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid var(--border)",
  },
  inner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 24px",
    height: 64,
    display: "flex",
    alignItems: "center",
    gap: 24,
  },
  logo: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginRight: "auto",
  },
  logoIcon: { fontSize: 20 },
  logoText: {
    fontWeight: 800,
    fontSize: 18,
    color: "var(--text)",
  },
  links: { display: "flex", gap: 4 },
  navLink: {
    border: "none",
    padding: "6px 14px",
    borderRadius: 8,
    fontSize: 14,
    cursor: "pointer",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "8px",
    minWidth: 200,
  },
  dropdownUser: { padding: "8px 12px 10px" },
  dropdownDivider: {
    height: 1,
    background: "var(--border)",
    margin: "4px 0",
  },
  dropdownItem: {
    width: "100%",
    padding: "9px 12px",
    background: "none",
    border: "none",
    color: "red",
    cursor: "pointer",
  },
};