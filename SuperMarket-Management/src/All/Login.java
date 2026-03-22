package All;

import java.awt.EventQueue;
import java.awt.Font;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import java.awt.event.ActionListener;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;
import java.awt.event.ActionEvent;
import javax.swing.ImageIcon;
import java.awt.Color;
import javax.swing.JPasswordField;
import javax.swing.SwingConstants;
import java.awt.Toolkit;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import database.DBConnection;
import security.PasswordUtil;

@SuppressWarnings("unused")
public class Login extends JFrame {

	private JFrame frmLogin;
	private JTextField usrname;
	int attempts = 3;
	private JPasswordField psw;

	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					Login window = new Login();
					window.frmLogin.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	public Login() {
		initialize();
	}

	void initialize() {
		frmLogin = new JFrame();
		frmLogin.setResizable(false);
		File logoImage = new File("project_logo.png");
		String imagePath = logoImage.getPath();
		frmLogin.setIconImage(Toolkit.getDefaultToolkit().getImage(imagePath));
		frmLogin.setFont(new Font("Serif", Font.BOLD, 14));
		frmLogin.setTitle("Login");
		frmLogin.getContentPane().setBackground(Color.WHITE);
		frmLogin.setBounds(620, 280, 600, 400);
		frmLogin.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frmLogin.getContentPane().setLayout(null);

		JLabel lblWelcomeToHitpos = new JLabel("welcome to HiTPOS");
		lblWelcomeToHitpos.setFont(new Font("Rockwell Nova Extra Bold", Font.BOLD, 20));
		lblWelcomeToHitpos.setBounds(159, 13, 303, 51);
		frmLogin.getContentPane().add(lblWelcomeToHitpos);

		JLabel lblPleaseSignIn = new JLabel("Please sign in");
		lblPleaseSignIn.setFont(new Font("Tahoma", Font.BOLD, 13));
		lblPleaseSignIn.setBounds(39, 81, 139, 41);
		frmLogin.getContentPane().add(lblPleaseSignIn);

		JLabel lblUsername = new JLabel("Username");
		lblUsername.setFont(new Font("Tahoma", Font.BOLD, 13));
		lblUsername.setBounds(12, 123, 121, 33);
		frmLogin.getContentPane().add(lblUsername);

		JLabel lblPassword = new JLabel("Password");
		lblPassword.setFont(new Font("Tahoma", Font.BOLD, 13));
		lblPassword.setBounds(12, 157, 75, 24);
		frmLogin.getContentPane().add(lblPassword);

		usrname = new JTextField();
		usrname.setBounds(107, 128, 116, 22);
		frmLogin.getContentPane().add(usrname);
		usrname.setColumns(10);

		JCheckBox chckbxShowPassword = new JCheckBox("Show Password");
		chckbxShowPassword.setFont(new Font("Tahoma", Font.BOLD, 13));
		chckbxShowPassword.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				if (chckbxShowPassword.isSelected()) {
					psw.setEchoChar((char) 0);
				} else {
					psw.setEchoChar('*');
				}
			}
		});
		chckbxShowPassword.setBackground(Color.WHITE);
		chckbxShowPassword.setBounds(107, 200, 139, 25);
		frmLogin.getContentPane().add(chckbxShowPassword);

		JButton btnLogin = new JButton("Login");
		btnLogin.setFont(new Font("Tahoma", Font.BOLD, 13));
		btnLogin.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent arg0) {
				String username = usrname.getText();
				String password = new String(psw.getPassword());

				try {
					Connection con = DBConnection.getConnection();
					if (con == null) {
						// Fallback to file-based login
						if (login(username, password)) {
							String role = "Admin"; // Default role for file-based login
							JOptionPane.showMessageDialog(frmLogin, "Mode: File Storage. Login Success! Role: " + role);
							Dashboard dash = new Dashboard(role);
							frmLogin.setVisible(false);
							dash.setVisible(true);
						} else {
							attempts--;
							JOptionPane.showMessageDialog(frmLogin,
									"Invalid credentials (File Mode)! " + attempts + " attempts remaining");
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
							JOptionPane.showMessageDialog(frmLogin, "Login Success! Role: " + role);

							Dashboard dash = new Dashboard(role);
							frmLogin.setVisible(false);
							dash.setVisible(true);
						} else {
							attempts--;
							JOptionPane.showMessageDialog(frmLogin,
									"Invalid password! " + attempts + " attempts remaining");
						}
					} else {
						attempts--;
						JOptionPane.showMessageDialog(frmLogin, "User not found! " + attempts + " attempts remaining");
					}

					if (attempts == 0) {
						JOptionPane.showMessageDialog(frmLogin, "Please Contact maintenance");
						System.exit(0);
					}

				} catch (Exception e) {
					e.printStackTrace();
					JOptionPane.showMessageDialog(frmLogin, "Error during login: " + e.getMessage());
				}
			}
		});
		btnLogin.setBounds(39, 240, 116, 41);
		frmLogin.getContentPane().add(btnLogin);

		JButton btnCancel = new JButton("Exit");
		btnCancel.setFont(new Font("Tahoma", Font.BOLD, 13));
		btnCancel.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				System.exit(0);
				;
			}
		});
		btnCancel.setBounds(183, 240, 121, 41);
		frmLogin.getContentPane().add(btnCancel);

		JLabel lblPicture = new JLabel("");
		// File logoImage = new File("project_logo.png");
		// String imagePath = logoImage.getPath();
		lblPicture.setIcon(new ImageIcon(imagePath));
		lblPicture.setBounds(235, 67, 356, 291);
		frmLogin.getContentPane().add(lblPicture);

		psw = new JPasswordField();
		psw.setBounds(105, 158, 118, 22);
		frmLogin.getContentPane().add(psw);

		JButton btnNewButton = new JButton("");
		btnNewButton.setForeground(Color.WHITE);
		btnNewButton.addActionListener(new ActionListener() {
			@SuppressWarnings("static-access")
			public void actionPerformed(ActionEvent arg0) {
				JOptionPane jopt = new JOptionPane();
				String result;
				result = "Please Call Maintenance";
				JLabel resLabel = new JLabel(result);
				resLabel.setFont(new Font("Monospaced", Font.BOLD, 18));
				jopt.showMessageDialog(null, resLabel);

			}
		});
		btnNewButton.setBackground(Color.WHITE);
		// btnNewButton.setIcon(new
		// ImageIcon(Login.class.getResource("/com/sun/javafx/scene/control/skin/caspian/dialog-information.png")));
		btnNewButton.setBounds(533, 13, 37, 41);
		frmLogin.getContentPane().add(btnNewButton);
	}

	@SuppressWarnings("unused")
	private static boolean login(String Username, String Password) {
		File file = new File("UsersLogin.txt");
		try {
			@SuppressWarnings("resource")
			Scanner input = new Scanner(file);
			String data;
			String[] sub_data;

			while (input.hasNext()) {
				data = input.nextLine();
				sub_data = data.split(",");

				if (sub_data[0].equals(Username) && sub_data[1].equals(Password)) {
					return true;
				} else
					return false;
			}
		}

		catch (IOException e) {
			System.out.println("Error" + e);
		}

		return false;
	}

}