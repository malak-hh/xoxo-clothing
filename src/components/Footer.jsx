import React, { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [showContact, setShowContact] = useState(false);
  const [formData, setFormData] = useState({ nom: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleContactSubmit = () => {
    if (!formData.nom.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    setSent(true);
    setTimeout(() => {
      setShowContact(false);
      setSent(false);
      setFormData({ nom: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <>
      {/* CONTACT MODAL */}
      {showContact && (
        <div style={overlay}>
          <div style={modal}>
            <button style={closeBtn} onClick={() => setShowContact(false)}>✕</button>
            {sent ? (
              <div style={{ textAlign: "center", padding: "30px" }}>
                <div style={{ fontSize: "50px" }}>✅</div>
                <h3>Message envoyé !</h3>
                <p>Nous vous répondrons bientôt.</p>
              </div>
            ) : (
              <>
                <h3 style={{ marginBottom: "20px" }}>Contactez-nous</h3>
                <input
                  placeholder="Votre nom"
                  style={modalInput}
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
                <input
                  placeholder="Votre email"
                  style={modalInput}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <textarea
                  placeholder="Votre message"
                  rows={4}
                  style={{ ...modalInput, resize: "vertical" }}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <button style={sendBtn} onClick={handleContactSubmit}>
                  Envoyer
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <footer style={footer}>
        <div style={container}>

          {/* BRAND */}
          <div style={column}>
            <h3 style={{ marginBottom: "10px" }}>XOXO</h3>
            <p style={text}>Trendy fashion for every mood. Stay bold, stay confident.</p>
          </div>

          {/* SHOP */}
          <div style={column}>
            <h4>Shop</h4>
            <ul style={list}>
              <li><Link style={link} to="/category/set">Sets</Link></li>
              <li><Link style={link} to="/category/pantalon">Pantalons</Link></li>
              <li><Link style={link} to="/category/robe">Robes</Link></li>
              <li><Link style={link} to="/category/pull">Pulls</Link></li>
              <li><Link style={link} to="/category/veste">Vestes</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div style={column}>
            <h4>Help</h4>
            <ul style={list}>
              {["Contact Us", "Shipping", "Returns", "FAQ"].map((label) => (
                <li key={label}>
                  <button style={helpBtn} onClick={() => setShowContact(true)}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT + INSTAGRAM */}
          <div style={column}>
            <h4>Contact</h4>
            <p style={text}>📧 xoxo@email.com</p>
            <p style={text}>📞 +216 00 000 000</p>
            <p style={text}>📍 Tunisia</p>

            <div style={{ marginTop: "15px" }}>
              <h4>Follow us</h4>
              <a
                href="https://www.instagram.com/xoxoclothing.tn/"
                target="_blank"
                rel="noreferrer"
                style={instaLink}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E1306C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ verticalAlign: "middle", marginRight: "6px" }}
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="#E1306C" stroke="none" />
                </svg>
                Instagram
              </a>
            </div>
          </div>

        </div>

        <div style={bottom}>
          <p>© 2026 XOXO. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

/* ===== STYLES ===== */
const footer = { backgroundColor: "#111", color: "#fff", marginTop: "50px", paddingTop: "40px" };
const container = { width: "90%", margin: "auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "30px", paddingBottom: "30px" };
const column = {};
const text = { color: "#ccc", fontSize: "14px" };
const list = { listStyle: "none", padding: 0, margin: 0 };
const link = { textDecoration: "none", color: "#ccc", fontSize: "14px", display: "block", marginBottom: "6px" };
const helpBtn = { background: "none", border: "none", color: "#ccc", fontSize: "14px", cursor: "pointer", padding: 0, marginBottom: "6px", textAlign: "left", textDecoration: "underline" };
const instaLink = { display: "inline-flex", alignItems: "center", marginTop: "5px", color: "#E1306C", textDecoration: "none", fontWeight: "bold" };
const bottom = { borderTop: "1px solid #333", textAlign: "center", padding: "15px 0", fontSize: "13px", color: "#aaa" };
const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" };
const modal = { background: "#fff", borderRadius: "16px", padding: "40px", width: "90%", maxWidth: "420px", position: "relative", display: "flex", flexDirection: "column", gap: "12px" };
const closeBtn = { position: "absolute",color:"#000", top: "14px", right: "16px", background: "none", border: "none", fontSize: "18px", cursor: "pointer" };
const modalInput = { padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", width: "100%", boxSizing: "border-box" };
const sendBtn = { padding: "12px", background: "#000", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" };

export default Footer;
