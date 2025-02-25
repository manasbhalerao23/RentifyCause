import express from "express"
import dotenv from "dotenv"
import { AuthRequest, userAuth } from "../middlewares/auth";
import razorpayInstance from "../config/razorpay"
import { Response } from "express";
import {paymentModel, User} from "../models/db"
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')

dotenv.config()


const paymentRouter= express.Router();

// username: string;
//     email :string;
//     contact: string;
//     role: string;
//     shopName: string;
//     monthRent: string;
//     currentRent: string;
//     currentDonation: string;
//     totalDonation: string;
//     address?: string;
paymentRouter.post("/payment/create", userAuth, async (req:AuthRequest,res:Response)=>{
    try{
        // const {amount}=req.body;
        // const {email,contact,username,id}= req?.user;
        const id= req.user?.id ?? "";
        const email= req.user?.contact ?? "";
        const contact= req.user?.contact ?? "";
        const username= req.user?.username ?? "";
        const {num}= req.body // Num= number of month
        if(num<=0 || num>6){
            res.status(500).json({msg: "Invalid number of months"})
            return;
        }
        

        const order= await razorpayInstance.orders.create({
            amount:100,//amount ko dynamic baad mein karte hai
            currency:"INR",
            receipt:`rcpt_${id.slice(-6)}_${Date.now().toString().slice(-6)}`,
            notes:{
                userId:id,
                email:email,
                contact:contact,
                username:username,
                paymentType:"rent" 
            }

        })
        
        
        
        // monthsPaid:{
        //     type:Number,
        //     required:true,
        // },
       
        // notes:{
        //     username:{
        //         type:String,
        //     },
        //     email:{
        //         type:String,
        //     },
        //     contact:{
        //         type:String,
        //     }
            
        // },
        // paymentMethod:{
        //     type:String,
        //   },
        //   paidAt:{
        //     type:Date,
           
        //   }
        const payment= new paymentModel({
            orderId:order.id,
            status:order.status,
            amount:order.amount,
            currency: order.currency,
            receipt:order.receipt,
            notes:order.notes

        })
        const savePayment= await payment.save();
        console.log(savePayment);
        



        res.send({...savePayment.toJSON(),keyId:process.env.RAZORPAY_KEY_ID})
        
        

        
    }catch(err){
        console.log(err);
 res.status(500).json({ msg: err });
 return;
        
        
    }
})

paymentRouter.post("/payment/webhook", async (req,res)=>{
   try {
    const webhookSignature = req.get("X-Razorpay-Signature"); // or req.headers["X-Razorpay-Signature"]
const isWebhookValid=validateWebhookSignature(JSON.stringify(req.body),
 webhookSignature, 
 process.env.RAZORPAY_WEBHOOK_SECRET
)
if(!isWebhookValid){
     res.status(400).json({error: "Invalid webhook signature"})
     return;
}
console.log(isWebhookValid);

//update payment status in db
const paymentDetails=req.body.payload.payment.entity;
console.log(paymentDetails);

const payment= await paymentModel.findOne({orderId:paymentDetails?.order_id});
if(!payment){
    res.status(200).json({msg:"No such Order"})
    return;
}
payment.status= paymentDetails.status;
await payment.save();

console.log("---------------");

console.log(payment);

//DATE MANIPULATION LOGIC 
const user= await User.findOne({_id:payment.notes?.userId});
if(!user){
    res.status(200).json({msg:"No such User"});
    return;
}
user.rentPaidUntil=new Date(Date.now());
await user.save();


//return success response to razorpay
    // if (req.body.event == "payment.captured") {

    // }

    // if (req.body.event == "payment.failed") {

    // }
 res.status(200).json({ msg: "Webhook recieved successfully" });
 return;


}
 catch(err){
    console.log(err);
    res.status(500).json({ msg: err });
    return;
 }


})



export default paymentRouter;

