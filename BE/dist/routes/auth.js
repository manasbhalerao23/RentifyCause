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
            res.status(401).json({ error: "You need to login again (error=RT12)" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_KEY);
        const _id = decoded._id;
        if (!_id) {
            res.status(403).json({ error: "Invalid refresh token" });
            return;
        }
        const user = yield db_1.User.findById(_id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Generate a new access token
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
        return res.json({ msg: sendingUser, token: newAccessToken });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
}));
authRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        console.log(username);
        let user = yield db_1.User.findOne({ $or: [{ username },
                { email: username }
            ] });
        console.log(user);
        if (!user) {
            res.status(400).json({ error: "Not Found User" });
            return;
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(400).json({ error: "Invalid credentials" });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: "30m" });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_KEY, { expiresIn: "7d" });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure:true //after HTTPS certification,
            sameSite: "strict"
        });
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
        console.log(user === null || user === void 0 ? void 0 : user.monthstatus);
        console.log(sendingUser.monthStatus);
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
        const { id } = req.body;
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
        res.json({ msg: sendingUser });
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
        console.log(err);
    }
}));
authRouter.post("/logout", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("refreshToken", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ msg: "User Logged Out Successful!" });
}));
exports.default = authRouter;
