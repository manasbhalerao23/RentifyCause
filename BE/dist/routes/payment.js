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
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../middlewares/auth");
const razorpay_1 = __importDefault(require("../config/razorpay"));
const db_1 = require("../models/db");
const razorpay_utils_1 = require("razorpay/dist/utils/razorpay-utils");
const invoiceGeneration_1 = require("../utils/invoiceGeneration");
dotenv_1.default.config();
const paymentRouter = express_1.default.Router();
// username: string;
//     email :string;
//     contact: string;
//     role: string;
//     shopName: string;
//     monthRent: string;
//     currentRent: string;
//     currentDonation: string;
//     totalDonation: string;
//     address?: string;
const getmonths = (months_paid, num) => {
    let months = 0;
    console.log(months_paid);
    for (let i = 0; i < months_paid.length; i++) {
        if (months_paid[i] == false) {
            months++;
            if (months === num) {
                break;
            }
        }
    }
    return months;
};
paymentRouter.post("/payment/create", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        // const {amount}=req.body;
        // const {email,contact,username,id}= req?.user;
        const id = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
        const email = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.email) !== null && _d !== void 0 ? _d : "";
        const contact = (_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e.contact) !== null && _f !== void 0 ? _f : "";
        const username = (_h = (_g = req.user) === null || _g === void 0 ? void 0 : _g.username) !== null && _h !== void 0 ? _h : "";
        const { num } = req.body; // Num= number of month
        if (num <= 0 || num > 3) {
            res.status(500).json({ msg: "Invalid number of months" });
            return;
        }
        const user = yield db_1.User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const months_paid = user.monthstatus;
        const payablemonths = getmonths(months_paid, num);
        // console.log(months_paid);
        // console.log(payablemonths);
        user.save();
        if (payablemonths === 0) {
            res.status(200).json({
                message: "no dues"
            });
            return;
        }
        const order = yield razorpay_1.default.orders.create({
            amount: 100 * payablemonths, //amount ko dynamic baad mein karte hai
            currency: "INR",
            receipt: `rcpt_r_${id.slice(-6)}_${Date.now().toString().slice(-6)}`,
            notes: {
                userId: id,
                email: email,
                contact: contact,
                username: username,
                paymentType: "rent",
                months_paid: payablemonths
            }
        });
        const receiptID = order.receipt;
        const payment = new db_1.paymentModel({
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes,
        });
        const savePayment = yield payment.save();
        res.send(Object.assign(Object.assign({}, savePayment.toJSON()), { keyId: process.env.RAZORPAY_KEY_ID, receiptId: receiptID }));
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
}));
paymentRouter.post("/payment/create/donate/:Did", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        const id = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
        const { Did } = (_c = req.params) !== null && _c !== void 0 ? _c : "";
        const email = (_e = (_d = req.user) === null || _d === void 0 ? void 0 : _d.email) !== null && _e !== void 0 ? _e : "";
        const contact = (_g = (_f = req.user) === null || _f === void 0 ? void 0 : _f.contact) !== null && _g !== void 0 ? _g : "";
        const username = (_j = (_h = req.user) === null || _h === void 0 ? void 0 : _h.username) !== null && _j !== void 0 ? _j : "";
        const { num } = req.body; // Num= number of month
        const Arr = [10000, 7500, 5000, 2000, 1000, 500, 200, 100, 50];
        if (num < 0 || num > 9) {
            res.status(500).json({ msg: "Invalid selection" });
            return;
        }
        const user = yield db_1.User.findById(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // console.log(months_paid);
        // console.log(payablemonths);
        user.save();
        const order = yield razorpay_1.default.orders.create({
            amount: 100, //amount ko dynamic baad mein karte hai  *Arr[num]
            currency: "INR",
            receipt: `rcpt_d_${id.slice(-6)}_${Date.now().toString().slice(-6)}`,
            notes: {
                userId: id,
                email: email,
                contact: contact,
                username: username,
                paymentType: "donation",
                donationId: Did
            }
        });
        const receiptID = order.receipt;
        const payment = new db_1.paymentModel({
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
        });
        const savePayment = yield payment.save();
        res.send(Object.assign(Object.assign({}, savePayment.toJSON()), { keyId: process.env.RAZORPAY_KEY_ID, receiptId: receiptID }));
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
}));
paymentRouter.post("/payment/webhook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    try {
        const webhookSignature = req.get("X-Razorpay-Signature"); // or req.headers["X-Razorpay-Signature"]
        const isWebhookValid = (0, razorpay_utils_1.validateWebhookSignature)(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET);
        if (!isWebhookValid) {
            res.status(400).json({ error: "Invalid webhook signature" });
            return;
        }
        //update payment status in db
        const paymentDetails = req.body.payload.payment.entity;
        const payment = yield db_1.paymentModel.findOne({ orderId: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.order_id });
        if (!payment) {
            res.status(200).json({ msg: "No such Order" });
            return;
        }
        payment.status = paymentDetails.status;
        yield payment.save();
        if (((_a = payment.notes) === null || _a === void 0 ? void 0 : _a.paymentType) == "donation") {
            if (paymentDetails.status == "captured") {
                const user = yield db_1.User.findById((_b = payment.notes) === null || _b === void 0 ? void 0 : _b.userId);
                if (!user) {
                    res.status(200).json({ message: "No user found" });
                    return;
                }
                user.totalDonation += payment.amount / 100;
                yield user.save().then(() => console.log("Updated")).catch(err => console.log(err));
                const blogId = (_c = payment.notes) === null || _c === void 0 ? void 0 : _c.donationId;
                const currBlog = yield db_1.BlogsModel.findById(blogId);
                if (!currBlog) {
                    res.status(200).json({ message: "No Blog found" });
                    return;
                }
                currBlog.donationRecieved += payment.amount / 100;
                yield currBlog.save().then(() => console.log("Updated")).catch(err => console.log(err));
            }
        }
        else {
            if (paymentDetails.status == "captured") {
                const user = yield db_1.User.findById((_d = payment.notes) === null || _d === void 0 ? void 0 : _d.userId);
                if (!user) {
                    res.status(200).json({ message: "No user found" });
                    return;
                }
                let paid_months = user.monthstatus; //arr
                let monthsupdate = (_e = payment.notes) === null || _e === void 0 ? void 0 : _e.months_paid; //months payment
                for (let i = 0; i < paid_months.length; i++) {
                    if (paid_months[i] == false && monthsupdate > 0) {
                        paid_months[i] = true;
                        monthsupdate--;
                    }
                    if (monthsupdate == 0) {
                        break;
                    }
                }
                // user.monthstatus = paid_months;
                user.set("monthstatus", paid_months);
                user.rentPaidUntil = new Date(Date.now());
                yield user.save().then(() => console.log("Updated")).catch(err => console.log(err));
                // receiptNo: string;
                // orderId: string;
                // date: string;
                // tenantName: string;
                // propertyAddress: string;
                // monthsPaid: number;
                // monthlyRent: number;
                // totalRent: number;
                // paymentMode: string;
                // transactionId: string;
                const data = {
                    receiptNo: (_f = payment.receipt) !== null && _f !== void 0 ? _f : "",
                    orderId: payment.orderId,
                    date: new Date(Date.now()),
                    tenantName: (_g = user.username) !== null && _g !== void 0 ? _g : "",
                    propertyAddress: (_h = user.address) !== null && _h !== void 0 ? _h : "",
                    monthsPaid: (_l = (_k = (_j = payment.notes) === null || _j === void 0 ? void 0 : _j.months_paid) === null || _k === void 0 ? void 0 : _k.toString()) !== null && _l !== void 0 ? _l : "",
                    monthlyRent: (_m = user.monthRent.toString()) !== null && _m !== void 0 ? _m : "",
                    totalRent: (_o = (payment.amount / 100).toString()) !== null && _o !== void 0 ? _o : "",
                    paymentMode: (_p = paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.method.toString()) !== null && _p !== void 0 ? _p : "",
                    transactionId: (_q = paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.id.toString()) !== null && _q !== void 0 ? _q : ""
                };
                const url = yield (0, invoiceGeneration_1.generateRentInvoice)(data);
                //lets create an entry in invoiceModel from db.ts now
                // userId:{
                //     type:Schema.Types.ObjectId ,
                //     ref:"User",
                //     required:true
                // },
                // receiptId:{
                //     type:String,
                //     required:true
                // },
                // url:{
                //     type:String,
                //     required:true
                // },
                // orderId:{
                //     type:String,
                //     required:true,
                // },
                // date:{
                //     type:Date,
                //     required:true
                // }
                const invoice = new db_1.InvoiceModel({
                    receiptId: data.receiptNo,
                    orderId: data.orderId,
                    date: data.date,
                    userId: user._id,
                    url: url
                });
                // save the invoice in the database
                yield invoice.save();
            }
        }
        //DATE MANIPULATION LOGIC 
        //return success response to razorpay
        // if (req.body.event == "payment.captured") {
        // }
        // if (req.body.event == "payment.failed") {
        // }
        res.status(200).json({ msg: "Webhook recieved successfully" });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
}));
exports.default = paymentRouter;
