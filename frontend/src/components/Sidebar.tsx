import { NavLink } from "react-router-dom";
import { FaHome, FaBox, FaShoppingCart, FaChartBar, FaTruck, FaCog, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";

type MenuItem = { icon: JSX.Element; text: string; path: string };

const menuItems: MenuItem[] = [
    { icon: <FaHome />, text: "Dashboard", path: "/" },
    { icon: <FaBox />, text: "Products", path: "/products" },
    { icon: <FaShoppingCart />, text: "Billing", path: "/billing" },
    { icon: <FaTruck />, text: "Suppliers", path: "/suppliers" },
    { icon: <FaChartBar />, text: "Reports", path: "/reports" },
    { icon: <FaCog />, text: "Settings", path: "/settings" },
];

const Sidebar = () => {
    return (
        <motion.div
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
                width: "240px",
                minHeight: "100vh",
                background: "#0f172a",
                padding: "24px 12px",
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
                borderRight: "1px solid #1e293b",
            }}
        >
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
                <div style={{ fontSize: "32px", marginBottom: "6px" }}>🛒</div>
                <h2 style={{ color: "#38bdf8", margin: 0, fontSize: "17px", letterSpacing: "0.5px" }}>
                    SuperMarket
                </h2>
                <span style={{ color: "#475569", fontSize: "11px" }}>Management System</span>
            </div>

            {/* Nav Items */}
            {menuItems.map(({ icon, text, path }) => (
                <NavLink
                    key={path}
                    to={path}
                    end={path === "/"}
                    style={({ isActive }) => ({
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "11px 16px",
                        marginBottom: "4px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#38bdf8" : "#94a3b8",
                        background: isActive ? "rgba(56,189,248,0.1)" : "transparent",
                        borderLeft: `3px solid ${isActive ? "#38bdf8" : "transparent"}`,
                        transition: "all 0.2s",
                    })}
                >
                    <span style={{ fontSize: "15px" }}>{icon}</span>
                    <span>{text}</span>
                </NavLink>
            ))}

            <div style={{ flex: 1 }} />

            {/* Logout */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "11px 16px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    color: "#ef4444",
                    fontSize: "14px",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "rgba(239,68,68,0.1)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
            >
                <FaSignOutAlt /> <span>Logout</span>
            </div>
        </motion.div>
    );
};

export default Sidebar;
