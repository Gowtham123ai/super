import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Suppliers from "./pages/Suppliers";
import { FaSun, FaMoon } from "react-icons/fa";

const Placeholder = ({ title }: { title: string }) => {
    const { dark } = useTheme();
    return (
        <div style={{ flex: 1, padding: "32px", background: dark ? "#1e293b" : "#ffffff", color: dark ? "white" : "#1e293b", minHeight: "100vh" }}>
            <h1>{title}</h1><p style={{ color: "#64748b" }}>Coming soon...</p>
        </div>
    );
};

function App() {
    const { dark, toggle } = useTheme();
    return (
        <BrowserRouter>
            <div style={{ display: "flex", minHeight: "100vh" }}>
                <Sidebar />
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Theme Toggle Bar */}
                    <div style={{
                        display: "flex", justifyContent: "flex-end", alignItems: "center",
                        padding: "10px 24px", background: dark ? "#0f172a" : "#e2e8f0",
                        borderBottom: `1px solid ${dark ? "#1e293b" : "#cbd5e1"}`,
                    }}>
                        <button
                            onClick={toggle}
                            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            style={{
                                background: dark ? "#1e293b" : "#cbd5e1",
                                border: "none", borderRadius: "20px", padding: "6px 14px",
                                cursor: "pointer", color: dark ? "#38bdf8" : "#475569",
                                display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 600,
                            }}
                        >
                            {dark ? <><FaSun /> Light Mode</> : <><FaMoon /> Dark Mode</>}
                        </button>
                    </div>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/billing" element={<Billing />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/suppliers" element={<Suppliers />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
