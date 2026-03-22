import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { FaTrash, FaPlus } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

interface Product {
    id?: number;
    barcode: string;
    name: string;
    price: number;
    gstPercent: number;
    stock: number;
}

const empty: Product = { barcode: "", name: "", price: 0, gstPercent: 18, stock: 0 };

const MOCK_PRODUCTS: Product[] = [
    { id: 1, barcode: "8901234567890", name: "Fresh Milk 1L", price: 65, gstPercent: 5, stock: 45 },
    { id: 2, barcode: "8901111222333", name: "Brown Bread", price: 40, gstPercent: 0, stock: 12 },
    { id: 3, barcode: "8904445556667", name: "Amul Butter 500g", price: 275, gstPercent: 12, stock: 30 },
    { id: 4, barcode: "8907778889990", name: "Basmati Rice 5kg", price: 850, gstPercent: 5, stock: 8 },
    { id: 5, barcode: "8905556667771", name: "Maggi Noodles Pk", price: 156, gstPercent: 12, stock: 120 },
];

const Products = () => {
    const { dark } = useTheme();
    const [products, setProducts] = useState<Product[]>([]);
    const [form, setForm] = useState<Product>(empty);
    const [loading, setLoading] = useState(false);

    const bg = dark ? "#1e293b" : "#ffffff";
    const card = dark ? "#0f172a" : "#f8fafc";
    const text = dark ? "white" : "#1e293b";
    const muted = dark ? "#64748b" : "#94a3b8";
    const border = dark ? "#334155" : "#e2e8f0";

    const fetchProducts = async () => {
        try {
            const res = await axios.get<Product[]>(`${API}/products`);
            setProducts(res.data);
            if (res.data.length === 0) {
                // Initialize with mock data if DB is empty for demo purposes
                await Promise.all(MOCK_PRODUCTS.map(p => axios.post(`${API}/products`, p)));
                const retry = await axios.get<Product[]>(`${API}/products`);
                setProducts(retry.data);
            }
        } catch {
            console.warn("Backend unavailable, using mock data.");
            setProducts(MOCK_PRODUCTS);
            toast.error("Using Mock Data: Backend connection failed.");
        }
    };


    useEffect(() => { fetchProducts(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.type === "number" ? +e.target.value : e.target.value }));

    const handleAdd = async () => {
        if (!form.barcode || !form.name) { toast.error("Barcode and Name are required"); return; }
        try {
            setLoading(true);
            await axios.post(`${API}/products`, form);
            toast.success(`✅ ${form.name} added!`);
            setForm(empty);
            fetchProducts();
        } catch {
            toast.error("Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        try {
            await axios.delete(`${API}/products/${id}`);
            toast.success(`🗑️ ${name} deleted`);
            fetchProducts();
        } catch {
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
            <h1 style={{ margin: "0 0 4px", fontSize: "24px" }}>📦 Products</h1>
            <p style={{ color: muted, marginBottom: "28px", fontSize: "14px" }}>
                Manage your product catalogue with barcode, price, and GST info.
            </p>

            {/* Add Product Form */}
            <div style={{ background: card, borderRadius: "16px", padding: "24px", marginBottom: "28px", border: `1px solid ${border}` }}>
                <h3 style={{ color: "#38bdf8", marginBottom: "20px", fontSize: "14px" }}>➕ Add New Product</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr) auto", gap: "12px", alignItems: "end" }}>
                    {(["barcode", "name", "price", "gstPercent", "stock"] as const).map((field) => (
                        <div key={field}>
                            <label style={{ display: "block", color: muted, fontSize: "11px", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase" }}>
                                {field === "gstPercent" ? "GST %" : field}
                            </label>
                            <input
                                name={field}
                                type={["price", "gstPercent", "stock"].includes(field) ? "number" : "text"}
                                value={form[field as keyof Product] as string | number}
                                onChange={handleChange}
                                placeholder={field}
                                style={{
                                    width: "100%", padding: "9px 12px", borderRadius: "8px",
                                    border: `1px solid ${border}`, background: dark ? "#1e293b" : "#ffffff",
                                    color: text, fontSize: "13px", outline: "none", boxSizing: "border-box",
                                }}
                            />
                        </div>
                    ))}
                    <button
                        onClick={handleAdd}
                        disabled={loading}
                        style={{
                            padding: "9px 18px", background: "#38bdf8", color: "white",
                            border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer",
                            fontSize: "13px", display: "flex", alignItems: "center", gap: "6px",
                        }}
                    >
                        <FaPlus /> Add
                    </button>
                </div>
            </div>

            {/* Product Table */}
            <div style={{ background: card, borderRadius: "16px", border: `1px solid ${border}`, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                    <thead>
                        <tr style={{ background: dark ? "#0a111e" : "#e2e8f0" }}>
                            {["Barcode", "Name", "Price (₹)", "GST %", "Stock", "Action"].map((h) => (
                                <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: muted, fontWeight: 600, fontSize: "12px", textTransform: "uppercase" }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: muted }}>No products found. Add one above!</td></tr>
                        ) : products.map((p, i) => (
                            <motion.tr
                                key={p.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.04 }}
                                style={{ borderTop: `1px solid ${border}` }}
                            >
                                <td style={{ padding: "13px 16px", color: "#38bdf8", fontFamily: "monospace" }}>{p.barcode}</td>
                                <td style={{ padding: "13px 16px", fontWeight: 500 }}>{p.name}</td>
                                <td style={{ padding: "13px 16px" }}>₹ {p.price}</td>
                                <td style={{ padding: "13px 16px" }}>{p.gstPercent}%</td>
                                <td style={{ padding: "13px 16px" }}>
                                    <span style={{
                                        padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                                        background: p.stock > 20 ? "rgba(52,211,153,0.15)" : "rgba(251,146,60,0.15)",
                                        color: p.stock > 20 ? "#34d399" : "#fb923c",
                                    }}>{p.stock}</span>
                                </td>
                                <td style={{ padding: "13px 16px" }}>
                                    <button
                                        onClick={() => handleDelete(p.id!, p.name)}
                                        style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "none", borderRadius: "8px", padding: "7px 12px", cursor: "pointer", fontSize: "13px" }}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default Products;
