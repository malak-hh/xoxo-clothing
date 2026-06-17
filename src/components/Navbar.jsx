import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar({ cartCount, searchTerm, setSearchTerm }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const categories = ["set", "pantalon", "robe", "pull", "veste"];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav style={navStyle(isMobile)}>
        {/* LOGO */}
        <div style={brandContainer}>
          <Link to="/">
            <img src="/logo.png" alt="XOXO" style={logoImg} />
          </Link>
        </div>

        {/* CATEGORY LINKS — desktop only */}
        {!isMobile && (
          <ul style={categoriesMenu}>
            {categories.map((item) => (
              <li key={item} style={navItem}>
                <Link
                  to={`/category/${item}`}
                  style={navLink}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#d81b60";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "#000";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  {item.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* SEARCH + CART + HAMBURGER */}
        <div style={actionsGroup}>
          <div
            style={searchBox}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.border = "1px solid #000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f5f5f5";
              e.currentTarget.style.border = "1px solid transparent";
            }}
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchField(isMobile)}
            />
            <span>🔍</span>
          </div>

          <div
            style={cartIconContainer}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Link to="/cart">🛒</Link>
            {cartCount > 0 && <span style={cartBadge}>{cartCount}</span>}
          </div>

          {/* HAMBURGER — mobile only */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={hamburgerBtn}
              aria-label="Menu"
            >
              <span style={bar}></span>
              <span style={bar}></span>
              <span style={bar}></span>
            </button>
          )}
        </div>
      </nav>

      {/* MOBILE OVERLAY MENU */}
      {isMobile && menuOpen && (
        <>
          <div style={backdrop} onClick={() => setMenuOpen(false)} />

          {/* Menu panel */}
          <div style={overlayMenu}>
            <div style={overlayHeader}>
              <span style={overlayTitle}>MENU</span>
              <button style={closeBtn} onClick={() => setMenuOpen(false)}>✕</button>
            </div>
            {categories.map((item) => (
              <Link
                key={item}
                to={`/category/${item}`}
                style={mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                {item.toUpperCase()}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* ===== STYLES ===== */
const navStyle = (isMobile) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: isMobile ? "0 16px" : "0 50px",
  height: "80px",
  position: "sticky",
  top: 0,
  zIndex: 2000,
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(14px)",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
});

const brandContainer = { display: "flex", alignItems: "center" };

const logoImg = {
  height: "55px",
  borderRadius: "50%",
  transition: "0.3s",
};

const categoriesMenu = {
  display: "flex",
  listStyle: "none",
  gap: "25px",
  margin: 0,
  padding: 0,
};

const navItem = { fontWeight: "600", fontSize: "13px" };

const navLink = {
  textDecoration: "none",
  color: "#000",
  transition: "0.2s",
};

const actionsGroup = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const searchBox = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#f5f5f5",
  padding: "8px 14px",
  borderRadius: "30px",
  transition: "0.3s",
  border: "1px solid transparent",
};

const searchField = (isMobile) => ({
  border: "none",
  outline: "none",
  background: "transparent",
  width: isMobile ? "80px" : "150px",
  color: "#000",
});

const cartIconContainer = {
  position: "relative",
  cursor: "pointer",
  transition: "0.2s",
  fontSize: "22px",
};

const cartBadge = {
  position: "absolute",
  top: "-8px",
  right: "-10px",
  backgroundColor: "#d81b60",
  color: "#fff",
  fontSize: "10px",
  padding: "3px 6px",
  borderRadius: "50%",
};

const hamburgerBtn = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: "5px",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px",
};

const bar = {
  display: "block",
  width: "24px",
  height: "2px",
  background: "#000",
  borderRadius: "2px",
};

const backdrop = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  zIndex: 2001,
};

const overlayMenu = {
  position: "fixed",
  top: "80px",
  left: 0,
  width: "100%",
  background: "#fff",
  zIndex: 2002,
  display: "flex",
  flexDirection: "column",
  padding: "0 20px 20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
};

const overlayHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 0 12px",
  borderBottom: "1px solid #eee",
  marginBottom: "8px",
};

const overlayTitle = {
  fontWeight: "700",
  fontSize: "13px",
  letterSpacing: "2px",
  color: "#999",
};

const closeBtn = {
  background: "none",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  color: "#000",
  padding: "4px",
};

const mobileLink = {
  textDecoration: "none",
  color: "#000",
  fontWeight: "600",
  fontSize: "16px",
  padding: "14px 0",
  borderBottom: "1px solid #f0f0f0",
  letterSpacing: "1px",
};

export default Navbar;


