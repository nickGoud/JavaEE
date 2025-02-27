package com.info5059.casestudy.purchaseorder;

import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;
import com.info5059.casestudy.product.QRCodeGenerator;
import com.info5059.casestudy.vendor.Vendor;
import com.info5059.casestudy.vendor.VendorRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;

import lombok.val;

import org.hibernate.generator.Generator;
import org.springframework.web.servlet.view.document.AbstractPdfView;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URL;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;

public abstract class PurchaseOrderPDFGenerator extends AbstractPdfView {

        private static Locale locale = Locale.of("en", "US");
        private static NumberFormat formatter = NumberFormat.getCurrencyInstance(locale);
        private static DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd h:mm a");

        private static ProductRepository productRepository;

        public static ByteArrayInputStream generatePurchaseOrder(String poid,
                        PurchaseOrderRepository purchaseOrderRepository, VendorRepository vendorRepository,
                        ProductRepository productRepository) throws IOException {

                URL imageUrl = Generator.class.getResource("/static/assets/images/truck.png");

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                PdfWriter writer = new PdfWriter(baos);
                // Initialize PDF document to be written to a stream not a file
                PdfDocument pdf = new PdfDocument(writer);
                // Document is the main object
                Document document = new Document(pdf);
                PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
                // add the image to the document
                Image img = new Image(ImageDataFactory.create(imageUrl))
                                .scaleAbsolute(200, 80)
                                // .setFixedPosition(pg.getWidth() / 2 - 60, 750)
                                .setHorizontalAlignment(HorizontalAlignment.CENTER);
                document.add(img);
                // now let's add a big heading
                // document.add(new Paragraph("\n\n"));

                Product product = new Product();

                PurchaseOrder purchaseOrder = new PurchaseOrder();

                Optional<PurchaseOrder> op = purchaseOrderRepository.findById(Long.parseLong(poid));
                if (op.isPresent()) {
                        purchaseOrder = op.get();
                }

                Vendor vendor = new Vendor();

                Optional<Vendor> ven = vendorRepository.findById(purchaseOrder.getVendorid());
                if (ven.isPresent()) {
                        vendor = ven.get();
                }

                Image qrcode = addSummaryQRCode(vendor, purchaseOrder);

                try {
                        // document.add(new Paragraph("\n"));
                        // Optional<PurchaseOrder> purchaseOrderOption =
                        // purchaseOrderRepository.findById(Long.parseLong(poid));

                        document.add(new Paragraph("\n"));
                        document.add(new Paragraph("Purchase Order #" + poid).setFont(font)
                                        .setFontSize(18)
                                        .setBold()
                                        .setHorizontalAlignment(HorizontalAlignment.RIGHT));

                        document.add(new Paragraph("\n\n"));

                        // Vendor details
                        Table vendorTable = new Table(2)
                                        .setWidth(new UnitValue(UnitValue.PERCENT, 30))
                                        .setHorizontalAlignment(HorizontalAlignment.LEFT);

                        Cell vendorCell = new Cell()
                                        .add(new Paragraph("Vendor:")
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setBold())
                                        .setBorder(Border.NO_BORDER);
                        vendorTable.addCell(vendorCell);

                        vendorCell = new Cell()
                                        .add(new Paragraph(vendorRepository.findById(purchaseOrder.getVendorid()).get()
                                                        .getName())
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setBold())
                                        .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                                        .setBorder(Border.NO_BORDER);
                        vendorTable.addCell(vendorCell);
                        vendorTable.addCell(new Cell().setBorder(Border.NO_BORDER));

                        vendorCell = new Cell()
                                        .add(new Paragraph(vendorRepository.findById(purchaseOrder.getVendorid()).get()
                                                        .getAddress1())
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setBold())
                                        .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                                        .setBorder(Border.NO_BORDER);
                        vendorTable.addCell(vendorCell);
                        vendorTable.addCell(new Cell().setBorder(Border.NO_BORDER));

                        vendorCell = new Cell()
                                        .add(new Paragraph(vendorRepository.findById(purchaseOrder.getVendorid()).get()
                                                        .getProvince())
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setBold())
                                        .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                                        .setBorder(Border.NO_BORDER);
                        vendorTable.addCell(vendorCell);
                        vendorTable.addCell(new Cell().setBorder(Border.NO_BORDER));

                        vendorCell = new Cell()
                                        .add(new Paragraph(vendorRepository.findById(purchaseOrder.getVendorid()).get()
                                                        .getCity())
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setBold())
                                        .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                                        .setBorder(Border.NO_BORDER);
                        vendorTable.addCell(vendorCell);
                        vendorTable.addCell(new Cell().setBorder(Border.NO_BORDER));

                        vendorCell = new Cell()
                                        .add(new Paragraph(vendorRepository.findById(purchaseOrder.getVendorid()).get()
                                                        .getEmail())
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setBold())
                                        .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                                        .setBorder(Border.NO_BORDER);
                        vendorTable.addCell(vendorCell);
                        vendorTable.addCell(new Cell().setBorder(Border.NO_BORDER));

                        document.add(vendorTable);
                        document.add(new Paragraph("\n\n"));

                        // Purchase details
                        Table purchaseorderTable = new Table(5)
                                        .setWidth(UnitValue.createPercentValue(100));
                        Cell purchaseorderCell = new Cell();

                        // Product Code
                        purchaseorderCell = new Cell()
                                        .add(new Paragraph("ID")
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setBold())
                                        .setTextAlignment(TextAlignment.CENTER);
                        purchaseorderTable.addCell(purchaseorderCell);

                        // Description
                        purchaseorderCell = new Cell()
                                        .add(new Paragraph("Description")
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setBold())
                                        .setTextAlignment(TextAlignment.CENTER);
                        purchaseorderTable.addCell(purchaseorderCell);

                        // Qty Sold
                        purchaseorderCell = new Cell()
                                        .add(new Paragraph("Qty Sold")
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setBold())
                                        .setTextAlignment(TextAlignment.CENTER);
                        purchaseorderTable.addCell(purchaseorderCell);

                        // Price
                        purchaseorderCell = new Cell()
                                        .add(new Paragraph("Price")
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setBold())
                                        .setTextAlignment(TextAlignment.CENTER);
                        purchaseorderTable.addCell(purchaseorderCell);

                        // Ext. Price
                        purchaseorderCell = new Cell()
                                        .add(new Paragraph("Ext. Price")
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setBold())
                                        .setTextAlignment(TextAlignment.CENTER);
                        purchaseorderTable.addCell(purchaseorderCell);

                        BigDecimal subTotal = new BigDecimal(0);

                        // CONTENTS
                        for (PurchaseOrderLineitem line : purchaseOrder.getItems()) {
                                Optional<Product> optx = productRepository.findById(line.getProductid());
                                if (optx.isPresent()) {
                                        product = optx.get();
                                }

                                // PRODUCT CODE
                                purchaseorderCell = new Cell()
                                                .add(new Paragraph(line.getProductid())
                                                                .setFont(font)
                                                                .setFontSize(12)
                                                                .setTextAlignment(TextAlignment.CENTER));
                                purchaseorderTable.addCell(purchaseorderCell);

                                // DESCRIPTION
                                purchaseorderCell = new Cell()
                                                .add(new Paragraph(product.getName())
                                                                .setFont(font)
                                                                .setFontSize(12)
                                                                .setTextAlignment(TextAlignment.CENTER));
                                purchaseorderTable.addCell(purchaseorderCell);

                                // QTY SOLD
                                purchaseorderCell = new Cell()
                                                .add(new Paragraph(line.getQty() + "")
                                                                .setFont(font)
                                                                .setFontSize(12)
                                                                .setTextAlignment(TextAlignment.RIGHT));
                                purchaseorderTable.addCell(purchaseorderCell);

                                // PRICE
                                purchaseorderCell = new Cell()
                                                .add(new Paragraph(formatter.format(product.getCostprice()))
                                                                .setFont(font)
                                                                .setFontSize(12)
                                                                .setTextAlignment(TextAlignment.RIGHT));
                                purchaseorderTable.addCell(purchaseorderCell);

                                // EXT. PRICE CALCS
                                BigDecimal lineTotal = BigDecimal.ZERO;

                                lineTotal = line.getPrice().multiply(BigDecimal.valueOf(line.getQty()));

                                // EXT. PRICE
                                purchaseorderCell = new Cell()
                                                .add(new Paragraph(
                                                                formatter.format(lineTotal))
                                                                .setFont(font)
                                                                .setFontSize(12)
                                                                .setTextAlignment(TextAlignment.RIGHT));
                                purchaseorderTable.addCell(purchaseorderCell);

                                subTotal = subTotal.add(lineTotal);

                        }

                        purchaseorderTable.addCell(new Cell(3, 3).setBorder(Border.NO_BORDER));

                        // SUB TOTAL
                        purchaseorderCell = new Cell()
                                        .add(new Paragraph("Sub Total:")
                                                        .setFont(font)
                                                        .setFontSize(12))
                                        .setTextAlignment(TextAlignment.RIGHT)
                                        .setBorder(Border.NO_BORDER);
                        purchaseorderTable.addCell(purchaseorderCell);
                        purchaseorderCell = new Cell()
                                        .add(new Paragraph(formatter.format(subTotal))
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setTextAlignment(TextAlignment.RIGHT));
                        purchaseorderTable.addCell(purchaseorderCell);

                        // TAX
                        purchaseorderCell = new Cell()
                                        .add(new Paragraph("Tax:")
                                                        .setFont(font)
                                                        .setFontSize(12))
                                        .setTextAlignment(TextAlignment.RIGHT)
                                        .setBorder(Border.NO_BORDER);
                        purchaseorderTable.addCell(purchaseorderCell);
                        purchaseorderCell = new Cell()
                                        .add(new Paragraph(
                                                        formatter.format(subTotal.multiply(BigDecimal.valueOf(0.13))))
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setTextAlignment(TextAlignment.RIGHT));
                        purchaseorderTable.addCell(purchaseorderCell);

                        // PO TOTAL
                        purchaseorderCell = new Cell()
                                        .add(new Paragraph("PO Total:")
                                                        .setFont(font)
                                                        .setFontSize(12))
                                        .setTextAlignment(TextAlignment.RIGHT)
                                        .setBorder(Border.NO_BORDER);
                        purchaseorderTable.addCell(purchaseorderCell);
                        purchaseorderCell = new Cell()
                                        .add(new Paragraph(
                                                        formatter.format(subTotal.multiply(BigDecimal.valueOf(1.13))))
                                                        .setFont(font)
                                                        .setFontSize(12)
                                                        .setTextAlignment(TextAlignment.RIGHT))
                                        .setBackgroundColor(ColorConstants.YELLOW);
                        purchaseorderTable.addCell(purchaseorderCell);

                        document.add(purchaseorderTable);

                        document.add(new Paragraph("\n\n"));
                        document.add(new Paragraph(dateFormatter.format(purchaseOrder.getPodate()))
                                        .setTextAlignment(TextAlignment.CENTER));

                        document.add(qrcode);

                        document.close();

                } catch (Exception ex) {
                        System.out.println(ex.getMessage());
                }

                return new ByteArrayInputStream(baos.toByteArray());
        }

        private static Image addSummaryQRCode(Vendor vendor, PurchaseOrder purchaseOrder) {
                String str = "Summary for Purchase Order:" + purchaseOrder.getId() + "\nDate:"
                                + dateFormatter.format(purchaseOrder.getPodate()) + "\nVendor:"
                                + vendor.getName()
                                + "\nTotal:" + formatter.format(purchaseOrder.getAmount());

                byte[] qrcodebin = new QRCodeGenerator().generateQRCode(str);

                Image qrcode = new Image(ImageDataFactory.create(qrcodebin))
                                .scaleAbsolute(100, 100)
                                .setFixedPosition(460, 60);

                return qrcode;

        }
}
