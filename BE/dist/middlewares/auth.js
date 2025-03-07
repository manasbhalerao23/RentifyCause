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
exports.checkAdmin = exports.verifyAcessToken = exports.userAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../models/db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader);
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).send("Please login!");
            return;
        }
        const token = authHeader.split(" ")[1];
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
        req.user = {
            id: (_a = user._id.toString()) !== null && _a !== void 0 ? _a : "",
            username: (_b = user.username) !== null && _b !== void 0 ? _b : "",
            email: (_c = user.email) !== null && _c !== void 0 ? _c : "",
            contact: (_d = user.contact) !== null && _d !== void 0 ? _d : "",
            role: (_e = user.role) !== null && _e !== void 0 ? _e : "",
            shopName: (_f = user.shopName) !== null && _f !== void 0 ? _f : "",
            monthRent: (_g = user.monthRent) !== null && _g !== void 0 ? _g : "",
            currentRent: (_h = user.currentRent) !== null && _h !== void 0 ? _h : "",
            currentDonation: (_j = user.currentDonation) !== null && _j !== void 0 ? _j : "",
            totalDonation: (_k = user.totalDonation) !== null && _k !== void 0 ? _k : "",
            address: (_l = user.address) !== null && _l !== void 0 ? _l : "",
        };
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.userAuth = userAuth;
const verifyAcessToken = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        console.log(token);
        if (!token) {
            res.status(401).send("Unauthorized");
            return;
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_KEY, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            if (err || !(decoded === null || decoded === void 0 ? void 0 : decoded._id)) {
                res.status(403).json({ error: "invalid Token" });
                return;
            }
            const _id = decoded._id;
            const user = yield db_1.User.findById(_id).lean();
            if (!user) {
                throw new Error("User not found");
            }
            req.user = {
                id: (_a = user._id.toString()) !== null && _a !== void 0 ? _a : "",
                username: (_b = user.username) !== null && _b !== void 0 ? _b : "",
                email: (_c = user.email) !== null && _c !== void 0 ? _c : "",
                contact: (_d = user.contact) !== null && _d !== void 0 ? _d : "",
                role: (_e = user.role) !== null && _e !== void 0 ? _e : "",
                shopName: (_f = user.shopName) !== null && _f !== void 0 ? _f : "",
                monthRent: (_g = user.monthRent) !== null && _g !== void 0 ? _g : "",
                currentRent: (_h = user.currentRent) !== null && _h !== void 0 ? _h : "",
                currentDonation: (_j = user.currentDonation) !== null && _j !== void 0 ? _j : "",
                totalDonation: (_k = user.totalDonation) !== null && _k !== void 0 ? _k : "",
                address: (_l = user.address) !== null && _l !== void 0 ? _l : "",
            };
            next();
        }));
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.verifyAcessToken = verifyAcessToken;
const checkAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user && req.user.role != "admin") {
            res.status(403).send("Auth error A-404");
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
