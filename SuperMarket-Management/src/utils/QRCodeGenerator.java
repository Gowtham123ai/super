package utils;

import java.io.File;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

public class QRCodeGenerator {

    public static void generateQR(String upiData, String filePath) throws Exception {
        QRCodeWriter writer = new QRCodeWriter();
        BitMatrix bitMatrix = writer.encode(upiData, BarcodeFormat.QR_CODE, 300, 300);

        BufferedImage image = new BufferedImage(300, 300, BufferedImage.TYPE_INT_RGB);

        for (int x = 0; x < 300; x++) {
            for (int y = 0; y < 300; y++) {
                image.setRGB(x, y, bitMatrix.get(x, y) ? 0x000000 : 0xFFFFFF);
            }
        }

        ImageIO.write(image, "png", new File(filePath));
    }
}
