
import express from "express";
import { paymentModel, User } from "../models/db";

const adminrouter = express.Router();

adminrouter.get("/getall", async (req, res) => {
    try{
        const users = await User.find();
        const ids = users.map((_id) => (_id));
        //console.log(ids);
        const payments = await Promise.all(
            ids.map(async (_id) => {
              return paymentModel.findOne({ "notes.userId": _id, status: "captured"}).select("receipt notes.userId");//add rent type here
            })
          );
          const paymentMap = new Map(payments.map((p) => [p?.notes?.userId.toString(), p?.receipt]));
        
        //can add more if needed
        //console.log(users);
        const DatatoSend = users.map(({username, contact, address ,shopName, currentRent, _id, monthstatus}) => ({
            username,
            contact,
            address,
            shopName,
            currentRent,
            monthstatus,
            receipt: paymentMap.get(_id.toString()) || null
        }));
        res.json({DatatoSend});
    }
    catch(e){
        res.status(500).json({
            message: "error while fetching users"
        });
    }
})

export default adminrouter;