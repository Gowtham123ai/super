package All;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Dashboard extends JFrame {

    private JPanel mainPanel;

    public Dashboard(String role) {
        setTitle("Dashboard - " + role);
        setSize(1000, 600);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // --- Sidebar ---
        JPanel sidebar = new JPanel();
        sidebar.setBackground(new Color(34, 40, 49));
        sidebar.setPreferredSize(new Dimension(210, 600));
        sidebar.setLayout(new BoxLayout(sidebar, BoxLayout.Y_AXIS));
        sidebar.setBorder(BorderFactory.createEmptyBorder(15, 10, 10, 10));

        JLabel logo = new JLabel("🛒 SuperMarket");
        logo.setForeground(new Color(0, 173, 181));
        logo.setFont(new Font("Segoe UI", Font.BOLD, 16));
        logo.setAlignmentX(Component.CENTER_ALIGNMENT);
        logo.setBorder(BorderFactory.createEmptyBorder(10, 0, 20, 0));
        sidebar.add(logo);

        String[] menuItems = {"📊 Dashboard", "📦 Products", "💳 Billing", "🏭 Inventory", "🚚 Suppliers", "📈 Reports"};
        for (String item : menuItems) {
            JButton btn = makeSidebarButton(item);
            btn.addActionListener(e -> handleMenu(item));
            sidebar.add(btn);
            sidebar.add(Box.createRigidArea(new Dimension(0, 8)));
        }

        sidebar.add(Box.createVerticalGlue());
        JButton logoutBtn = makeSidebarButton("🚪 Logout");
        logoutBtn.setBackground(new Color(180, 50, 50));
        logoutBtn.addActionListener(e -> {
            dispose();
            new ModernLogin().setVisible(true);
        });
        sidebar.add(logoutBtn);

        // --- Header ---
        JPanel header = new JPanel(new BorderLayout());
        header.setBackground(new Color(0, 173, 181));
        header.setPreferredSize(new Dimension(800, 62));
        header.setBorder(BorderFactory.createEmptyBorder(0, 20, 0, 20));

        JLabel welcome = new JLabel("Welcome, " + role + " 👋");
        welcome.setForeground(Color.WHITE);
        welcome.setFont(new Font("Segoe UI", Font.BOLD, 20));
        header.add(welcome, BorderLayout.WEST);

        JLabel time = new JLabel(new java.util.Date().toString());
        time.setForeground(new Color(220, 255, 255));
        time.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        header.add(time, BorderLayout.EAST);

        // --- Main Panel ---
        mainPanel = new JPanel(new GridLayout(2, 3, 15, 15));
        mainPanel.setBackground(new Color(240, 245, 250));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        mainPanel.add(makeStatCard("Today's Sales", "₹ 25,000", new Color(0, 173, 181)));
        mainPanel.add(makeStatCard("Total Products", "320", new Color(57, 62, 70)));
        mainPanel.add(makeStatCard("Customers Today", "47", new Color(0, 120, 180)));
        mainPanel.add(makeStatCard("Pending Orders", "5", new Color(220, 100, 30)));
        mainPanel.add(makeStatCard("Total Revenue", "₹ 1,20,000", new Color(40, 160, 80)));
        mainPanel.add(makeStatCard("Low Stock Items", "12", new Color(180, 50, 50)));

        add(sidebar, BorderLayout.WEST);
        add(header, BorderLayout.NORTH);
        add(mainPanel, BorderLayout.CENTER);
    }

    private JButton makeSidebarButton(String text) {
        JButton btn = new JButton(text);
        btn.setMaximumSize(new Dimension(190, 40));
        btn.setMinimumSize(new Dimension(190, 40));
        btn.setPreferredSize(new Dimension(190, 40));
        btn.setBackground(new Color(57, 62, 70));
        btn.setForeground(Color.WHITE);
        btn.setFocusPainted(false);
        btn.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        btn.setBorder(BorderFactory.createEmptyBorder(8, 15, 8, 15));
        btn.setHorizontalAlignment(SwingConstants.LEFT);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btn.setAlignmentX(Component.CENTER_ALIGNMENT);
        btn.addMouseListener(new MouseAdapter() {
            public void mouseEntered(MouseEvent e) { btn.setBackground(new Color(0, 173, 181)); }
            public void mouseExited(MouseEvent e) { btn.setBackground(new Color(57, 62, 70)); }
        });
        return btn;
    }

    private JPanel makeStatCard(String label, String value, Color color) {
        JPanel card = new JPanel(new BorderLayout());
        card.setBackground(Color.WHITE);
        card.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(220, 225, 230), 1),
            BorderFactory.createEmptyBorder(20, 20, 20, 20)));

        JLabel lbl = new JLabel(label);
        lbl.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        lbl.setForeground(Color.GRAY);

        JLabel val = new JLabel(value);
        val.setFont(new Font("Segoe UI", Font.BOLD, 24));
        val.setForeground(color);

        card.add(lbl, BorderLayout.NORTH);
        card.add(val, BorderLayout.CENTER);
        return card;
    }

    private void handleMenu(String item) {
        if (item.contains("Billing")) {
            new Billing().setVisible(true);
        } else if (item.contains("Products") || item.contains("Inventory")) {
            new ManagementScreen().setVisible(true);
        }
    }
}
