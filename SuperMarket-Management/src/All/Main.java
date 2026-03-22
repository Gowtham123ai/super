package All;

import javax.swing.SwingUtilities;
import javax.swing.UIManager;

public class Main {

    public static void main(String[] args) {
        // Optional: uncomment after adding FlatLaf JAR to classpath
        // try {
        //     UIManager.setLookAndFeel(new com.formdev.flatlaf.FlatLightLaf());
        // } catch (Exception e) {
        //     e.printStackTrace();
        // }

        SwingUtilities.invokeLater(() -> {
            new ModernLogin().setVisible(true);
        });
    }
}
