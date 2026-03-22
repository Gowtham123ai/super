import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
    const { dark } = useTheme();
    const [storeName, setStoreName] = useState("SuperMarket");
    const [gstNumber, setGstNumber] = useState("29ABCDE1234F2Z5");
    const [upiId, setUpiId] = useState("merchant@upi");

    const bg = dark ? "#1e293b" : "#ffffff";
    const card = dark ? "#0f172a" : "#f8fafc";
    const text = dark ? "white" : "#1e293b";
    const muted = dark ? "#64748b" : "#94a3b8";
    const border = dark ? "#334155" : "#e2e8f0";

    const saveSettings = () => {
        alert("Settings saved (local simulation)");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, padding: "32px", background: bg, color: text, minHeight: "100vh" }}
        >
            <h1 style={{ margin: "0 0 4px", fontSize: "24px" }}>⚙️ Settings</h1>
            <p style={{ color: muted, marginBottom: "28px", fontSize: "14px" }}>
                Manage your store details and payment configurations.
            </p>

            <div style={{ background: card, borderRadius: "16px", padding: "28px", border: `1px solid ${border}`, maxWidth: "500px" }}>
                <FieldLabel dark={dark}>Store Name</FieldLabel>
                <input value={storeName} onChange={(e) => setStoreName(e.target.value)} style={inputStyle(dark)} />

                <FieldLabel dark={dark}>GST Number</FieldLabel>
                <input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} style={inputStyle(dark)} />

                <FieldLabel dark={dark}>UPI ID (for QR Generation)</FieldLabel>
                <input value={upiId} onChange={(e) => setUpiId(e.target.value)} style={inputStyle(dark)} />

                <button
                    onClick={saveSettings}
                    style={{
                        marginTop: "24px", padding: "12px 24px", background: "#38bdf8", color: "white",
                        border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer",
                        fontSize: "14px", width: "100%",
                    }}
                >
                    💾 Save Settings
                </button>
            </div>
        </motion.div>
    );
}

const FieldLabel = ({ dark, children }: { dark: boolean; children: React.ReactNode }) => (
    <label style={{ display: "block", color: dark ? "#94a3b8" : "#64748b", fontSize: "12px", marginBottom: "6px", fontWeight: 600, marginTop: "16px", textTransform: "uppercase" }}>
        {children}
    </label>
);

const inputStyle = (dark: boolean): React.CSSProperties => ({
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
    background: dark ? "#1e293b" : "#f1f5f9",
    color: dark ? "white" : "#1e293b",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
});
