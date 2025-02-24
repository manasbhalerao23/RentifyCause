"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var instance = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID, //can be public too
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
exports.default = instance;
