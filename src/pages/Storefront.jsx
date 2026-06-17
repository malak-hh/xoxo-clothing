import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Storefront({ addToCart, searchTerm }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const { category } = useParams();
  const gridRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (searchTerm && gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchTerm]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? p.category === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* HERO */}
      <div style={hero(isMobile)}>
        <h1 style={titleStyle(isMobile)}>GOSSIP WORTHY LOOKS</h1>
        <p style={subtitleStyle(isMobile)}>Exclusive Fashion 2026</p>
      </div>

      {/* PRODUCTS */}
      <div ref={gridRef} style={grid(isMobile)}>
        {loading ? (
          <p>Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          filteredProducts.map((p) => {
            const discount =
              p.oldPrice && p.price
                ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                : null;

            return (
              <div
                key={p._id}
                style={card}
                onClick={() => navigate(`/product/${p._id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
                }}
              >
                {/* IMAGE + SOLD OUT BADGE */}
                <div style={{ overflow: "hidden", position: "relative" }}>
                  <img
                    src={p.image?.startsWith("http") ? p.image : `${import.meta.env.VITE_API_URL}/${p.image}`}
                    style={{
                      ...img(isMobile),
                      filter: p.isSoldOut ? "grayscale(60%)" : "none",
                    }}
                    alt={p.name}
                  />
                  {p.isSoldOut && <div style={soldOutBadge}>SOLD OUT</div>}
                </div>

                <h3 style={productName(isMobile)}>{p.name}</h3>

                <div style={{ marginTop: "8px" }}>
                  <p style={{ margin: 0, fontWeight: "bold", fontSize: isMobile ? "13px" : "15px" }}>
                    {p.price} DT
                  </p>
                  {p.oldPrice && (
                    <p style={{ margin: 0, color: "#888" }}>
                      <span style={oldPrice}>{p.oldPrice} DT</span>
                      <span style={discountBadgeInline}>-{discount}%</span>
                    </p>
                  )}
                </div>

                <button
                  style={{
                    ...btn,
                    background: p.isSoldOut ? "#aaa" : "#000",
                    cursor: p.isSoldOut ? "not-allowed" : "pointer",
                    fontSize: isMobile ? "12px" : "14px",
                    padding: isMobile ? "8px" : "10px",
                  }}
                  disabled={p.isSoldOut}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${p._id}`);
                  }}
                  onMouseEnter={(e) => {
                    if (!p.isSoldOut) e.target.style.background = "#d81b60";
                  }}
                  onMouseLeave={(e) => {
                    if (!p.isSoldOut) e.target.style.background = "#000";
                  }}
                >
                  {p.isSoldOut ? "Sold Out" : "Voir l'article"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ===== STYLES ===== */
const hero = (isMobile) => ({
  height: isMobile ? "55vh" : "80vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "url('/bg.jpg') center/cover",
  textAlign: "center",
  padding: isMobile ? "0 16px" : "0",
});

const titleStyle = (isMobile) => ({
  fontSize: isMobile ? "1.5rem" : "3rem",
  fontWeight: "bold",
  color: "#000",
  whiteSpace: isMobile ? "nowrap" : "normal",
  lineHeight: 1.2,
});

const subtitleStyle = (isMobile) => ({
  letterSpacing: isMobile ? "2px" : "4px",
  fontSize: isMobile ? "0.7rem" : "1rem",
  color: "#000",
  marginTop: "8px",
});

const grid = (isMobile) => ({
  display: "grid",
  gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
  gap: isMobile ? "12px" : "20px",
  padding: isMobile ? "20px 14px" : "50px",
});

const card = {
  background: "#fff",
  padding: "10px",
  borderRadius: "14px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
  cursor: "pointer",
};

const img = (isMobile) => ({
  width: "100%",
  height: isMobile ? "170px" : "300px",
  objectFit: "cover",
  transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
  borderRadius: "8px",
});

const productName = (isMobile) => ({
  color: "#000",
  fontSize: isMobile ? "13px" : "16px",
  margin: "6px 0 4px",
});

const soldOutBadge = {
  position: "absolute",
  top: "12px",
  left: "12px",
  background: "#000",
  color: "#fff",
  fontSize: "11px",
  fontWeight: "bold",
  padding: "4px 10px",
  borderRadius: "20px",
  letterSpacing: "1px",
};

const oldPrice = {
  textDecoration: "line-through",
  marginRight: "8px",
  color: "#888",
};

const discountBadgeInline = {
  color: "#d81b60",
  fontWeight: "bold",
  fontSize: "13px",
};

const btn = {
  width: "100%",
  padding: "10px",
  background: "#000",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  marginTop: "10px",
  transition: "all 0.3s ease",
};

export default Storefront;


