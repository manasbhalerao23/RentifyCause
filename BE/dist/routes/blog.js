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
const auth_1 = require("../middlewares/auth");
const blogRouter = express_1.default.Router();
blogRouter.post("/create", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // heading : {type: String, required: true},
        // dateTime : {type: Date, required: true, default: Date.now},
        // location : {type: String, required: true},
        // titleBody : [{title: String,
        //               body: String
        //             }]
        const { heading, dateTime, location, titleBody } = req.body;
        const blog = new db_1.BlogsModel({
            heading: heading,
            dateTime: dateTime,
            location: location,
            titleBody: titleBody
        });
        yield blog.save();
        res.status(201).json(blog);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
blogRouter.delete("/delete", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const blog = yield db_1.BlogsModel.findByIdAndDelete(id);
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.status(200).json(blog);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
blogRouter.get("/all", auth_1.userAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield db_1.BlogsModel.find();
        if (!blogs || blogs.length === 0) {
            res.status(404).json({ message: "No blogs found" });
            return;
        }
        res.status(200).json(blogs);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
exports.default = blogRouter;
