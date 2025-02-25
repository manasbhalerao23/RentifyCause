"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentModel = exports.BlogsModel = exports.AdminModel = exports.User = void 0;
const mongoose_1 = require("mongoose");
//users
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, required: true,
        default: "user"
    },
    contact: { type: String },
    address: { type: String },
    shopName: { type: String },
    monthRent: { type: Number,
        default: 2000
    },
    currentRent: { type: Number,
        default: 2000
    },
    currentDonation: { type: Number,
        default: 0
    },
    totalDonation: { type: Number,
        default: 0
    },
    rentPaidUntil: { type: Date
    },
    monthstatus: { type: [Boolean],
        default: () => [true, true, false, false, false, false, false, false, false, false, false, false]
    }
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', UserSchema);
//admin
const AdminSchema = new mongoose_1.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    contact: { type: String },
    role: { type: String, required: true }
});
exports.AdminModel = (0, mongoose_1.model)('Admin', AdminSchema);
//blogs
const BlogsSchema = new mongoose_1.Schema({
    heading: { type: String, required: true },
    dateTime: { type: Date, required: true, default: Date.now },
    location: { type: String, required: true },
    body: { type: String, required: true },
    images: [{ type: String }]
});
exports.BlogsModel = (0, mongoose_1.model)('Blogs', BlogsSchema);
//payments
const PaymentSchema = new mongoose_1.Schema({
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    },
    monthsPaid: {
        type: Number,
    },
    notes: {
        username: {
            type: String,
        },
        email: {
            type: String,
        },
        contact: {
            type: String,
        },
        userId: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        paymentType: {
            type: String,
        },
        months_paid: {
            type: Number
        }
    },
    paymentMethod: {
        type: String,
    },
    paidAt: {
        type: Date,
    },
}, { timestamps: true });
PaymentSchema.pre("save", function (next) {
    if (this.status === "captured" && !this.paidAt) {
        this.paidAt = new Date(); //bult here the logic
    }
    next();
});
exports.paymentModel = (0, mongoose_1.model)('Payment', PaymentSchema);
