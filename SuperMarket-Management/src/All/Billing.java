package All;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import utils.QRCodeGenerator;

public class Billing extends JFrame {

    private JTextField txtName, txtPrice, txtGST, txtQty, txtTotal;

    public Billing() {
        setTitle("Billing System");
        setSize(800, 560);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLayout(new BorderLayout());

        // --- Top Header ---
        JPanel topPanel = new JPanel(new BorderLayout());
        topPanel.setBackground(new Color(0, 173, 181));
        topPanel.setPreferredSize(new Dimension(800, 60));
        topPanel.setBorder(BorderFactory.createEmptyBorder(10, 20, 10, 20));

        JLabel heading = new JLabel("💳 Billing System");
        heading.setForeground(Color.WHITE);
        heading.setFont(new Font("Segoe UI", Font.BOLD, 22));
        topPanel.add(heading, BorderLayout.WEST);

        // --- Form Panel ---
        JPanel formPanel = new JPanel(new GridLayout(6, 2, 12, 12));
        formPanel.setBackground(new Color(245, 248, 252));
        formPanel.setBorder(BorderFactory.createEmptyBorder(30, 60, 20, 60));

        formPanel.add(makeLabel("Product Name:"));
        txtName = makeField();
        formPanel.add(txtName);

        formPanel.add(makeLabel("Price (₹):"));
        txtPrice = makeField();
        formPanel.add(txtPrice);

        formPanel.add(makeLabel("GST %:"));
        txtGST = makeField();
        formPanel.add(txtGST);

        formPanel.add(makeLabel("Quantity:"));
        txtQty = makeField();
        formPanel.add(txtQty);

        formPanel.add(makeLabel("Total Amount (₹):"));
        txtTotal = makeField();
        txtTotal.setEditable(false);
        txtTotal.setBackground(new Color(230, 250, 255));
        formPanel.add(txtTotal);

        // --- Buttons ---
        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 20, 10));
        btnPanel.setBackground(new Color(245, 248, 252));

        JButton calculateBtn = makeButton("🧮 Calculate", new Color(0, 173, 181));
        calculateBtn.addActionListener(e -> calculateBill());

        JButton qrBtn = makeButton("📱 Generate UPI QR", new Color(34, 40, 49));
        qrBtn.addActionListener(e -> generateQR());

        JButton clearBtn = makeButton("🗑️ Clear", new Color(180, 50, 50));
        clearBtn.addActionListener(e -> clearFields());

        btnPanel.add(calculateBtn);
        btnPanel.add(qrBtn);
        btnPanel.add(clearBtn);

        formPanel.add(new JLabel()); // spacer
        formPanel.add(new JLabel()); // spacer

        add(topPanel, BorderLayout.NORTH);
        add(formPanel, BorderLayout.CENTER);
        add(btnPanel, BorderLayout.SOUTH);
    }

    private JLabel makeLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 13));
        lbl.setForeground(new Color(50, 50, 70));
        return lbl;
    }

    private JTextField makeField() {
        JTextField field = new JTextField();
        field.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        field.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(0, 173, 181), 1),
            BorderFactory.createEmptyBorder(5, 8, 5, 8)));
        return field;
    }

    private JButton makeButton(String text, Color bg) {
        JButton btn = new JButton(text);
        btn.setBackground(bg);
        btn.setForeground(Color.WHITE);
        btn.setFocusPainted(false);
        btn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btn.setBorder(BorderFactory.createEmptyBorder(10, 20, 10, 20));
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    private void calculateBill() {
        try {
            double price = Double.parseDouble(txtPrice.getText());
            double gstPercent = Double.parseDouble(txtGST.getText());
            int qty = Integer.parseInt(txtQty.getText());

            double gstAmount = (price * gstPercent) / 100.0;
            double total = (price + gstAmount) * qty;

            txtTotal.setText(String.format("%.2f", total));
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, "Please enter valid numbers.", "Input Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void generateQR() {
        String totalStr = txtTotal.getText();
        if (totalStr.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please calculate total first!", "Error", JOptionPane.WARNING_MESSAGE);
            return;
        }
        try {
            String upi = "upi://pay?pa=merchant@upi&pn=SuperMarket&am=" + totalStr + "&cu=INR";
            QRCodeGenerator.generateQR(upi, "payment.png");
            JOptionPane.showMessageDialog(this, "✅ UPI QR Code saved as payment.png", "Success", JOptionPane.INFORMATION_MESSAGE);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error generating QR: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void clearFields() {
        txtName.setText("");
        txtPrice.setText("");
        txtGST.setText("");
        txtQty.setText("");
        txtTotal.setText("");
    }
}
