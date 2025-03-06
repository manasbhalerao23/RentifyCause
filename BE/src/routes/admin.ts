
import express from "express";
import { paymentModel, User } from "../models/db";

const adminrouter = express.Router();

adminrouter.get("/getpaydetails", async (req, res) => {
    const userreceipt = req.query.rec;//check
    try{
        const paydetail = await paymentModel.findOne({receipt: userreceipt});
        res.json({paydetail});
    }
    catch(e){
        console.log(e);
        res.status(500).json({message: "Error while fetching"});
    }
});



adminrouter.get("/getall", async (req, res) => {
    try{
        const users = await User.find();
       
        //can add more if needed
        //console.log(users);
        const DatatoSend = users.map(({username, contact, address ,shopName, currentRent, _id, monthstatus,email}) => ({
            username,
            contact,
            address,
            shopName,
            currentRent,
            monthstatus,
            _id,
            email
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