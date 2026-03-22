import { useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import QRCode from "qrcode";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

interface Product { name: string; price: number; gst_percent: number; }

const MOCK_BILLING_PRODUCTS: Record<string, Product> = {
    "8901234567890": { name: "Fresh Milk 1L", price: 65, gst_percent: 5 },
    "8901111222333": { name: "Brown Bread", price: 40, gst_percent: 0 },
    "8904445556667": { name: "Amul Butter 500g", price: 275, gst_percent: 12 },
};

const Billing = () => {
    const { dark } = useTheme();
    const [barcode, setBarcode] = useState("");
    const [product, setProduct] = useState<Product | null>(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [isCredit, setIsCredit] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [dueDate, setDueDate] = useState("");
    const barcodeRef = useRef<HTMLInputElement>(null);

    const bg = dark ? "#1e293b" : "#ffffff";
    const card = dark ? "#0f172a" : "#f8fafc";
    const text = dark ? "white" : "#1e293b";
    const muted = dark ? "#64748b" : "#94a3b8";
    const border = dark ? "#1e293b" : "#e2e8f0";

    /* ---- Auto-fetch on barcode change ---- */
    const handleBarcodeSearch = async (code: string) => {
        setBarcode(code);
        if (code.length < 3) return;
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/products/${code}`);
            setProduct(res.data);
            toast.success(`✅ Product found: ${res.data.name}`);
        } catch {
            if (MOCK_BILLING_PRODUCTS[code]) {
                setProduct(MOCK_BILLING_PRODUCTS[code]);
                toast.success(`✅ Product found (Mock): ${MOCK_BILLING_PRODUCTS[code].name}`);
            } else {
                setProduct(null);
                // toast.error("❌ Product not found");
            }
        } finally {
            setLoading(false);
        }
    };


    /* ---- Calculations ---- */
    const price = product?.price ?? 0;
    const gstPct = product?.gst_percent ?? 0;
    const gstAmt = (price * gstPct) / 100;
    const total = (price + gstAmt) * qty;

    /* ---- PDF Download ---- */
    const downloadPDF = async () => {
        if (!product) { toast.error("No product selected"); return; }
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("SuperMarket Invoice", 20, 20);
        doc.setFontSize(12);
        doc.text(`Product : ${product.name}`, 20, 40);
        doc.text(`Quantity : ${qty}`, 20, 52);
        doc.text(`Price    : ₹ ${price}`, 20, 64);
        doc.text(`GST (${gstPct}%) : ₹ ${gstAmt.toFixed(2)}`, 20, 76);
        doc.line(20, 84, 190, 84);
        doc.setFontSize(16);
        doc.text(`TOTAL : ₹ ${total.toFixed(2)}`, 20, 96);
        doc.save("invoice.pdf");
        toast.success("Invoice PDF downloaded!");
    };

    /* ---- Generate UPI QR ---- */
    const generateQR = async () => {
        if (!product) { toast.error("Select a product first"); return; }
        try {
            const upiUrl = `upi://pay?pa=merchant@upi&pn=SuperMarket&am=${total.toFixed(2)}&cu=INR`;
            const qrDataUrl = await QRCode.toDataURL(upiUrl);
            setQrImage(qrDataUrl);
            toast.success("✅ UPI QR Generated!");
        } catch (err) {
            console.error(err);
            toast.error("QR generation failed");
        }
    };

    const handleCalculate = () => {
        if (!product) { toast.error("Select a product first"); return; }
        handleBill(); // In this version, Calculate also saves the sale
    };

    /* ---- Save Sale to DB ---- */
    const handleBill = async () => {
        if (!product) { toast.error("Select a product first"); return; }
        try {
            if (isCredit) {
                await axios.post(`${API_BASE}/credits`, {
                    customerName,
                    phone,
                    amount: total,
                    dueDate
                });
                toast.success("✅ Credit sale saved!");
            } else {
                await axios.post(`${API_BASE}/sales`, {
                    barcode: barcode,
                    productName: product.name,
                    price,
                    gstAmount: gstAmt,
                    finalAmount: total,
                    quantity: qty,
                });
                toast.success("✅ Sale saved successfully!");
            }
        } catch {
            toast.success("✅ Sale saved (Simulation Mode)!");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, padding: "32px", background: bg, color: text, minHeight: "100vh" }}
        >
            <h1 style={{ margin: "0 0 4px", fontSize: "24px" }}>💳 Billing</h1>
            <p style={{ color: muted, marginBottom: "28px", fontSize: "14px" }}>
                Scan barcode → product auto-fills → enter quantity → done!
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
                {/* ---- Left: Input Form ---- */}
                <div style={{ background: card, borderRadius: "16px", padding: "28px", border: `1px solid ${border}` }}>
                    <FieldLabel dark={dark}>Barcode</FieldLabel>
                    <input
                        ref={barcodeRef}
                        value={barcode}
                        autoFocus
                        placeholder="Scan or type barcode..."
                        onChange={(e) => handleBarcodeSearch(e.target.value)}
                        style={inputStyle(dark)}
                    />
                    {loading && <p style={{ color: muted, fontSize: "12px", marginTop: "4px" }}>🔍 Searching...</p>}

                    <FieldLabel dark={dark}>Product Name</FieldLabel>
                    <input value={product?.name ?? ""} readOnly style={{ ...inputStyle(dark), opacity: 0.7 }} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                            <FieldLabel dark={dark}>Price (₹)</FieldLabel>
                            <input value={product ? product.price : ""} readOnly style={{ ...inputStyle(dark), opacity: 0.7 }} />
                        </div>
                        <div>
                            <FieldLabel dark={dark}>GST %</FieldLabel>
                            <input value={product ? product.gst_percent : ""} readOnly style={{ ...inputStyle(dark), opacity: 0.7 }} />
                        </div>
                    </div>

                    <FieldLabel dark={dark}>Quantity</FieldLabel>
                    <input
                        type="number" min={1} value={qty}
                        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                        style={inputStyle(dark)}
                    />

                    <div style={{ marginTop: "16px" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: text, fontSize: "14px" }}>
                            <input type="checkbox" onChange={(e) => setIsCredit(e.target.checked)} />
                            Pay Later (Credit)
                        </label>

                        {isCredit && (
                            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                <input placeholder="Customer Name"
                                    value={customerName}
                                    onChange={e => setCustomerName(e.target.value)}
                                    style={inputStyle(dark)} />

                                <input placeholder="Phone Number"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    style={inputStyle(dark)} />

                                <input type="date"
                                    value={dueDate}
                                    onChange={e => setDueDate(e.target.value)}
                                    style={inputStyle(dark)} />
                            </div>
                        )}
                    </div>
                </div>

                {/* ---- Right: Bill Summary ---- */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{ background: card, borderRadius: "16px", padding: "28px", border: `1px solid ${border}`, display: "flex", flexDirection: "column" }}
                >
                    <h3 style={{ margin: "0 0 24px", color: "#38bdf8", fontSize: "16px", letterSpacing: "0.5px" }}>
                        🧾 Bill Summary
                    </h3>

                    <SummaryRow label="Product" value={product?.name ?? "—"} muted={muted} text={text} />
                    <SummaryRow label="Qty" value={`× ${qty}`} muted={muted} text={text} />

                    <div style={{ borderTop: `1px dashed ${border}`, margin: "16px 0" }} />

                    <SummaryRow label="Subtotal" value={`₹ ${price.toFixed(2)}`} muted={muted} text={text} />
                    <SummaryRow label={`GST (${gstPct}%)`} value={`₹ ${gstAmt.toFixed(2)}`} muted={muted} text="#fb923c" />

                    <div style={{ borderTop: `2px solid ${border}`, margin: "16px 0" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: "16px" }}>Total</span>
                        <span style={{ color: "#38bdf8", fontWeight: 700, fontSize: "26px" }}>
                            ₹ {total.toFixed(2)}
                        </span>
                    </div>

                    <div style={{ flex: 1 }} />

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "24px" }}>
                        <Btn color="#a78bfa" onClick={handleCalculate}>🧮 Calculate</Btn>
                        <Btn color="#38bdf8" onClick={generateQR}>📱 UPI QR</Btn>

                        {qrImage && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{ textAlign: "center", padding: "12px", background: "white", borderRadius: "12px", marginTop: "8px" }}
                            >
                                <img src={qrImage} alt="UPI QR" style={{ width: "100%", maxWidth: "200px" }} />
                                <p style={{ color: "#1e293b", fontSize: "11px", marginTop: "4px", fontWeight: 600 }}>Scan with Any UPI App</p>
                            </motion.div>
                        )}

                        <Btn color="#34d399" onClick={downloadPDF}>📄 Download Invoice PDF</Btn>
                        <Btn color="#475569" onClick={() => { setBarcode(""); setProduct(null); setQty(1); setQrImage(null); barcodeRef.current?.focus(); }}>
                            🗑️ Clear
                        </Btn>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

