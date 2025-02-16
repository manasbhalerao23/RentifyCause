"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsModel = exports.AdminModel = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
//users
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    role: { type: String, required: true },
    contact: { type: String },
    address: { type: String },
    shopName: { type: String, required: true },
    monthRent: { type: String },
    currentRent: { type: String },
    currentDonation: { type: String },
    totalDonation: { type: String }
});
exports.UserModel = (0, mongoose_1.model)('User', UserSchema);
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
    titleBody: [{ title: String,
            body: String
        }]
});
exports.BlogsModel = (0, mongoose_1.model)('Blogs', BlogsSchema);
//payments
