import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";

function Placeholder({ title }) {
    return (
        <div style={{ padding: "32px", flex: 1 }}>
            <h1>{title}</h1>
            <p style={{ color: "#64748b" }}>Coming soon...</p>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
                <Sidebar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/products" element={<Placeholder title="📦 Products" />} />
                    <Route path="/suppliers" element={<Placeholder title="🚚 Suppliers" />} />
                    <Route path="/reports" element={<Placeholder title="📈 Reports" />} />
                    <Route path="/settings" element={<Placeholder title="⚙️ Settings" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
