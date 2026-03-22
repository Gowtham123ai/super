import { motion } from "framer-motion";
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
    LineElement, PointElement, ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement);

const Reports = () => {
    const { dark } = useTheme();
    const bg = dark ? "#1e293b" : "#ffffff";
    const card = dark ? "#0f172a" : "#f8fafc";
    const text = dark ? "white" : "#1e293b";
    const grid = dark ? "#1e293b" : "#e2e8f0";

    const chartOptions = {
        responsive: true,
        plugins: { legend: { labels: { color: dark ? "#94a3b8" : "#64748b" } } },
        scales: {
            x: { ticks: { color: dark ? "#64748b" : "#94a3b8" }, grid: { color: grid } },
            y: { ticks: { color: dark ? "#64748b" : "#94a3b8" }, grid: { color: grid } },
        },
    };

    const pieOptions = {
        responsive: true,
        plugins: { legend: { labels: { color: dark ? "#94a3b8" : "#64748b" }, position: "bottom" as const } },
    };

    const monthlySales = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: "Monthly Sales (₹)",
            data: [82000, 94000, 108000, 99000, 121000, 137000, 115000, 143000, 129000, 156000, 142000, 175000],
            borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,0.12)",
            tension: 0.4, fill: true,
        }],
    };

    const topProducts = {
        labels: ["Rice 5kg", "Cooking Oil", "Detergent", "Sugar 2kg", "Milk 1L"],
        datasets: [{
            label: "Units Sold",
            data: [520, 430, 380, 310, 290],
            backgroundColor: ["#38bdf8", "#a78bfa", "#34d399", "#fb923c", "#f472b6"],
            borderRadius: 8,
        }],
    };

    const categoryRevenue = {
        labels: ["Groceries", "Dairy", "Beverages", "Snacks", "Cleaning"],
        datasets: [{
            data: [38, 22, 18, 14, 8],
            backgroundColor: ["#38bdf8", "#a78bfa", "#34d399", "#fb923c", "#f472b6"],
            borderWidth: 2,
            borderColor: dark ? "#0f172a" : "#ffffff",
        }],
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, padding: "32px", background: bg, color: text, minHeight: "100vh" }}
        >
            <h1 style={{ margin: "0 0 4px", fontSize: "24px" }}>📈 Reports & Analytics</h1>
            <p style={{ color: dark ? "#64748b" : "#94a3b8", marginBottom: "28px", fontSize: "14px" }}>
                Monthly trends, top products, and revenue breakdown.
            </p>

            {/* Monthly Sales Line Chart */}
            <div style={{ background: card, borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ color: "#38bdf8", marginBottom: "16px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    📅 Monthly Sales Revenue
                </h3>
                <Line data={monthlySales} options={chartOptions} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
                {/* Top Products Bar */}
                <div style={{ background: card, borderRadius: "16px", padding: "24px" }}>
                    <h3 style={{ color: "#a78bfa", marginBottom: "16px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        🏆 Top 5 Products by Units Sold
                    </h3>
                    <Bar data={topProducts} options={chartOptions} />
                </div>

                {/* Category Pie */}
                <div style={{ background: card, borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h3 style={{ color: "#34d399", marginBottom: "16px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", alignSelf: "flex-start" }}>
                        🥧 Revenue by Category
                    </h3>
                    <div style={{ width: "260px" }}>
                        <Pie data={categoryRevenue} options={pieOptions} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Reports;
