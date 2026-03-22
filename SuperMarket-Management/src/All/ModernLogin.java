package All;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import database.DBConnection;
import security.PasswordUtil;

public class ModernLogin extends JFrame {

    private JTextField txtUser;
    private JPasswordField txtPass;
    private int attempts = 3;

    public ModernLogin() {
        setTitle("SuperMarket Management System");
        setSize(500, 380);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        JPanel panel = new JPanel();
        panel.setBackground(new Color(34, 40, 49));
        panel.setLayout(null);

        JLabel title = new JLabel("🛒 SuperMarket Login");
        title.setBounds(120, 30, 280, 35);
        title.setForeground(new Color(0, 173, 181));
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        panel.add(title);

        JLabel subtitle = new JLabel("Please sign in to continue");
        subtitle.setBounds(155, 65, 220, 20);
        subtitle.setForeground(new Color(150, 150, 150));
        subtitle.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        panel.add(subtitle);

        JLabel userLabel = new JLabel("Username:");
        userLabel.setBounds(80, 110, 100, 25);
        userLabel.setForeground(Color.WHITE);
        userLabel.setFont(new Font("Segoe UI", Font.BOLD, 13));
        panel.add(userLabel);

        txtUser = new JTextField();
        txtUser.setBounds(180, 110, 200, 30);
        txtUser.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(0, 173, 181), 1),
                BorderFactory.createEmptyBorder(5, 8, 5, 8)));
        txtUser.setBackground(new Color(57, 62, 70));
        txtUser.setForeground(Color.WHITE);
        txtUser.setCaretColor(Color.WHITE);
        panel.add(txtUser);

        JLabel passLabel = new JLabel("Password:");
        passLabel.setBounds(80, 160, 100, 25);
        passLabel.setForeground(Color.WHITE);
        passLabel.setFont(new Font("Segoe UI", Font.BOLD, 13));
        panel.add(passLabel);

        txtPass = new JPasswordField();
        txtPass.setBounds(180, 160, 200, 30);
        txtPass.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(0, 173, 181), 1),
                BorderFactory.createEmptyBorder(5, 8, 5, 8)));
        txtPass.setBackground(new Color(57, 62, 70));
        txtPass.setForeground(Color.WHITE);
        txtPass.setCaretColor(Color.WHITE);
        panel.add(txtPass);

        JButton loginBtn = new JButton("LOGIN");
        loginBtn.setBounds(180, 220, 200, 38);
        loginBtn.setBackground(new Color(0, 173, 181));
        loginBtn.setForeground(Color.WHITE);
        loginBtn.setFocusPainted(false);
        loginBtn.setFont(new Font("Segoe UI", Font.BOLD, 14));
        loginBtn.setBorder(BorderFactory.createEmptyBorder());
        loginBtn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        loginBtn.addMouseListener(new MouseAdapter() {
            public void mouseEntered(MouseEvent e) {
                loginBtn.setBackground(new Color(0, 140, 148));
            }

            public void mouseExited(MouseEvent e) {
                loginBtn.setBackground(new Color(0, 173, 181));
            }
        });
        loginBtn.addActionListener(e -> doLogin());
        panel.add(loginBtn);

        // Enter key triggers login
        getRootPane().setDefaultButton(loginBtn);

        JLabel footer = new JLabel("SuperMarket Management System v2.0");
        footer.setBounds(130, 290, 280, 20);
        footer.setForeground(new Color(100, 100, 100));
        footer.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        panel.add(footer);

        add(panel);
    }

    private void doLogin() {
        String username = txtUser.getText().trim();
        String password = new String(txtPass.getPassword());

        if (username.isEmpty() || password.isEmpty()) {
            showError("Please enter username and password.");
            return;
        }

        try {
            Connection con = DBConnection.getConnection();
            if (con == null) {
                // Fallback to file-based login
                if (fileLogin(username, password)) {
                    String role = "Admin";
                    dispose();
                    new Dashboard(role).setVisible(true);
                } else {
                    showError("Invalid credentials (File Mode)!");
                }
                return;
            }
            String query = "SELECT * FROM users WHERE username=?";
            PreparedStatement ps = con.prepareStatement(query);
            ps.setString(1, username);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                String hashedPassword = rs.getString("password");
                if (PasswordUtil.checkPassword(password, hashedPassword)) {
                    String role = rs.getString("role");
                    dispose();
                    new Dashboard(role).setVisible(true);
                    return;
                }
            }

            attempts--;
            if (attempts <= 0) {
                showError("Too many failed attempts. Please contact support.");
                System.exit(0);
            } else {
                showError("Invalid credentials! " + attempts + " attempt(s) remaining.");
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            showError("Login error: " + ex.getMessage());
        }
    }

    private void showError(String msg) {
        JOptionPane.showMessageDialog(this, msg, "Login Error", JOptionPane.ERROR_MESSAGE);
    }

    private boolean fileLogin(String Username, String Password) {
        File file = new File("UsersLogin.txt");
        if (!file.exists())
            return false;
        try (java.util.Scanner input = new java.util.Scanner(file)) {
            while (input.hasNext()) {
                String data = input.nextLine();
                String[] sub_data = data.split(",");
                if (sub_data.length >= 2 && sub_data[0].trim().equals(Username)
                        && sub_data[1].trim().equals(Password)) {
                    return true;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new ModernLogin().setVisible(true));
    }
}
