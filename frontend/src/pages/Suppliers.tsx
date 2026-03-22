import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { FaTrash, FaPlus, FaPhone, FaEnvelope, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const API = "/api/suppliers"; // Using the proxy configured in vite.config.ts

interface Supplier {
    id?: number;
    name: string;
    contactPerson: string;
    phone: string;
    email: string;
    address: string;
}

const empty: Supplier = {
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: ""
};

export default function Suppliers() {
    const { dark } = useTheme();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [form, setForm] = useState<Supplier>(empty);
    const [loading, setLoading] = useState(false);

    const bg = dark ? "#1e293b" : "#ffffff";
    const card = dark ? "#0f172a" : "#f8fafc";
    const text = dark ? "white" : "#1e293b";
    const muted = dark ? "#64748b" : "#94a3b8";
    const border = dark ? "#334155" : "#e2e8f0";

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get<Supplier[]>(API);
            setSuppliers(res.data);
        } catch (error) {
            console.error("Failed to fetch suppliers:", error);
            toast.error("Failed to load suppliers");
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const addSupplier = async () => {
        if (!form.name) return toast.error("Supplier name required");
        try {
            setLoading(true);
            await axios.post(API, form);
            toast.success(`✅ ${form.name} added!`);
            setForm(empty);
            fetchSuppliers();
        } catch (error) {
            toast.error("Failed to add supplier");
        } finally {
            setLoading(false);
        }
    };

    const deleteSupplier = async (id?: number, name?: string) => {
        if (!id) return;
        try {
            await axios.delete(`${API}/${id}`);
            toast.success(`🗑️ ${name} deleted`);
            fetchSuppliers();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, padding: "32px", background: bg, color: text, minHeight: "100vh" }}
        >
            <h1 style={{ margin: "0 0 4px", fontSize: "24px" }}>🚚 Suppliers</h1>
            <p style={{ color: muted, marginBottom: "28px", fontSize: "14px" }}>
                Manage your wholesale suppliers and contact information.
            </p>

            {/* Add Supplier Form */}
            <div style={{ background: card, borderRadius: "16px", padding: "24px", marginBottom: "28px", border: `1px solid ${border}` }}>
                <h3 style={{ color: "#38bdf8", marginBottom: "20px", fontSize: "14px" }}>➕ Add New Supplier</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    <div>
                        <FieldLabel dark={dark}>Supplier Name</FieldLabel>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Fresh Farms" style={inputStyle(dark)} />
                    </div>
                    <div>
                        <FieldLabel dark={dark}>Contact Person</FieldLabel>
                        <input name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="e.g. John Doe" style={inputStyle(dark)} />
                    </div>
                    <div>
                        <FieldLabel dark={dark}>Phone</FieldLabel>
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. +91 9876543210" style={inputStyle(dark)} />
                    </div>
                    <div>
                        <FieldLabel dark={dark}>Email</FieldLabel>
                        <input name="email" value={form.email} onChange={handleChange} placeholder="e.g. contact@farms.com" style={inputStyle(dark)} />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                        <FieldLabel dark={dark}>Address</FieldLabel>
                        <input name="address" value={form.address} onChange={handleChange} placeholder="e.g. 123 Green Valley, Bangalore" style={inputStyle(dark)} />
                    </div>
                </div>
                <button
                    onClick={addSupplier}
                    disabled={loading}
                    style={{
                        marginTop: "20px", padding: "10px 20px", background: "#38bdf8", color: "white",
                        border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer",
                        fontSize: "13px", display: "flex", alignItems: "center", gap: "8px"
                    }}
                >
                    <FaPlus /> {loading ? "Adding..." : "Add Supplier"}
                </button>
            </div>

            {/* Suppliers List */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                {suppliers.length === 0 ? (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: muted }}>
                        No suppliers found. Add your first supplier above!
                    </div>
                ) : (
                    suppliers.map((s, i) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            style={{
                                background: card, borderRadius: "14px", padding: "20px",
                                border: `1px solid ${border}`, display: "flex", flexDirection: "column", gap: "12px"
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <h3 style={{ margin: 0, fontSize: "18px", color: "#38bdf8" }}>{s.name}</h3>
                                <button
                                    onClick={() => deleteSupplier(s.id, s.name)}
                                    style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "none", borderRadius: "6px", padding: "6px", cursor: "pointer" }}
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                                <FaUser style={{ color: muted }} />
                                <span>{s.contactPerson || "No contact"}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                                <FaPhone style={{ color: muted }} />
                                <span>{s.phone || "No phone"}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px" }}>
                                <FaEnvelope style={{ color: muted }} />
                                <span>{s.email || "No email"}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px" }}>
                                <FaMapMarkerAlt style={{ color: muted, marginTop: "3px" }} />
                                <span style={{ lineHeight: 1.4 }}>{s.address || "No address"}</span>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}

const FieldLabel = ({ dark, children }: { dark: boolean; children: React.ReactNode }) => (
    <label style={{ display: "block", color: dark ? "#94a3b8" : "#64748b", fontSize: "11px", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase" }}>
        {children}
    </label>
);

const inputStyle = (dark: boolean): React.CSSProperties => ({
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
    background: dark ? "#1e293b" : "#ffffff",
    color: dark ? "white" : "#1e293b",
    fontSize: "13px", outline: "none", boxSizing: "border-box",
});
