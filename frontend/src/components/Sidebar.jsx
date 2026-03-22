import { NavLink } from "react-router-dom";
import { FaHome, FaBox, FaShoppingCart, FaChartBar, FaTruck, FaCog, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const menuItems = [
  { icon: <FaHome />, label: "Dashboard", path: "/" },
  { icon: <FaBox />, label: "Products", path: "/products" },
  { icon: <FaShoppingCart />, label: "Billing", path: "/billing" },
  { icon: <FaTruck />, label: "Suppliers", path: "/suppliers" },
  { icon: <FaChartBar />, label: "Reports", path: "/reports" },
  { icon: <FaCog />, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  return (
    <motion.div
      initial={{ x: -220 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        width: "220px",
        minHeight: "100vh",
        background: "#1e293b",
        padding: "24px 12px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        borderRight: "1px solid #334155",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{ fontSize: "28px" }}>🛒</div>
        <h2 style={{ color: "#38bdf8", margin: "6px 0 2px", fontSize: "16px" }}>SuperMarket</h2>
        <span style={{ color: "#64748b", fontSize: "11px" }}>Management System</span>
      </div>

      {menuItems.map((item) => (
        <MenuItem key={item.label} {...item} />
      ))}

      <div style={{ flex: 1 }} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          borderRadius: "10px",
          cursor: "pointer",
          color: "#ef4444",
          fontSize: "14px",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#450a0a")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <FaSignOutAlt /> <span>Logout</span>
      </div>
    </motion.div>
  );
}

function MenuItem({ icon, label, path }) {
  return (
    <NavLink
      to={path}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        marginBottom: "6px",
        borderRadius: "10px",
        cursor: "pointer",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: isActive ? "600" : "400",
        color: isActive ? "#38bdf8" : "#94a3b8",
        background: isActive ? "rgba(56,189,248,0.1)" : "transparent",
        transition: "all 0.2s",
        borderLeft: isActive ? "3px solid #38bdf8" : "3px solid transparent",
      })}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
