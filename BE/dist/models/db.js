"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsModel = exports.AdminModel = exports.User = void 0;
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
    shopName: { type: String, required: true },
    monthRent: { type: String,
        default: "10000"
    },
    currentRent: { type: String,
        default: "10000"
    },
    currentDonation: { type: String,
        default: "0"
    },
    totalDonation: { type: String,
        default: "0"
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
