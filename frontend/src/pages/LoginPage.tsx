import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login, signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");

    if (!email || !password || (isSignup && !name)) {
      setError("Please fill all fields");
      return;
    }

    if (isSignup) {
      const success = signup(name, email, password);
      if (!success) {
        setError("User already exists");
        return;
      }
      alert("Account created! Please login.");
      setIsSignup(false);
    } else {
      const success = login(email, password);
      if (!success) {
        setError("Invalid credentials");
        return;
      }
      navigate("/");
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>SkillMatch</h1>
        <p style={s.subtitle}>
          {isSignup ? "Create your account" : "Welcome Back"}
        </p>

        {isSignup && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={s.input}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={s.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={s.input}
        />

        {error && <p style={s.error}>{error}</p>}

        <button onClick={handleSubmit} style={s.button}>
          {isSignup ? "Sign Up" : "Sign In"}
        </button>

        {/* GOOGLE LOGIN */}
        <button
          onClick={async () => {
            const success = await googleLogin();
            if (success) navigate("/");
            else setError("Google login failed");
          }}
          style={{
            ...s.button,
            background: "#db4437",
            marginTop: 10,
          }}
        >
          Continue with Google
        </button>

        <p style={s.switch}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)} style={s.link}>
            {isSignup ? " Login" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  card: {
    background: "#1e293b",
    padding: 30,
    borderRadius: 12,
    width: 350,
    color: "#fff",
  },
  title: { fontSize: 28, textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: 20 },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "none",
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  switch: { marginTop: 10, textAlign: "center" },
  link: { color: "#60a5fa", cursor: "pointer", marginLeft: 5 },
  error: { color: "red", fontSize: 12 },
};