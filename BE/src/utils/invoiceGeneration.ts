import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from "fs"

const invoiceDir = "./invoices";
if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir);
}

export async function generateRentInvoice(data: {
    receiptNo: string;
    orderId: string;
    date: Date;
    tenantName: string;
    propertyAddress: string;
    monthsPaid: string;
    monthlyRent: string;
    totalRent: string;
    paymentMode: string;
    transactionId: string;
}) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // Landscape A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Load Logo & Signature
    const logoBytes = fs.readFileSync("./logo.png");
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const signatureBytes = fs.readFileSync("./signature.png");
    const signatureImage = await pdfDoc.embedPng(signatureBytes);

    const fontSize = 14;
    const pageWidth = 842;
    const pageHeight = 595;
    const centerX = pageWidth / 2;

    // 🔹 **Set Yellow Background**
    page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        color: rgb(1, 1, 0.8), // Light Yellow Background
    });

    let y = 500; // Adjusted downwards so logo and title fit properly

    // Draw Logo & Title in the same line (Centered)
    const titleX = centerX - 75;
    const logoX = titleX - 90;
    page.drawImage(logoImage, { x: logoX, y, width: 70, height: 70 });
    page.setFontColor(rgb(0, 0, 0)); // Set text color to black for readability
    page.drawText("INDIAN RED CROSS SOCIETY", { x: titleX, y: y + 25, size: 18, font });
    page.drawText("District Branch: Chhatarpur 471001 (M.P.)", { x: titleX, y, size: 12, font });

    y -= 40;
    page.drawText("RENT PAYMENT RECEIPT", { x: centerX - 80, y, size: 18, font });

    y -= 50;

    // Center aligned Receipt No. and Order ID
    page.drawText(`Receipt No: ${data.receiptNo}`, { x: 200, y, size: fontSize, font });
    page.drawText(`Order ID: ${data.orderId}`, { x: 500, y, size: fontSize, font });

    y -= 30;
    page.drawText(`Date: ${data.date}`, { x: centerX - 50, y, size: fontSize, font });

    y -= 50;

    // Function to Draw Fields with Proper Underlines Below Values
    function drawLabeledText(label:string, value:string) {
        const labelX = 150; // Label position
        const underlineStartX = labelX + 180; // Start of underline
        const underlineWidth = 350; // Length of underline
        const valueX = underlineStartX + (underlineWidth / 2) - (value.length * 3.5); // Centering value

        // Draw label
        page.drawText(`${label}:`, { x: labelX, y, size: fontSize, font });

        // Draw underline
        page.drawLine({
            start: { x: underlineStartX, y: y - 5 },
            end: { x: underlineStartX + underlineWidth, y: y - 5 },
            thickness: 1,
            color: rgb(0, 0, 0)
        });

        // Draw value centered on the underline
        page.drawText(value, { x: valueX, y, size: fontSize, font });
    }

    // Draw Fields with Underlines Below Values
    drawLabeledText("Received from", data.tenantName);
    y -= 30;
    drawLabeledText("Property Address", data.propertyAddress);
    y -= 30;
    drawLabeledText("Rent Paid for", `${data.monthsPaid} months`);
    y -= 30;
    drawLabeledText("Monthly Rent", `Rs. ${data.monthlyRent}/-`);
    y -= 30;
    drawLabeledText("Total Paid", `Rs. ${data.totalRent}/-`);
    y -= 30;
    drawLabeledText("Payment Mode", data.paymentMode);
    y -= 30;
    drawLabeledText("Transaction ID", data.transactionId);

    y -= 50; // Adjusting spacing before signature section

    // Signature Section (Properly Centered to the Line)
    const signLineX = 600; // Signature line position
    const signX = signLineX + 10; // Centered with respect to the line
    const signY = 80; // Adjusted placement

    page.drawImage(signatureImage, { x: signX, y: signY, width: 120, height: 50 });

    // Underline closer to the signature
    page.drawLine({
        start: { x: signLineX, y: signY - 10 }, // Signature line
        end: { x: signLineX + 150, y: signY - 10 },
        thickness: 1,
        color: rgb(0, 0, 0)
    });

    // "Sign. of Receiver" text centered below the line
    page.drawText("Sign. of Receiver", { x: signLineX + 25, y: signY - 40, size: fontSize, font });

    const filePath = `${invoiceDir}/rent_invoice_${data.receiptNo}.pdf`;
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);
    console.log(`PDF Generated: ${filePath}`);

    return filePath;
}




