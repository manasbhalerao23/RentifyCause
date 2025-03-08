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
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("../models/db");
node_cron_1.default.schedule("22 3 1 1 *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Running cron job: Updating monthstatus and previousyear arrays");
        const users = yield db_1.User.find();
        for (const user of users) {
            const { monthstatus } = user;
            // 12 months in previousyear
            user.previousyear = monthstatus.slice(0, 12);
            // Shifting the remaining months and fill with f
            user.monthstatus = [...monthstatus.slice(12), ...Array(12).fill(false)];
            // if(user.monthstatus.length){
            //     user.monthstatus=[true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
            //     user.previousyear= [true,true,true,true,true,true,true,true,true,true,true,true]
            // }
            yield user.save();
        }
        console.log("Cron job completed successfully");
    }
    catch (error) {
        console.error("Error in cron job:", error);
    }
}), { timezone: "Asia/Kolkata" });
