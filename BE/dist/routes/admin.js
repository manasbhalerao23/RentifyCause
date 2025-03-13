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
const express_1 = __importDefault(require("express"));
const db_1 = require("../models/db");
const auth_1 = require("../middlewares/auth");
const exceljs_1 = __importDefault(require("exceljs"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const path_1 = __importDefault(require("path"));
const adminrouter = express_1.default.Router();
adminrouter.get("/getRentDonations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resp = yield db_1.paymentModel.find({ status: "captured" });
        res.json({ resp });
    }
    catch (e) {
        console.log(e);
    }
}));
adminrouter.get("/getpaydetails", auth_1.verifyAcessToken, auth_1.checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userreceipt = req.query.rec; //check
    try {
        const paydetail = yield db_1.paymentModel.findOne({ receipt: userreceipt });
        res.json({ paydetail });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error while fetching" });
    }
}));
adminrouter.get("/getall", auth_1.verifyAcessToken, auth_1.checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.User.find();
        //can add more if needed
        //console.log(users);
        const DatatoSend = users.map(({ username, contact, address, shopName, currentRent, _id, monthstatus, email }) => ({
            username,
            contact,
            address,
            shopName,
            currentRent,
            monthstatus,
            _id,
            email
        }));
        res.json({ DatatoSend });
    }
    catch (e) {
        res.status(500).json({
            message: "error while fetching users"
        });
    }
}));
adminrouter.get("/getInfo/:id", auth_1.verifyAcessToken, auth_1.checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const payments = yield db_1.paymentModel.find({ "notes.userId": id });
        const orderIds = payments.map(p => p.orderId); // Extract orderIds from payments
        const invoicesUrl = yield db_1.InvoiceModel.find({ orderId: { $in: orderIds } }) // Find invoices for the orderIds
            .select("orderId url downloadUrl"); // Only select required fields
        // Merge invoices into payments
        const paymentsWithInvoices = payments.map(payment => {
            const invoice = invoicesUrl.find(inv => inv.orderId === payment.orderId);
            return Object.assign(Object.assign({}, payment.toObject()), { url: invoice ? invoice.url : null, downloadUrl: invoice ? invoice.downloadUrl : null });
        });
        const invoices = yield db_1.InvoiceModel.find({ userId: id });
        const user = yield db_1.User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const { _id, username, totalDonation, shopName, role, monthstatus, monthRent, email, currentRent, contact, address } = user;
        const DatatoSend = {
            _id,
            username,
            totalDonation,
            shopName,
            role,
            monthstatus,
            monthRent,
            email,
            currentRent,
            contact,
            address
        };
        res.send({ payments: paymentsWithInvoices, invoices: invoices, user: DatatoSend });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error while fetching user info" });
        return;
    }
}));
adminrouter.post("/extempt", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const changeMonth = req.body.index;
        const user = yield db_1.User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // user.monthstatus[changeMonth]=null
        if (changeMonth < 0 || changeMonth >= user.monthstatus.length) {
            res.status(400).json({ message: "Invalid month index" });
            return;
        }
        user.monthstatus[changeMonth] = null;
        yield user.save();
        const { _id, username, totalDonation, shopName, role, monthstatus, monthRent, email, currentRent, contact, address } = user;
        const DatatoSend = {
            _id,
            username,
            totalDonation,
            shopName,
            role,
            monthstatus,
            monthRent,
            email,
            currentRent,
            contact,
            address
        };
        res.send({ user: DatatoSend });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error while doing the Task" });
        return;
    }
}));
adminrouter.post("/generate-receipts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const date = req.body.date;
        if (!date) {
            res.status(400).json({ error: "Date is required" });
            return;
        }
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        // Fetch payments from DB
        const payments = yield db_1.paymentModel.find({
            updatedAt: { $gte: startOfDay, $lte: endOfDay },
            "notes.paymentType": "rent",
            status: "captured"
        }); // Adjust for SQL queries if needed
        if (!payments.length) {
            res.status(404).json({ message: "No payments found" });
            return;
        }
        // Create Excel file
        const workbook = new exceljs_1.default.Workbook();
        const sheet = workbook.addWorksheet("Rent Receipts");
        // Add Headers
        sheet.columns = [
            { header: "Name", key: "name", width: 20 },
            { header: "Contact", key: "contact", width: 15 },
            { header: "Email", key: "email", width: 15 },
            { header: "Amount Paid", key: "amount", width: 15 },
            { header: "Months Paid", key: "monthsPaid", width: 10 },
            { header: "Receipt ID", key: "receiptId", width: 20 },
            { header: "Order Id", key: "orderId", width: 20 },
            { header: "Date", key: "date", width: 20 },
        ];
        // Add Data
        payments.forEach((payment) => {
            var _a, _b, _c, _d;
            sheet.addRow({
                name: (_a = payment === null || payment === void 0 ? void 0 : payment.notes) === null || _a === void 0 ? void 0 : _a.username,
                contact: (_b = payment === null || payment === void 0 ? void 0 : payment.notes) === null || _b === void 0 ? void 0 : _b.contact,
                email: (_c = payment === null || payment === void 0 ? void 0 : payment.notes) === null || _c === void 0 ? void 0 : _c.email,
                amount: payment.amount,
                monthsPaid: (_d = payment === null || payment === void 0 ? void 0 : payment.notes) === null || _d === void 0 ? void 0 : _d.months_paid,
                receiptId: payment.receipt,
                orderId: payment.orderId,
                date: payment.updatedAt.toISOString().split("T")[0],
            });
        });
        // Save to a temp file
        const filePath = `./receipts_${date}.xlsx`;
        yield workbook.xlsx.writeFile(filePath);
        // Upload to Cloudinary
        const result = yield cloudinary_1.default.uploader.upload(filePath, {
            resource_type: "raw",
            folder: "rent_receipts",
        });
        // Delete local file
        fs_1.default.unlinkSync(filePath);
        res.json({ message: "Receipt generated", url: result.url });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
adminrouter.post("/generate-excel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, month } = req.body;
        let payments;
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setUTCHours(23, 59, 59, 999);
            payments = yield db_1.paymentModel.find({
                updatedAt: { $gte: startOfDay, $lte: endOfDay },
                "notes.paymentType": "rent",
                status: "captured",
            });
        }
        else if (month) {
            console.log("Received month:", month);
            const startOfMonth = new Date();
            startOfMonth.setUTCMonth(month, 1); // Set the given month (0-based)
            startOfMonth.setUTCHours(0, 0, 0, 0);
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(startOfMonth.getMonth() + 1);
            endOfMonth.setDate(0); // Last day of the month
            endOfMonth.setUTCHours(23, 59, 59, 999);
            console.log("Filtering payments from:", startOfMonth, "to", endOfMonth);
            payments = yield db_1.paymentModel.find({
                updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
                "notes.paymentType": "rent",
                status: "captured",
            });
        }
        else {
            res.status(400).json({ error: "Either date or month is required" });
            return;
        }
        console.log("Payments Data:", payments);
        if (!payments) {
            res.json({ message: "No payments found" });
            return;
        }
        // Create Excel file
        const workbook = new exceljs_1.default.Workbook();
        const sheet = workbook.addWorksheet("Rent Receipts");
        // Add Headers
        sheet.columns = [
            { header: "Name", key: "name", width: 20 },
            { header: "Contact", key: "contact", width: 15 },
            { header: "Email", key: "email", width: 15 },
            { header: "Amount Paid", key: "amount", width: 15 },
            { header: "Months Paid", key: "monthsPaid", width: 10 },
            { header: "Receipt ID", key: "receiptId", width: 20 },
            { header: "Order Id", key: "orderId", width: 20 },
            { header: "Date", key: "date", width: 20 },
        ];
        // Add Data
        payments.forEach((payment) => {
            var _a, _b, _c, _d;
            sheet.addRow({
                name: (_a = payment === null || payment === void 0 ? void 0 : payment.notes) === null || _a === void 0 ? void 0 : _a.username,
                contact: (_b = payment === null || payment === void 0 ? void 0 : payment.notes) === null || _b === void 0 ? void 0 : _b.contact,
                email: (_c = payment === null || payment === void 0 ? void 0 : payment.notes) === null || _c === void 0 ? void 0 : _c.email,
                amount: payment.amount,
                monthsPaid: (_d = payment === null || payment === void 0 ? void 0 : payment.notes) === null || _d === void 0 ? void 0 : _d.months_paid,
                receiptId: payment.receipt,
                orderId: payment.orderId,
                date: payment.updatedAt.toISOString().split("T")[0],
            });
        });
        // Save file to a temporary directory
        const fileName = date ? `receipts_${date}.xlsx` : `receipts_${month}.xlsx`;
        const filePath = path_1.default.join(__dirname, "../temp", fileName);
        yield workbook.xlsx.writeFile(filePath);
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).json({ error: "Error generating file" });
            }
            // Delete file after sending
            fs_1.default.unlink(filePath, (unlinkErr) => {
                if (unlinkErr)
                    console.error("Error deleting file:", unlinkErr);
            });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
exports.default = adminrouter;
