import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

function CategoryPage({ addToCart, searchTerm }) {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await res.json();
        setProducts(data.filter((p) => p.category?.toLowerCase() === categoryName.toLowerCase()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  useEffect(() => {
    if (searchTerm && gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [searchTerm]);

  const searchedProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <style>{`
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1024px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
        @media (max-width: 480px)  { .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
      `}</style>

      <h2 style={titleStyle}>{categoryName.toUpperCase()}</h2>

      <div ref={gridRef} className="cat-grid">
        {loading ? (
          <p>Loading...</p>
        ) : searchedProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          searchedProducts.map((p) => {
            const discount = p.oldPrice && p.price
              ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
              : null;

            return (
              <div key={p._id} style={card} onClick={() => navigate(`/product/${p._id}`)}>
                <div style={{ overflow: "hidden", position: "relative" }}>
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${p.image}`}
                    alt={p.name}
                    style={{ ...img, filter: p.isSoldOut ? "grayscale(60%)" : "none" }}
                  />
                  {p.isSoldOut && <div style={soldOutBadge}>SOLD OUT</div>}
                </div>

                <h3 style={{ color: "#000", marginTop: "8px", fontSize: "14px" }}>{p.name}</h3>

                <div style={{ marginTop: "4px" }}>
                  <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>{p.price} DT</p>
                  {p.oldPrice && (
                    <p style={{ margin: 0, color: "#888", fontSize: "12px" }}>
                      <span style={oldPrice}>{p.oldPrice} DT</span>
                      <span style={discountBadge}>-{discount}%</span>
                    </p>
                  )}
                </div>

                <button
                  style={{ ...btn, background: p.isSoldOut ? "#aaa" : "#000", cursor: p.isSoldOut ? "not-allowed" : "pointer" }}
                  disabled={p.isSoldOut}
                  onClick={(e) => { e.stopPropagation(); navigate(`/product/${p._id}`); }}
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

const titleStyle = { textAlign: "center", marginBottom: "24px", fontSize: "1.8rem", color: "#000", fontWeight: "bold" };
const card = { background: "#fff", padding: "8px", borderRadius: "14px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", cursor: "pointer", transition: "0.3s" };
const img = { width: "100%", height: "220px", objectFit: "cover", borderRadius: "10px", transition: "0.4s" };
const soldOutBadge = { position: "absolute", top: "8px", left: "8px", background: "#000", color: "#fff", fontSize: "10px", fontWeight: "bold", padding: "3px 8px", borderRadius: "20px" };
const oldPrice = { textDecoration: "line-through", marginRight: "6px", color: "#888" };
const discountBadge = { color: "#d81b60", fontWeight: "bold", fontSize: "12px" };
const btn = { width: "100%", padding: "9px", color: "#fff", border: "none", borderRadius: "8px", marginTop: "8px", fontSize: "13px", fontWeight: "bold", transition: "all 0.3s ease" };

export default CategoryPage;
