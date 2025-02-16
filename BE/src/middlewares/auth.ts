import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/db";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
// 
// Extend Request type to include user
interface Iuser{
    username: string;
    email :string;
    contact: string;
    role: string;
    shopName: string;
    monthRent: string;
    currentRent: string;
    currentDonation: string;
    totalDonation: string;
    address?: string;
}
export interface AuthRequest extends Request {
    user?: Iuser;
}

export const userAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;
        if (!token) {
res.status(401).send("Please login!");
return;
        }

        const decodedObj = jwt.verify(token, process.env.JWT_KEY as string);

        // Ensure decodedObj is an object with _id
        if (typeof decodedObj === "string") {
            throw new Error("Invalid token");
        }

        const { _id } = decodedObj as JwtPayload; // Explicitly cast as JwtPayload
        const user = await User.findById(_id).lean();
        if (!user) {
            throw new Error("User not found");
        }

        req.user = req.user = {
            username: user.username ?? "",
            email: user.email ?? "",
            contact: user.contact ?? "",
            role: user.role ?? "",
            shopName: user.shopName ?? "",
            monthRent: user.monthRent ?? "",
            currentRent: user.currentRent ?? "",
            currentDonation: user.currentDonation ?? "",
            totalDonation: user.totalDonation ?? "",
            address: user.address ?? "",
        };
        
        next();
    } catch (err: any) {
        next(err)
    }
};
