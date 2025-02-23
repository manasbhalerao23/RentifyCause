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
dotenv_1.default.config();
const authRouter = express_1.default.Router();
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
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, process.env.JWT_KEY);
        res.cookie("token", token, {
            expires: new Date(Date.now() + 10000000)
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
        };
        res.json({ msg: sendingUser });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
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
authRouter.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("User Logged Out Successful!");
}));
exports.default = authRouter;
