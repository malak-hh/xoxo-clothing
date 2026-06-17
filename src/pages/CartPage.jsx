import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CartPage({ cart, removeFromCart, updateQty, clearCart }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", telephone: "", ville: "", adresse: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderRef, setOrderRef] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
  const delivery = cart.length > 0 ? 8 : 0;
  const total = subtotal + delivery;

  const handleCheckout = async () => {
    setError("");
    if (!form.nom.trim()) return setError("Veuillez entrer votre nom.");
    if (!/^\d{8,15}$/.test(form.telephone.trim())) return setError("Numéro de téléphone invalide.");
    if (!form.ville.trim()) return setError("Veuillez entrer votre ville.");
    if (!form.adresse.trim()) return setError("Veuillez entrer votre adresse.");

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item._id,
            quantity:  item.qty || 1,
            size:      item.selectedSize || "N/A",
          })),
          customer: form,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        setOrderRef(data.order.ref);
        setSuccess(true);
      } else {
        setError(data.error || "Erreur lors de la commande.");
      }
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={centerBox}>
        <div style={{ fontSize: "64px" }}>✅</div>
        <h2 style={{ color: "#000", marginBottom: "10px" }}>Commande confirmée !</h2>
        <p>Merci <strong>{form.nom}</strong> ! Nous vous contacterons au <strong>{form.telephone}</strong> très bientôt.</p>
        <div style={refBox}>
          <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Votre numéro de commande</p>
          <p style={{ margin: "4px 0 0", fontWeight: "bold", fontSize: "18px", color: "#d81b60" }}>{orderRef}</p>
        </div>
        <button style={backBtn} onClick={() => navigate("/")}>Continuer les achats</button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={centerBox}>
        <div style={{ fontSize: "64px" }}>🛒</div>
        <h2 style={{ color: "#000" }}>Votre panier est vide</h2>
        <button style={backBtn} onClick={() => navigate("/")}>Découvrir nos articles</button>
      </div>
    );
  }

  return (
    <div style={pageWrapper}>
      <div style={{ padding: isMobile ? "16px" : "20px", maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
        <h2 style={{ textAlign: "center", fontSize: isMobile ? "1.4rem" : "1.8rem", marginBottom: "24px", color: "#000" }}>Mon Panier</h2>

        <div style={cartLayout(isMobile)}>
          {/* ITEMS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", flex: isMobile ? "unset" : 2, minWidth: 0, width: "100%" }}>
            {cart.map((item) => (
              <div key={item._id + item.selectedSize} style={itemCard(isMobile)}>
                <img src={`${item.image?.startsWith("http") ? item.image : `${import.meta.env.VITE_API_URL}/${item.image}`}`} alt={item.name} style={itemImg(isMobile)} />

                <div style={itemInfo(isMobile)}>
                  <h3 style={{ margin: "0 0 4px", color: "#000", fontSize: isMobile ? "14px" : "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</h3>
                  {item.selectedSize && (
                    <p style={{ margin: "0 0 4px", color: "#888", fontSize: "12px" }}>Taille: <strong>{item.selectedSize}</strong></p>
                  )}
                  <p style={{ margin: 0, color: "#e91e63", fontWeight: "bold", fontSize: "14px" }}>{item.price} DT</p>

                  {isMobile && (
                    <div style={mobileBottomRow}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button style={qtyBtn} onClick={() => updateQty(item._id, item.selectedSize, (item.qty || 1) - 1)}>−</button>
                        <span style={{ minWidth: "16px", textAlign: "center", fontWeight: "bold", fontSize: "14px" }}>{item.qty || 1}</span>
                        <button style={qtyBtn} onClick={() => updateQty(item._id, item.selectedSize, (item.qty || 1) + 1)}>+</button>
                      </div>
                      <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                        {item.price * (item.qty || 1)} DT
                      </span>
                    </div>
                  )}
                </div>

                {!isMobile && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <button style={qtyBtn} onClick={() => updateQty(item._id, item.selectedSize, (item.qty || 1) - 1)}>−</button>
                      <span style={{ minWidth: "16px", textAlign: "center", fontWeight: "bold", fontSize: "14px" }}>{item.qty || 1}</span>
                      <button style={qtyBtn} onClick={() => updateQty(item._id, item.selectedSize, (item.qty || 1) + 1)}>+</button>
                    </div>

                    <span style={{ fontWeight: "bold", minWidth: "60px", textAlign: "right", fontSize: "14px" }}>
                      {item.price * (item.qty || 1)} DT
                    </span>
                  </>
                )}

                <button style={removeBtn(isMobile)} onClick={() => removeFromCart(item._id, item.selectedSize)}>✕</button>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div style={summaryBox(isMobile)}>
            <h3 style={{ marginBottom: "16px", color: "#000" }}>Résumé</h3>
            <div style={summaryRow}><span>Sous-total</span><span>{subtotal} DT</span></div>
            <div style={summaryRow}><span>Livraison</span><span>{delivery} DT</span></div>
            <div style={{ ...summaryRow, fontWeight: "bold", fontSize: "18px", borderTop: "1px solid #eee", paddingTop: "12px", marginTop: "6px" }}>
              <span>Total</span><span style={{ color: "#e91e63" }}>{total} DT</span>
            </div>

            <h4 style={{ marginTop: "20px", marginBottom: "12px", color: "#000" }}>Vos informations</h4>
            {[
              { key: "nom", label: "Nom complet" },
              { key: "telephone", label: "Téléphone" },
              { key: "ville", label: "Ville" },
              { key: "adresse", label: "Adresse complète" },
            ].map(({ key, label }) => (
              <input
                key={key}
                placeholder={label}
                style={formInput}
                value={form[key]}
                onChange={(e) => { setError(""); setForm({ ...form, [key]: e.target.value }); }}
              />
            ))}

            {error && <div style={errorBox}>⚠️ {error}</div>}

            <button
              style={{ ...checkoutBtn, opacity: loading ? 0.6 : 1 }}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Envoi en cours..." : "COMMANDER MAINTENANT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== STYLES ===== */
const pageWrapper = {
  width: "100%",
  maxWidth: "100vw",
  overflowX: "hidden",
  boxSizing: "border-box",
};

const cartLayout = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  gap: isMobile ? "16px" : "30px",
  alignItems: "flex-start",
  width: "100%",
});

const itemCard = (isMobile) => ({
  display: "flex",
  alignItems: isMobile ? "flex-start" : "center",
  gap: "12px",
  background: "#fff",
  padding: "12px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
  width: "100%",
  boxSizing: "border-box",
  position: "relative",
});

const itemImg = (isMobile) => ({
  width: isMobile ? "60px" : "70px",
  height: isMobile ? "60px" : "70px",
  objectFit: "cover",
  borderRadius: "10px",
  flexShrink: 0,
});

const itemInfo = (isMobile) => ({
  flex: 1,
  minWidth: 0,
  paddingRight: isMobile ? "24px" : "0",
});

const mobileBottomRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "8px",
};

const qtyBtn = { width: "28px", height: "28px", borderRadius: "50%", border: "1px solid #000", background: "#000", color: "#fff", cursor: "pointer", fontSize: "15px", flexShrink: 0 };

const removeBtn = (isMobile) => ({
  background: "none",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  color: "#bbb",
  flexShrink: 0,
  position: isMobile ? "absolute" : "static",
  top: isMobile ? "12px" : "auto",
  right: isMobile ? "12px" : "auto",
});

const summaryBox = (isMobile) => ({
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
  width: "100%",
  flex: isMobile ? "unset" : 1,
  minWidth: isMobile ? "unset" : "280px",
  boxSizing: "border-box",
});

const summaryRow = { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "15px" };
const formInput = { display: "block", width: "100%", padding: "11px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "10px", fontSize: "14px", boxSizing: "border-box" };
const errorBox = { padding: "10px 14px", background: "#fff0f3", border: "1px solid #e91e63", borderRadius: "8px", color: "#c0003c", fontSize: "14px", marginBottom: "12px" };
const checkoutBtn = { width: "100%", padding: "14px", background: "#000", color: "#fff", border: "none", borderRadius: "30px", cursor: "pointer", fontWeight: "bold", fontSize: "15px" };
const centerBox = { textAlign: "center", padding: "60px 20px" };
const refBox = { margin: "20px auto", padding: "16px 24px", background: "#fff0f3", borderRadius: "12px", display: "inline-block" };
const backBtn = { marginTop: "20px", padding: "12px 30px", background: "#000", color: "#fff", border: "none", borderRadius: "30px", cursor: "pointer", fontSize: "15px" };

export default CartPage;


