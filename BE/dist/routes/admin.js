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
const adminrouter = express_1.default.Router();
adminrouter.get("/getpaydetails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
adminrouter.get("/getall", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
adminrouter.get("/getInfo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = adminrouter;
