import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
        label: "Daily Sales (₹)",
        data: [12000, 19000, 15000, 22000, 18000, 25000, 20000],
        backgroundColor: "rgba(56,189,248,0.75)",
        borderRadius: 8,
    }],
};

const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
        label: "Revenue (₹)",
        data: [80000, 95000, 110000, 100000, 125000, 140000],
        borderColor: "#a78bfa",
        backgroundColor: "rgba(167,139,250,0.12)",
        tension: 0.4,
        fill: true,
    }],
};

const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: "#94a3b8" } } },
    scales: {
        x: { ticks: { color: "#64748b" }, grid: { color: "#1e293b" } },
        y: { ticks: { color: "#64748b" }, grid: { color: "#1e293b" } },
    },
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

export default function Dashboard() {
    const [salesAmount, setSalesAmount] = useState(0);
    const [creditAmount, setCreditAmount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [creditsList, setCreditsList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salesRes, creditsRes, productsRes] = await Promise.all([
                    axios.get(`${API_BASE}/sales`).catch(() => ({ data: [] })),
                    axios.get(`${API_BASE}/credits`).catch(() => ({ data: [] })),
                    axios.get(`${API_BASE}/products`).catch(() => ({ data: [] }))
                ]);

                const sales = salesRes.data || [];
                const credits = creditsRes.data || [];
                const products = productsRes.data || [];

                const tSales = sales.reduce((acc, s) => acc + (s.finalAmount || 0), 0);
                const tCredit = credits.reduce((acc, c) => acc + (c.amount || 0), 0);

                setSalesAmount(tSales);
                setCreditAmount(tCredit);
                setProductsCount(products.length);
                setOrdersCount(sales.length + credits.length); // Orders count combining cash + credit sales
                setCreditsList(credits);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            }
        };
        fetchData();
    }, []);

    const dynamicStats = [
        { label: "Total Sales", value: `₹ ${salesAmount.toFixed(2)}`, color: "#38bdf8", icon: "💰" },
        { label: "Credit Sales", value: `₹ ${creditAmount.toFixed(2)}`, color: "#fb923c", icon: "📒" },
        { label: "Products", value: productsCount.toString(), color: "#a78bfa", icon: "📦" },
        { label: "Total Orders", value: ordersCount.toString(), color: "#34d399", icon: "📈" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ padding: "32px", overflowY: "auto", flex: 1 }}
        >
            <h1 style={{ margin: "0 0 8px", fontSize: "24px" }}>Dashboard</h1>
            <p style={{ color: "#64748b", marginBottom: "28px", fontSize: "14px" }}>
                Welcome back! Here's an overview of today's activity.
            </p>

            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
                {dynamicStats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            background: "#1e293b",
                            borderRadius: "14px",
                            padding: "20px",
                            borderLeft: `4px solid ${s.color}`,
                        }}
                    >
                        <div style={{ fontSize: "24px", marginBottom: "8px" }}>{s.icon}</div>
                        <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>{s.label}</div>
                        <div style={{ color: s.color, fontSize: "22px", fontWeight: "700" }}>{s.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ background: "#1e293b", borderRadius: "14px", padding: "24px" }}>
                    <h3 style={{ color: "#94a3b8", marginBottom: "16px", fontSize: "14px" }}>📊 Weekly Sales</h3>
                    <Bar data={barData} options={chartOptions} />
                </div>
                <div style={{ background: "#1e293b", borderRadius: "14px", padding: "24px" }}>
                    <h3 style={{ color: "#94a3b8", marginBottom: "16px", fontSize: "14px" }}>📈 Monthly Revenue</h3>
                    <Line data={lineData} options={chartOptions} />
                </div>
            </div>

            {/* Separate section for Credit Sales */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ marginTop: "32px", background: "#1e293b", borderRadius: "14px", padding: "24px" }}
            >
                <h3 style={{ color: "#fb923c", marginBottom: "16px", fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", gap: "8px", alignItems: "center" }}>
                    <span>📒</span> Recent Credit Sales
                </h3>
                {creditsList.length === 0 ? (
                    <p style={{ color: "#64748b", fontSize: "14px" }}>No credit sales recorded yet.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", color: "white", fontSize: "14px", textAlign: "left" }}>
                            <thead>
                                <tr style={{ background: "#0f172a" }}>
                                    <th style={{ padding: "12px", borderRadius: "8px 0 0 8px" }}>Customer Name</th>
                                    <th style={{ padding: "12px" }}>Phone</th>
                                    <th style={{ padding: "12px" }}>Due Date</th>
                                    <th style={{ padding: "12px" }}>Amount</th>
                                    <th style={{ padding: "12px", borderRadius: "0 8px 8px 0" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {creditsList.map((c, i) => (
                                    <tr key={c.id || i} style={{ borderBottom: "1px solid #0f172a", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#0f172a"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                        <td style={{ padding: "16px 12px" }}>{c.customerName || "—"}</td>
                                        <td style={{ padding: "16px 12px", color: "#94a3b8" }}>{c.phone || "—"}</td>
                                        <td style={{ padding: "16px 12px" }}>{c.dueDate || "N/A"}</td>
                                        <td style={{ padding: "16px 12px", color: "#38bdf8", fontWeight: "bold" }}>₹ {c.amount?.toFixed(2)}</td>
                                        <td style={{ padding: "16px 12px" }}>
                                            <span style={{
                                                background: c.paid ? "rgba(52, 211, 153, 0.2)" : "rgba(248, 113, 113, 0.2)",
                                                color: c.paid ? "#34d399" : "#f87171",
                                                padding: "6px 10px",
                                                borderRadius: "6px",
                                                fontSize: "11px",
                                                fontWeight: "bold",
                                                letterSpacing: "0.5px"
                                            }}>
                                                {c.paid ? "PAID" : "UNPAID"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
