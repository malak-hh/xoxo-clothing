import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductPage({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        const firstAvailable = data.sizes?.find((s) => s.available);
        if (firstAvailable) setSelectedSize(firstAvailable.size);
      });
  }, [id]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!product) return <p style={{ textAlign: "center", padding: "60px" }}>Loading...</p>;

  const price = product.price;
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - price) / product.oldPrice) * 100)
    : null;

  const handleAddToCart = () => {
    setError("");
    if (product.isSoldOut) return setError("Ce produit est épuisé.");
    if (!selectedSize) return setError("Veuillez choisir une taille.");

    addToCart({ ...product, selectedSize, qty: quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={container(isMobile)}>
      {/* IMAGE */}
      <div style={imageBox(isMobile)}>
        <div style={{ position: "relative" }}>
          <img
            src={`${import.meta.env.VITE_API_URL}/${product.image}`}
            alt={product.name}
            style={{
              ...image(isMobile),
              filter: product.isSoldOut ? "grayscale(60%)" : "none",
            }}
          />
          {product.isSoldOut && (
            <div style={soldOutOverlay}>SOLD OUT</div>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div style={details}>
        <h2 style={titleStyle(isMobile)}>{product.name}</h2>

        {/* PRICE */}
        <div style={{ marginBottom: "20px" }}>
          <span style={priceStyle}>{price} DT</span>
          {product.oldPrice && (
            <>
              <span style={oldPriceStyle}>{product.oldPrice} DT</span>
              <span style={discountStyle}>-{discount}%</span>
            </>
          )}
        </div>

        {/* SIZES */}
        <h4 style={{ marginBottom: "10px" }}>TAILLE</h4>
        <div style={sizesRow}>
          {product.sizes?.map((s) => (
            <button
              key={s.size}
              disabled={!s.available || product.isSoldOut}
              onClick={() => { setSelectedSize(s.size); setError(""); }}
              style={{
                ...sizeBtn(isMobile),
                background: selectedSize === s.size ? "#000" : "#fff",
                color: selectedSize === s.size ? "#fff" : "#000",
                opacity: s.available && !product.isSoldOut ? 1 : 0.3,
                cursor: s.available && !product.isSoldOut ? "pointer" : "not-allowed",
              }}
            >
              {s.size}
            </button>
          ))}
        </div>

        {/* QUANTITY */}
        <h4 style={{ marginBottom: "10px" }}>QUANTITÉ</h4>
        <div style={qtyBox}>
          <button style={qtyBtn} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
          <span style={{ fontSize: "18px", minWidth: "24px", textAlign: "center" }}>{quantity}</span>
          <button style={qtyBtn} onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>

        {/* PRICE SUMMARY */}
        <div style={summaryBox}>
          <div style={summaryRow}>
            <span>Sous-total</span>
            <span>{price * quantity} DT</span>
          </div>
          <div style={summaryRow}>
            <span>Livraison</span>
            <span>8 DT</span>
          </div>
          <div style={{ ...summaryRow, fontWeight: "bold", fontSize: "17px", borderTop: "1px solid #eee", paddingTop: "10px", marginTop: "6px" }}>
            <span>Total estimé</span>
            <span>{price * quantity + 8} DT</span>
          </div>
        </div>

        {/* ERROR */}
        {error && <div style={errorBox}>⚠️ {error}</div>}

        {/* ADD TO CART BUTTON */}
        <button
          style={{
            ...addBtn,
            background: product.isSoldOut ? "#aaa" : added ? "#4caf50" : "#000",
            cursor: product.isSoldOut ? "not-allowed" : "pointer",
          }}
          onClick={handleAddToCart}
          disabled={product.isSoldOut}
          onMouseEnter={(e) => { if (!product.isSoldOut && !added) e.target.style.background = "#d81b60"; }}
          onMouseLeave={(e) => { if (!product.isSoldOut && !added) e.target.style.background = "#000"; }}
        >
          {product.isSoldOut ? "SOLD OUT" : added ? "✓ Ajouté au panier !" : "AJOUTER AU PANIER"}
        </button>

        {/* GO TO CART */}
        {added && (
          <button style={cartBtn} onClick={() => navigate("/cart")}>
            Voir mon panier →
          </button>
        )}
      </div>
    </div>
  );
}

/* ===== STYLES ===== */
const container = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  padding: isMobile ? "16px" : "40px",
  gap: isMobile ? "20px" : "40px",
  maxWidth: "1100px",
  margin: "0 auto",
});

const imageBox = (isMobile) => ({
  flexShrink: 0,
  width: isMobile ? "100%" : "auto",
});

const image = (isMobile) => ({
  width: isMobile ? "100%" : "400px",
  height: isMobile ? "auto" : "auto",
  maxHeight: isMobile ? "420px" : "none",
  borderRadius: "20px",
  objectFit: "cover",
  display: "block",
});

const soldOutOverlay = { position: "absolute", top: "16px", left: "16px", background: "#000", color: "#fff", fontSize: "12px", fontWeight: "bold", padding: "6px 14px", borderRadius: "20px", letterSpacing: "2px" };
const details = { flex: 1 };

const titleStyle = (isMobile) => ({
  color: "#000",
  fontSize: isMobile ? "20px" : "28px",
  marginBottom: "8px",
});

const priceStyle = { color: "#e91e63", fontSize: "24px", fontWeight: "bold", marginRight: "12px" };
const oldPriceStyle = { textDecoration: "line-through", color: "#aaa", fontSize: "16px", marginRight: "8px" };
const discountStyle = { color: "#d81b60", fontWeight: "bold", fontSize: "14px" };
const sizesRow = { display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" };

const sizeBtn = (isMobile) => ({
  width: isMobile ? "40px" : "44px",
  height: isMobile ? "40px" : "44px",
  borderRadius: "50%",
  border: "1px solid #ccc",
  fontSize: "13px",
  fontWeight: "bold",
  transition: "all 0.2s ease",
});

const qtyBox = { display: "flex", gap: "14px", alignItems: "center", marginBottom: "24px" };
const qtyBtn = { width: "38px", height: "38px", borderRadius: "50%", border: "1px solid #000", background: "#000", color: "#fff", cursor: "pointer", fontSize: "18px" };
const summaryBox = { background: "#f9f9f9", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" };
const summaryRow = { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "15px" };
const errorBox = { padding: "12px 16px", backgroundColor: "#fff0f3", border: "1px solid #e91e63", borderRadius: "8px", color: "#c0003c", fontWeight: "500", fontSize: "14px", marginBottom: "12px" };
const addBtn = { width: "100%", padding: "16px", color: "#fff", border: "none", borderRadius: "30px", fontSize: "15px", fontWeight: "bold", transition: "background 0.3s", marginBottom: "12px" };
const cartBtn = { width: "100%", padding: "14px", background: "#fff", color: "#000", border: "2px solid #000", borderRadius: "30px", fontSize: "15px", fontWeight: "bold", cursor: "pointer" };

export default ProductPage;

