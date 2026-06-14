import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [sizes, setSizes] = useState([
    { size: "32", available: true },
    { size: "34", available: true },
    { size: "36", available: true },
    { size: "38", available: true },
    { size: "40", available: true },
    { size: "42", available: true },
    { size: "44", available: true },
  ]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const url = statusFilter
        ? `${import.meta.env.VITE_API_URL}/api/orders?status=${encodeURIComponent(statusFilter)}`
        : `${import.meta.env.VITE_API_URL}/api/orders`;
      const res = await axios.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error("Orders fetch error:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/stats`);
      setStats(res.data);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  const buildWhatsAppLink = (order, newStatus) => {
    const phone = "216" + order.customer?.telephone?.replace(/\s/g, "");
    const itemsList = order.items
      ?.map((i) => `• ${i.productName} (taille ${i.size} x${i.quantity})`)
      .join("\n");
    let msg = "";
    if (newStatus === "Confirmée") {
      msg = `Bonjour ${order.customer?.nom} ! 🎉\n\nVotre commande *${order.ref}* a été *confirmée* ✅\n\n${itemsList}\n\nTotal: ${order.total} DT (livraison incluse)\n\nMerci de votre confiance ! - XOXO 🛍️`;
    } else if (newStatus === "Livrée") {
      msg = `Bonjour ${order.customer?.nom} ! 📦\n\nVotre commande *${order.ref}* a été *livrée* 🎁\n\n${itemsList}\n\nNous espérons que vous adorez vos articles ! - XOXO 💕`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  const handleStatusChange = async (orderId, newStatus, order) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      fetchOrders();
      fetchStats();
      if (newStatus === "Confirmée" || newStatus === "Livrée") {
        window.open(buildWhatsAppLink(order, newStatus), "_blank");
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Supprimer cette commande ?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}`);
      fetchOrders();
      fetchStats();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setName(p.name);
    setPrice(p.price);
    setOldPrice(p.oldPrice || "");
    setCategory(p.category || "");
    setIsSoldOut(p.isSoldOut);
    if (p.sizes) setSizes(p.sizes);
    setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setOldPrice("");
    setCategory("");
    setIsSoldOut(false);
    setImageFile(null);
    setSizes([
      { size: "32", available: true },
      { size: "34", available: true },
      { size: "36", available: true },
      { size: "38", available: true },
      { size: "40", available: true },
      { size: "42", available: true },
      { size: "44", available: true },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("oldPrice", oldPrice);
    formData.append("category", category);
    formData.append("isSoldOut", isSoldOut);
    formData.append("sizes", JSON.stringify(sizes));
    if (imageFile) formData.append("image", imageFile);

    try {
      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/api/products/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/products`;
      const method = editingId ? "PUT" : "POST";
      await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(editingId ? "Produit mis à jour !" : "Produit ajouté !");
      resetForm();
      fetchProducts();
    } catch (err) {
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const statusColor = (status) => {
    if (status === "Confirmée") return "#4caf50";
    if (status === "Livrée") return "#2196f3";
    return "#ff9800";
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin-login";
  };

  return (
    <div style={adminStyle}>
      {/* LOGOUT */}
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <button style={logoutBtn} onClick={handleLogout}>
          🔒 Se déconnecter
        </button>
      </div>

      <h1 style={{ color: "#d81b60" }}>Admin Control Panel</h1>

      {/* STATS BAR */}
      {stats && (
        <div style={statsBar}>
          <div style={statCard}>
            <p style={statNum}>{stats.totalOrders}</p>
            <p style={statLabel}>Total commandes</p>
          </div>
          <div style={statCard}>
            <p style={{ ...statNum, color: "#ff9800" }}>{stats.pending}</p>
            <p style={statLabel}>En attente</p>
          </div>
          <div style={statCard}>
            <p style={{ ...statNum, color: "#4caf50" }}>{stats.confirmed}</p>
            <p style={statLabel}>Confirmées</p>
          </div>
          <div style={statCard}>
            <p style={{ ...statNum, color: "#2196f3" }}>{stats.delivered}</p>
            <p style={statLabel}>Livrées</p>
          </div>
          <div style={statCard}>
            <p style={{ ...statNum, color: "#d81b60" }}>
              {stats.totalRevenue} DT
            </p>
            <p style={statLabel}>Chiffre d'affaires</p>
          </div>
        </div>
      )}

      {/* TABS */}
      <div style={tabBar}>
        <button
          style={{
            ...tabBtn,
            borderBottom:
              tab === "products"
                ? "3px solid #d81b60"
                : "3px solid transparent",
          }}
          onClick={() => setTab("products")}
        >
          🛍️ Articles ({products.length})
        </button>
        <button
          style={{
            ...tabBtn,
            borderBottom:
              tab === "orders" ? "3px solid #d81b60" : "3px solid transparent",
          }}
          onClick={() => setTab("orders")}
        >
          📦 Commandes ({orders.length})
        </button>
        {stats?.bestSellers?.length > 0 && (
          <button
            style={{
              ...tabBtn,
              borderBottom:
                tab === "stats" ? "3px solid #d81b60" : "3px solid transparent",
            }}
            onClick={() => setTab("stats")}
          >
            📊 Stats
          </button>
        )}
      </div>

      {/* PRODUCTS TAB */}
      {tab === "products" && (
        <>
          <div style={formCard}>
            <h3>
              {editingId ? "✏️ Modifier l'article" : "➕ Ajouter un article"}
            </h3>
            <form onSubmit={handleSubmit} style={formStyle}>
              <input
                type="text"
                placeholder="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                required
              />
              <input
                type="number"
                placeholder="Prix (DT)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={inputStyle}
                required
                min="0"
              />
              <input
                type="number"
                placeholder="Ancien prix (DT)"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                style={inputStyle}
                min="0"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={inputStyle}
                required
              >
                <option value="">Choisir une catégorie</option>
                <option value="set">Set</option>
                <option value="pantalon">Pantalon</option>
                <option value="robe">Robe</option>
                <option value="pull">Pull</option>
                <option value="veste">Veste</option>
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                style={inputStyle}
              />
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={isSoldOut}
                  onChange={(e) => setIsSoldOut(e.target.checked)}
                />
                <label>Marquer comme épuisé</label>
              </div>
              <div>
                <h4>Disponibilité des tailles</h4>
                {sizes.map((s, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "6px",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ width: "30px", fontWeight: "bold" }}>
                      {s.size}
                    </span>
                    <input
                      type="checkbox"
                      checked={s.available}
                      onChange={(e) => {
                        const updated = [...sizes];
                        updated[index].available = e.target.checked;
                        setSizes(updated);
                      }}
                    />
                    <label
                      style={{ color: s.available ? "#4caf50" : "#e91e63" }}
                    >
                      {s.available ? "Disponible" : "Épuisée"}
                    </label>
                  </div>
                ))}
              </div>
              <button type="submit" style={saveBtn}>
                {editingId ? "Mettre à jour" : "Sauvegarder"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ ...saveBtn, backgroundColor: "#888" }}
                >
                  Annuler
                </button>
              )}
            </form>
          </div>

          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h3>Articles en ligne ({products.length})</h3>
            <div style={listContainer}>
              {products.map((p) => (
                <div key={p._id} style={listItem}>
                  <img
                    src={`${import.meta.env.VITE_API_URL}/${p.image}`}
                    alt={p.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <span style={{ flex: 1, textAlign: "left" }}>
                    {p.name} — {p.price} DT
                    <span
                      style={{
                        marginLeft: "8px",
                        fontSize: "12px",
                        color: "#888",
                      }}
                    >
                      ({p.category})
                    </span>
                    {p.isSoldOut && (
                      <span
                        style={{
                          marginLeft: "8px",
                          color: "red",
                          fontSize: "12px",
                        }}
                      >
                        ÉPUISÉ
                      </span>
                    )}
                  </span>
                  <button onClick={() => handleEdit(p)} style={editBtn}>
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    style={{ ...editBtn, backgroundColor: "red" }}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ORDERS TAB */}
      {tab === "orders" && (
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          {/* STATUS FILTER */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            {["", "En attente", "Confirmée", "Livrée"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "20px",
                  border: "1px solid #ddd",
                  background: statusFilter === s ? "#000" : "#fff",
                  color: statusFilter === s ? "#fff" : "#000",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                {s === "" ? "Toutes" : s}
              </button>
            ))}
          </div>

          <h3>Commandes ({orders.length})</h3>

          {orders.length === 0 ? (
            <p style={{ color: "#888", textAlign: "center", padding: "40px" }}>
              Aucune commande{statusFilter ? ` "${statusFilter}"` : ""} pour le
              moment.
            </p>
          ) : (
            orders.map((o) => (
              <div key={o._id} style={orderCard}>
                {/* TOP: ref + date + customer */}
                <div style={orderHeader}>
                  <div>
                    <span style={refBadge}>{o.ref}</span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#999",
                        marginLeft: "12px",
                      }}
                    >
                      {new Date(o.createdAt).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <span
                    style={{
                      ...statusBadge,
                      backgroundColor: statusColor(o.status),
                    }}
                  >
                    {o.status}
                  </span>
                </div>

                {/* MIDDLE: items + customer */}
                <div style={orderBody}>
                  {/* ITEMS */}
                  <div style={{ flex: 2 }}>
                    {o.items?.map((item, i) => (
                      <div key={i} style={orderItem}>
                        <img
                          src={`${import.meta.env.VITE_API_URL}/${item.productImage}`}
                          alt={item.productName}
                          style={{
                            width: "55px",
                            height: "55px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            {item.productName}
                          </p>
                          <p
                            style={{
                              margin: "2px 0 0",
                              fontSize: "12px",
                              color: "#666",
                            }}
                          >
                            Taille: {item.size} | Qté: {item.quantity} |{" "}
                            {item.subtotal} DT
                          </p>
                        </div>
                      </div>
                    ))}
                    <p
                      style={{
                        margin: "10px 0 0",
                        fontWeight: "bold",
                        color: "#d81b60",
                      }}
                    >
                      Total: {o.total} DT
                      <span
                        style={{
                          fontWeight: "normal",
                          color: "#999",
                          fontSize: "12px",
                          marginLeft: "6px",
                        }}
                      >
                        (dont {o.delivery} DT livraison)
                      </span>
                    </p>
                  </div>

                  {/* CUSTOMER */}
                  <div
                    style={{
                      flex: 1,
                      fontSize: "14px",
                      color: "#333",
                      borderLeft: "1px solid #eee",
                      paddingLeft: "20px",
                    }}
                  >
                    <p style={{ margin: "2px 0" }}>👤 {o.customer?.nom}</p>
                    <p style={{ margin: "2px 0" }}>
                      📞 {o.customer?.telephone}
                    </p>
                    <p style={{ margin: "2px 0" }}>📍 {o.customer?.ville}</p>
                    <p
                      style={{
                        margin: "2px 0",
                        fontSize: "12px",
                        color: "#888",
                      }}
                    >
                      {o.customer?.adresse}
                    </p>
                  </div>
                </div>

                {/* BOTTOM: actions */}
                <div style={orderActions}>
                  <select
                    value={o.status}
                    onChange={(e) =>
                      handleStatusChange(o._id, e.target.value, o)
                    }
                    style={statusSelect}
                  >
                    <option value="En attente">En attente</option>
                    <option value="Confirmée">Confirmée</option>
                    <option value="Livrée">Livrée</option>
                  </select>
                  <button
                    onClick={() => handleDeleteOrder(o._id)}
                    style={deleteOrderBtn}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* STATS TAB */}
      {tab === "stats" && stats && (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h3>🏆 Top 5 articles les plus vendus</h3>
          {stats.bestSellers.map((item, i) => (
            <div key={i} style={bestSellerRow}>
              <span style={rankBadge}>#{i + 1}</span>
              <span style={{ flex: 1, textAlign: "left", fontWeight: "500" }}>
                {item.name}
              </span>
              <span style={{ fontWeight: "bold", color: "#d81b60" }}>
                {item.qty} vendus
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== STYLES ===== */
const adminStyle = {
  padding: "40px 20px",
  fontFamily: "sans-serif",
  textAlign: "center",
  backgroundColor: "#f4f4f4",
  minHeight: "100vh",
};
const logoutBtn = {
  padding: "8px 20px",
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "13px",
  color: "#888",
};
const statsBar = {
  display: "flex",
  justifyContent: "center",
  gap: "16px",
  flexWrap: "wrap",
  marginBottom: "30px",
};
const statCard = {
  background: "#fff",
  borderRadius: "12px",
  padding: "16px 24px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  minWidth: "120px",
};
const statNum = {
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 4px",
  color: "#000",
};
const statLabel = { fontSize: "12px", color: "#888", margin: 0 };
const tabBar = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "30px",
};
const tabBtn = {
  padding: "12px 30px",
  fontSize: "15px",
  fontWeight: "bold",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#333",
};
const formCard = {
  backgroundColor: "#fff",
  padding: "30px",
  borderRadius: "12px",
  maxWidth: "500px",
  margin: "0 auto 40px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
};
const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "14px",
};
const saveBtn = {
  padding: "12px",
  backgroundColor: "#222",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
const listContainer = { display: "flex", flexDirection: "column", gap: "10px" };
const listItem = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  justifyContent: "space-between",
  padding: "12px 16px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  border: "1px solid #eee",
};
const editBtn = {
  backgroundColor: "#d81b60",
  color: "white",
  border: "none",
  padding: "6px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
};
const orderCard = {
  background: "#fff",
  borderRadius: "14px",
  padding: "20px",
  marginBottom: "16px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
  textAlign: "left",
};
const orderHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};
const refBadge = {
  background: "#f0f0f0",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "bold",
};
const orderBody = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
  marginBottom: "16px",
};
const orderItem = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  marginBottom: "10px",
};
const orderActions = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  borderTop: "1px solid #eee",
  paddingTop: "14px",
};
const statusBadge = {
  color: "#fff",
  padding: "5px 14px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "bold",
};
const statusSelect = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  cursor: "pointer",
  fontSize: "13px",
};
const deleteOrderBtn = {
  padding: "8px 16px",
  background: "#fff",
  color: "red",
  border: "1px solid red",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "bold",
};
const bestSellerRow = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  background: "#fff",
  padding: "14px 20px",
  borderRadius: "10px",
  marginBottom: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};
const rankBadge = {
  background: "#d81b60",
  color: "#fff",
  borderRadius: "50%",
  width: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "13px",
  flexShrink: 0,
};

export default AdminDashboard;

