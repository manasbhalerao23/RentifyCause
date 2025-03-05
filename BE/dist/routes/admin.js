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
        const ids = users.map((_id) => (_id));
        //console.log(ids);
        const payments = yield Promise.all(ids.map((_id) => __awaiter(void 0, void 0, void 0, function* () {
            return db_1.paymentModel.findOne({ "notes.userId": _id, status: "captured" }).select("receipt notes.userId"); //add rent type here
        })));
        const paymentMap = new Map(payments.map((p) => { var _a; return [(_a = p === null || p === void 0 ? void 0 : p.notes) === null || _a === void 0 ? void 0 : _a.userId.toString(), p === null || p === void 0 ? void 0 : p.receipt]; }));
        //can add more if needed
        //console.log(users);
        const DatatoSend = users.map(({ username, contact, address, shopName, currentRent, _id, monthstatus }) => ({
            username,
            contact,
            address,
            shopName,
            currentRent,
            monthstatus,
            receipt: paymentMap.get(_id.toString()) || null
        }));
        res.json({ DatatoSend });
    }
    catch (e) {
        res.status(500).json({
            message: "error while fetching users"
        });
    }
}));
exports.default = adminrouter;