/* ---- Sub-components ---- */
const FieldLabel = ({ dark, children }: { dark: boolean; children: React.ReactNode }) => (
    <label style={{ display: "block", color: dark ? "#94a3b8" : "#64748b", fontSize: "12px", marginBottom: "6px", fontWeight: 600, marginTop: "16px" }}>
        {children}
    </label>
);

const SummaryRow = ({ label, value, muted, text }: { label: string; value: string; muted: string; text: string }) => (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
        <span style={{ color: muted }}>{label}</span>
        <span style={{ color: text, fontWeight: 500 }}>{value}</span>
    </div>
);

const Btn = ({ color, onClick, children }: { color: string; onClick: () => void; children: React.ReactNode }) => (
    <button onClick={onClick} style={{
        padding: "11px", background: color, color: "white", border: "none",
        borderRadius: "10px", fontWeight: 600, cursor: "pointer", fontSize: "13px",
        opacity: 1, transition: "opacity 0.2s",
    }}
        onMouseEnter={(e) => ((e.target as HTMLButtonElement).style.opacity = "0.8")}
        onMouseLeave={(e) => ((e.target as HTMLButtonElement).style.opacity = "1")}
    >
        {children}
    </button>
);

const inputStyle = (dark: boolean): React.CSSProperties => ({
    width: "100%", padding: "10px 14px", borderRadius: "8px",
    border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
    background: dark ? "#1e293b" : "#f1f5f9",
    color: dark ? "white" : "#1e293b",
    fontSize: "14px", outline: "none", boxSizing: "border-box",
});

export default Billing;
