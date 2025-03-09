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
exports.deleteImage = exports.uploadOnCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Warming up Cloudinary...");
        yield cloudinary_1.v2.api.ping(); // Test API
        console.log("Cloudinary is ready!");
    }
    catch (err) {
        console.error("Cloudinary Warm-up Failed:", err);
    }
}))();
exports.default = cloudinary_1.v2;
const uploadOnCloudinary = (localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!localFilePath)
            return;
        //upload on cloudinary
        const response = yield cloudinary_1.v2.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        //file has been uploaded successful
        console.log("file is uploaded on cloudinary " + response.url);
        return response;
    }
    catch (err) {
        fs_1.default.unlinkSync(localFilePath); // remove the locally saved temporary file
        return null;
    }
});
exports.uploadOnCloudinary = uploadOnCloudinary;
const deleteImage = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Extract the public ID from the URL
        const publicId = (_b = (_a = imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.split('/')) === null || _a === void 0 ? void 0 : _a.pop()) === null || _b === void 0 ? void 0 : _b.split('.')[0]; // This extracts the public ID
        if (!publicId) {
            throw new Error("Invalid Image URL");
        }
        // Delete the image from Cloudinary
        yield cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        console.error('Error deleting image:', error);
    }
});
exports.deleteImage = deleteImage;
