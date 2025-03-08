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
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const db_1 = require("../models/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../middlewares/auth");
dotenv_1.default.config();
const authRouter = express_1.default.Router();
//Fix this type error later
//@ts-ignore  
authRouter.post("/reconnection", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: "You need to login again (error=RT12)" });
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_KEY);
        }
        catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(403).json({ error: "Refresh token expired. Please log in again." });
            }
            return res.status(403).json({ error: "Invalid refresh token." });
        }
        const _id = decoded._id;
        if (!_id) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }
        // Find user in the database
        const user = yield db_1.User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // ✅ Optionally: Check if refresh token is stored in DB before issuing a new one
        if (user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: "Refresh token is no longer valid. Please log in again." });
        }
        // Generate new refresh token
        const newRefreshToken = jsonwebtoken_1.default.sign({ _id }, process.env.JWT_REFRESH_KEY, { expiresIn: "1d" });
        // ✅ Store the new refresh token in DB (or Redis)
        user.refreshToken = newRefreshToken;
        yield user.save();
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Enable in production
            sameSite: "strict"
        });
        // Generate new access token
        const newAccessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: "30m" });
        const sendingUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            address: user.address,
            contact: user.contact,
            currentDonation: user.currentDonation,
            currentRent: user.currentRent,
            monthRent: user.monthRent,
            totalDonation: user.totalDonation,
            role: user.role,
            shopName: user.shopName,
            monthStatus: user.monthstatus
        };
        return res.json({ user: sendingUser, accessToken: newAccessToken });
    }
    catch (err) {
        console.error("Error in reconnection API:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield db_1.User.findOne({ $or: [{ username },
                { email: username }
            ] });
        if (!user) {
            res.status(400).json({ message: "User Not Found" });
            return;
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: "30m" });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_KEY, { expiresIn: "1d" });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure:true //after HTTPS certification,
            sameSite: "strict"
        });
        user.refreshToken = refreshToken;
        yield user.save();
        const sendingUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            address: user.address,
            contact: user.contact,
            currentDonation: user.currentDonation,
            currentRent: user.currentRent,
            monthRent: user.monthRent,
            totalDonation: user.totalDonation,
            role: user.role,
            shopName: user.shopName,
            monthStatus: user.monthstatus
        };
        res.json({ msg: sendingUser, token: accessToken });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
authRouter.post("/getInfo", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, orderId } = req.body;
        if (!id) {
            res.status(400).json({ error: "Id not found" });
            return;
        }
        const user = yield db_1.User.findById(id);
        if (!user) {
            res.status(400).json({ error: "Not Found User" });
            return;
        }
        const sendingUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            address: user.address,
            contact: user.contact,
            currentDonation: user.currentDonation,
            currentRent: user.currentRent,
            monthRent: user.monthRent,
            totalDonation: user.totalDonation,
            role: user.role,
            shopName: user.shopName,
            monthStatus: user.monthstatus
        };
        let order;
        if (orderId) {
            order = yield db_1.InvoiceModel.findOne({ orderId: orderId });
        }
        res.json({ msg: sendingUser, downloadUrl: order === null || order === void 0 ? void 0 : order.downloadUrl, Url: order === null || order === void 0 ? void 0 : order.url });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
}));
authRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, contact, address, shopName, email } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new db_1.User({
            username,
            password: hashedPassword,
            contact,
            address,
            shopName,
            email,
            role: "user"
        });
        const sendingUser = {
            username: user.username,
            email: user.email,
            contact: user.contact,
            address: user.address,
            shopName: user.shopName,
            role: user.role
        };
        yield user.save();
        res.send("User added " + sendingUser);
    }
    catch (err) {
        res.status(400).json({ message: "Error while signing up" });
        //console.log(err);
    }
}));
authRouter.post("/logout", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("refreshToken", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ msg: "User Logged Out Successful!" });
}));
authRouter.get("/userInfo", auth_1.verifyAcessToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    res.json({ role: (_a = req.user) === null || _a === void 0 ? void 0 : _a.role });
    return;
}));
exports.default = authRouter;
