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
const multer_1 = __importDefault(require("../middlewares/multer"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const blogRouter = express_1.default.Router();
blogRouter.post("/create", multer_1.default.array("images", 6), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imgUrlArr = [];
        // console.log("Waiting 500ms to ensure files are ready...");
        // await new Promise(resolve => setTimeout(resolve, 500));
        if (req.files) {
            // Keep Cloudinary connection "warm" on server start
            for (const file of req.files) {
                console.log(file);
                try {
                    const result = yield cloudinary_1.default.uploader.upload(file.path, {
                        resource_type: "auto",
                        timeout: 30000,
                    });
                    imgUrlArr.push(result.url);
                }
                catch (err) {
                    console.error("Cloudinary Upload Error:", err);
                    imgUrlArr.push(null); // Push null or handle the error gracefully
                    res.status(500).json({ message: err });
                    return;
                }
            }
        }
        // console.log(req.files);
        // console.log(req.body);
        const { heading, dateTime, location, body } = req.body;
        console.log(heading, dateTime, location, body);
        const blog = new db_1.BlogsModel({
            heading: heading,
            dateTime: dateTime,
            location: location,
            body: body,
            images: imgUrlArr
        });
        yield blog.save();
        res.status(201).json(blog);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
blogRouter.delete("/delete", auth_1.userAuth, auth_1.checkAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
blogRouter.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
