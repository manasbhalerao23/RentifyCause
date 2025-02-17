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
exports.checkAdmin = exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../models/db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        const { token } = req.cookies;
        if (!token) {
            res.status(401).send("Please login!");
            return;
        }
        const decodedObj = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
        // Ensure decodedObj is an object with _id
        if (typeof decodedObj === "string") {
            throw new Error("Invalid token");
        }
        const { _id } = decodedObj; // Explicitly cast as JwtPayload
        const user = yield db_1.User.findById(_id).lean();
        if (!user) {
            throw new Error("User not found");
        }
        req.user = req.user = {
            username: (_a = user.username) !== null && _a !== void 0 ? _a : "",
            email: (_b = user.email) !== null && _b !== void 0 ? _b : "",
            contact: (_c = user.contact) !== null && _c !== void 0 ? _c : "",
            role: (_d = user.role) !== null && _d !== void 0 ? _d : "",
            shopName: (_e = user.shopName) !== null && _e !== void 0 ? _e : "",
            monthRent: (_f = user.monthRent) !== null && _f !== void 0 ? _f : "",
            currentRent: (_g = user.currentRent) !== null && _g !== void 0 ? _g : "",
            currentDonation: (_h = user.currentDonation) !== null && _h !== void 0 ? _h : "",
            totalDonation: (_j = user.totalDonation) !== null && _j !== void 0 ? _j : "",
            address: (_k = user.address) !== null && _k !== void 0 ? _k : "",
        };
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.userAuth = userAuth;
const checkAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user && req.user.role != "admin") {
            res.status(403).send("You are not an admin");
            return;
        }
        else {
            next();
        }
    }
    catch (err) {
        next(err);
    }
});
exports.checkAdmin = checkAdmin;
