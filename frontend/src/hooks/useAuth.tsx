import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";

type UserType = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: UserType | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  googleLogin: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  
  const login = (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const found = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!found) return false;

    const userData = { name: found.name, email: found.email };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return true;
  };

  
  const signup = (name: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const exists = users.find((u: any) => u.email === email);
    if (exists) return false;

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    return true;
  };

  
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const userData = {
        name: result.user.displayName || "Google User",
        email: result.user.email || "",
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return true;
    } catch (err: any) {
      console.error("Google Auth Error:", err);

      
      if (err.code === "auth/popup-closed-by-user") {
        alert("Popup closed before completing login");
      } else if (err.code === "auth/unauthorized-domain") {
        alert("Domain not authorized. Add localhost in Firebase.");
      } else if (err.code === "auth/operation-not-allowed") {
        alert("Google sign-in not enabled in Firebase.");
      } else {
        alert(err.message);
      }

      return false;
    }
  };

  
  const logout = async () => {
    try {
      await signOut(auth); // Firebase logout
    } catch (err) {
      console.error("Logout error:", err);
    }

    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}