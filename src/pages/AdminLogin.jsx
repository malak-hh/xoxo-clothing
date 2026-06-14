import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!password.trim()) return setError("Veuillez entrer le mot de passe.");

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin");
      } else {
        setError(data.error || "Accès refusé.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <img src="/logo.png" alt="XOXO" style={logo} />
        <h2 style={title}>Admin Panel</h2>
        <p style={subtitle}>Accès réservé</p>

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => { setError(""); setPassword(e.target.value); }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={input}
          autoComplete="new-password"
        />

        {error && <div style={errorBox}>⚠️ {error}</div>}

        <button
          style={{ ...btn, opacity: loading ? 0.6 : 1 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Vérification..." : "Se connecter"}
        </button>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */
const page = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f4f4f4",
};
const card = {
  background: "#fff",
  padding: "50px 40px",
  borderRadius: "20px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "380px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};
const logo = {
  width: "70px",
  borderRadius: "50%",
  margin: "0 auto",
};
const title = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#000",
  margin: 0,
};
const subtitle = {
  color: "#888",
  fontSize: "14px",
  margin: 0,
};
const input = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "15px",
  outline: "none",
  textAlign: "center",
  letterSpacing: "4px",
};
const errorBox = {
  padding: "10px",
  background: "#fff0f3",
  border: "1px solid #e91e63",
  borderRadius: "8px",
  color: "#c0003c",
  fontSize: "14px",
};
const btn = {
  padding: "14px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "30px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
  transition: "background 0.3s",
};

export default AdminLogin;
