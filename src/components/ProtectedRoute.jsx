import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/verify`, {
      headers: { "x-admin-token": token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setAllowed(true);
        } else {
          localStorage.removeItem("adminToken");
          navigate("/admin-login");
        }
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
      })
      .finally(() => setChecking(false));
  }, [navigate]);

  if (checking) return <p style={{ textAlign: "center", padding: "60px" }}>Vérification...</p>;
  if (!allowed) return null;
  return children;
}

export default ProtectedRoute;
