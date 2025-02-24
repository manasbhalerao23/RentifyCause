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
paymentRouter.post("/create", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        // const {amount}=req.body;
        // const {email,contact,username,id}= req?.user;
        const id = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "";
        const email = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.contact) !== null && _d !== void 0 ? _d : "";
        const contact = (_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e.contact) !== null && _f !== void 0 ? _f : "";
        const username = (_h = (_g = req.user) === null || _g === void 0 ? void 0 : _g.username) !== null && _h !== void 0 ? _h : "";
        const { num } = req.body; // Num= number of month
        if (num <= 0 || num > 6) {
            res.status(500).json({ msg: "Invalid number of months" });
            return;
        }
        const order = yield razorpay_1.default.orders.create({
            amount: 100, //amount ko dynamic baad mein karte hai
            currency: "INR",
            receipt: `rcpt_${id.slice(-6)}_${Date.now().toString().slice(-6)}`,
            notes: {
                userId: id,
                email: email,
                contact: contact,
                username: username,
                paymentType: "rent"
            }
        });
        // monthsPaid:{
        //     type:Number,
        //     required:true,
        // },
        // notes:{
        //     username:{
        //         type:String,
        //     },
        //     email:{
        //         type:String,
        //     },
        //     contact:{
        //         type:String,
        //     }
        // },
        // paymentMethod:{
        //     type:String,
        //   },
        //   paidAt:{
        //     type:Date,
        //   }
        const payment = new db_1.paymentModel({
            orderId: order.id,
            status: order.status,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            notes: order.notes
        });
        const savePayment = yield payment.save();
        console.log(savePayment);
        res.send(Object.assign(Object.assign({}, savePayment.toJSON()), { keyId: process.env.RAZORPAY_KEY_ID }));
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
}));
exports.default = paymentRouter;
