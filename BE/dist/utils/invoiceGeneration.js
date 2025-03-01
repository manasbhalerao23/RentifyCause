"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRentInvoice = generateRentInvoice;
const pdf_lib_1 = require("pdf-lib");
const fs_1 = __importDefault(require("fs"));
const invoiceDir = "./invoices";
if (!fs_1.default.existsSync(invoiceDir)) {
    fs_1.default.mkdirSync(invoiceDir);
}
function generateRentInvoice(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const pdfDoc = yield pdf_lib_1.PDFDocument.create();
        const page = pdfDoc.addPage([842, 595]); // Landscape A4 size
        const font = yield pdfDoc.embedFont(pdf_lib_1.StandardFonts.Helvetica);
        // Load Logo & Signature
        const logoBytes = fs_1.default.readFileSync("./logo.png");
        const logoImage = yield pdfDoc.embedPng(logoBytes);
        const signatureBytes = fs_1.default.readFileSync("./signature.png");
        const signatureImage = yield pdfDoc.embedPng(signatureBytes);
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
            color: (0, pdf_lib_1.rgb)(1, 1, 0.8), // Light Yellow Background
        });
        let y = 500; // Adjusted downwards so logo and title fit properly
        // Draw Logo & Title in the same line (Centered)
        const titleX = centerX - 75;
        const logoX = titleX - 90;
        page.drawImage(logoImage, { x: logoX, y, width: 70, height: 70 });
        page.setFontColor((0, pdf_lib_1.rgb)(0, 0, 0)); // Set text color to black for readability
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
        function drawLabeledText(label, value) {
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
                color: (0, pdf_lib_1.rgb)(0, 0, 0)
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
            color: (0, pdf_lib_1.rgb)(0, 0, 0)
        });
        // "Sign. of Receiver" text centered below the line
        page.drawText("Sign. of Receiver", { x: signLineX + 25, y: signY - 40, size: fontSize, font });
        const filePath = `C:/Users/vjais/OneDrive/Desktop/Donation Platform/Blog_web/BE/src/utils/rent_invoice_${data.receiptNo}.pdf`;
        const pdfBytes = yield pdfDoc.save();
        fs_1.default.writeFileSync(filePath, pdfBytes);
        console.log(`PDF Generated: ${filePath}`);
        return filePath;
    });
}
