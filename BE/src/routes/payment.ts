import express from "express"
import dotenv from "dotenv"
import { AuthRequest, userAuth } from "../middlewares/auth";
import razorpayInstance from "../config/razorpay"
import { Response } from "express";
import {BlogsModel, InvoiceModel, paymentModel, User} from "../models/db"
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import { generateRentInvoice } from "../utils/invoiceGeneration";

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

const getmonths = (months_paid: boolean [], num: number) => {
    let months = 0;
    const currentmonth = new Date().getMonth();
    console.log("current"+ currentmonth);
    

    for(let i=0; i < months_paid.length; i++){
        if(!months_paid[i] && i <= currentmonth){
            months++;
            if(months === num){
                break;
            }
        }
    }
    return months;
};

paymentRouter.post("/payment/create", userAuth, async (req:AuthRequest,res:Response): Promise<void> =>{
    try{
        // const {amount}=req.body;
        // const {email,contact,username,id}= req?.user;
        const id= req.user?.id ?? "";
        const email= req.user?.contact ?? "";
        const contact= req.user?.contact ?? "";
        const username= req.user?.username ?? "";
        const {num}= req.body // Num= number of month
        if(num<=0 || num>3){
            res.status(500).json({msg: "Invalid number of months"})
            return;
        }
        
        const user = await User.findById(id);
        if(!user){
            res.status(404).json({message: "User not found"});
            return;
        }
        
        const months_paid = user.monthstatus;
        const payablemonths = getmonths(months_paid,num);
// console.log(months_paid);
// console.log(payablemonths);

user.save();
console.log(user.monthstatus);

        if(payablemonths === 0){
            res.status(200).json({
                message: "no dues"
            });
            return;
        }

        const order= await razorpayInstance.orders.create({
            amount:100*payablemonths,//amount ko dynamic baad mein karte hai
            currency:"INR",
            receipt:`rcpt_r_${id.slice(-6)}_${Date.now().toString().slice(-6)}`,
            notes:{
                userId:id,
                email:email,
                contact:contact,
                username:username,
                paymentType:"rent" ,
                months_paid: payablemonths
            }

        })
        const receiptID= order.receipt;
        
        
        const payment= new paymentModel({
            orderId:order.id,
            status:order.status,
            amount:order.amount,
            currency: order.currency,
            receipt:order.receipt,
            notes:order.notes,
            

        })
        const savePayment= await payment.save();
        console.log(savePayment);
        


        res.send({...savePayment.toJSON(),keyId:process.env.RAZORPAY_KEY_ID,receiptId:receiptID})
        return;
        

        
    }catch(err){
        console.log(err);
 res.status(500).json({ msg: err });
 return;
        
        
    }
})

paymentRouter.post("/payment/create/donate/:Did", userAuth, async (req:AuthRequest,res:Response): Promise<void> =>{
    try{
        
        const id= req.user?.id ?? "";
        const {Did}= req.params ?? "";
        const email= req.user?.contact ?? "";
        const contact= req.user?.contact ?? "";
        const username= req.user?.username ?? "";
        const {num}= req.body // Num= number of month
        const Arr= [10000 , 7500 , 5000, 2000, 1000, 500, 200, 100, 50];


        if(num<0 || num>9){
            res.status(500).json({msg: "Invalid selection"})
            return;
        }   
        
        const user = await User.findById(id);
        if(!user){
            res.status(404).json({message: "User not found"});
            return;
        }
        
// console.log(months_paid);
// console.log(payablemonths);

user.save();

       

        const order= await razorpayInstance.orders.create({
            amount:100,//amount ko dynamic baad mein karte hai  *Arr[num]
            currency:"INR",
            receipt:`rcpt_d_${id.slice(-6)}_${Date.now().toString().slice(-6)}`,
            notes:{
                userId:id,
                email:email,
                contact:contact,
                username:username,
                paymentType:"donation" ,
                donationId:Did
            }

        })
        const receiptID= order.receipt;
        
        
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
        


        res.send({...savePayment.toJSON(),keyId:process.env.RAZORPAY_KEY_ID,receiptId:receiptID})
        return;
        

        
    }catch(err){
        console.log(err);
 res.status(500).json({ msg: err });
 return;
        
        
    }
})

paymentRouter.post("/payment/webhook", async (req,res): Promise<void> => {
   try {
    const webhookSignature = req.get("X-Razorpay-Signature"); // or req.headers["X-Razorpay-Signature"]
const isWebhookValid=validateWebhookSignature(JSON.stringify(req.body),
 webhookSignature as string, 
 process.env.RAZORPAY_WEBHOOK_SECRET as string
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
console.log(payment);
if(!payment){
    res.status(200).json({msg:"No such Order"})
    return;
}
payment.status= paymentDetails.status;
await payment.save();



console.log(payment);
console.log(payment.notes?.userId);
if(payment.notes?.paymentType=="donation"){
    if(paymentDetails.status=="captured"){
        const user = await User.findById(payment.notes?.userId);
     console.log("user");
     
     if(!user){
         console.log("user");
         
         res.status(200).json({message: "No user found"});
         return ;
     }
 
    
     user.totalDonation+=payment.amount/100;
     
 
    
 
     await user.save().then(()=>console.log("Updated")).catch(err=>console.log(err));
        //  // receiptNo: string;
        //  // orderId: string;
        //  // date: string;
        //  // tenantName: string;
        //  // propertyAddress: string;
        //  // monthsPaid: number;
        //  // monthlyRent: number;
        //  // totalRent: number;
        //  // paymentMode: string;
        //  // transactionId: string;
        //  const data = {
        //      receiptNo:payment.receipt ?? "",
        //      orderId: payment.orderId ,
        //      date: new Date(Date.now()),
        //      tenantName: user.username ?? "",
        //      propertyAddress:user.address  ?? "",
        //      monthsPaid:payment.notes?.months_paid?.toString() ?? "",
        //      monthlyRent:user.monthRent.toString() ?? "",
        //      totalRent:(payment.amount/100).toString() ?? "",
        //      paymentMode:paymentDetails?.method.toString() ?? "",
        //      transactionId:paymentDetails?.id.toString() ?? ""
        //  }
        //  const url = await generateRentInvoice(data);
 
        //  //lets create an entry in invoiceModel from db.ts now
        //  // userId:{
        //  //     type:Schema.Types.ObjectId ,
        //  //     ref:"User",
        //  //     required:true
        //  // },
        //  // receiptId:{
        //  //     type:String,
        //  //     required:true
        //  // },
        //  // url:{
        //  //     type:String,
        //  //     required:true
        //  // },
        //  // orderId:{
        //  //     type:String,
        //  //     required:true,
        //  // },
        //  // date:{
        //  //     type:Date,
        //  //     required:true
        //  // }
        //  const invoice = new InvoiceModel({
        //      receiptId: data.receiptNo,
        //      orderId: data.orderId,
        //      date: data.date,
        //      userId: user._id,
        //      url: url
        //  });
        //  // save the invoice in the database
        //  await invoice.save();
        const blogId= payment.notes?.donationId
        const currBlog= await BlogsModel.findById(blogId);
        if(!currBlog){
         res.status(200).json({message: "No Blog found"});
         return;

        }
      
        currBlog.donationRecieved+= payment.amount/100;
        
      
 
     }
}else{



    const user = await User.findById(payment.notes?.userId);
    console.log("user");
    
    if(!user){
        console.log("user");
        
        res.status(200).json({message: "No user found"});
        return ;
    }

    let paid_months = user.monthstatus;//arr
    let monthsupdate = payment.notes?.months_paid;//months payment
    console.log("arr" +paid_months );
    console.log("Months update "+ monthsupdate);
    

    const currentmonth = new Date().getMonth();  
    console.log("curr"+currentmonth);
    
    for(let i=0; i < paid_months.length; i++){  
        if(!paid_months[i] && i <= currentmonth && monthsupdate as number > 0){
            paid_months[i] = true;
            (monthsupdate as number)--;
        }

        if(monthsupdate==0){
            break;
        }
    }
    console.log("updated arr"+paid_months);
    
    // user.monthstatus = paid_months;
    user.set("monthstatus", paid_months) 
user.rentPaidUntil=new Date(Date.now());

    await user.save().then(()=>console.log("Updated")).catch(err=>console.log(err));


    if(paymentDetails.status=="captured"){
        // receiptNo: string;
        // orderId: string;
        // date: string;
        // tenantName: string;
        // propertyAddress: string;
        // monthsPaid: number;
        // monthlyRent: number;
        // totalRent: number;
        // paymentMode: string;
        // transactionId: string;
        const data = {
            receiptNo:payment.receipt ?? "",
            orderId: payment.orderId ,
            date: new Date(Date.now()),
            tenantName: user.username ?? "",
            propertyAddress:user.address  ?? "",
            monthsPaid:payment.notes?.months_paid?.toString() ?? "",
            monthlyRent:user.monthRent.toString() ?? "",
            totalRent:(payment.amount/100).toString() ?? "",
            paymentMode:paymentDetails?.method.toString() ?? "",
            transactionId:paymentDetails?.id.toString() ?? ""
        }
        const url = await generateRentInvoice(data);

        //lets create an entry in invoiceModel from db.ts now
        // userId:{
        //     type:Schema.Types.ObjectId ,
        //     ref:"User",
        //     required:true
        // },
        // receiptId:{
        //     type:String,
        //     required:true
        // },
        // url:{
        //     type:String,
        //     required:true
        // },
        // orderId:{
        //     type:String,
        //     required:true,
        // },
        // date:{
        //     type:Date,
        //     required:true
        // }
        const invoice = new InvoiceModel({
            receiptId: data.receiptNo,
            orderId: data.orderId,
            date: data.date,
            userId: user._id,
            url: url
        });
        // save the invoice in the database
        await invoice.save();

     

    }
}
//DATE MANIPULATION LOGIC 

 
//return success response to razorpay
    // if (req.body.event == "payment.captured") {

    // }

    // if (req.body.event == "payment.failed") {

    // }
 res.status(200).json({msg:"Webhook recieved successfully"});
 return;


}
 catch(err){
    console.log(err);
    res.status(500).json({ msg: err });
    return;
 }


})


paymentRouter.post("/donation/payment/webhook", async (req,res): Promise<void> => {
    try {
     const webhookSignature = req.get("X-Razorpay-Signature"); // or req.headers["X-Razorpay-Signature"]
 const isWebhookValid=validateWebhookSignature(JSON.stringify(req.body),
  webhookSignature as string, 
  process.env.RAZORPAY_WEBHOOK_SECRET as string
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
 console.log(payment);
 if(!payment){
     res.status(200).json({msg:"No such Order"})
     return;
 }
 payment.status= paymentDetails.status;
 await payment.save();
 
 
 
 console.log(payment);
 console.log(payment.notes?.userId);
 
 
     
 
 
    
 
 //DATE MANIPULATION LOGIC 
 
  
 //return success response to razorpay
     // if (req.body.event == "payment.captured") {
 
     // }
 
     // if (req.body.event == "payment.failed") {
 
     // }
  res.status(200).json({msg:"Webhook recieved successfully"});
  return;
 
 
 }
  catch(err){
     console.log(err);
     res.status(500).json({ msg: err });
     return;
  }
 
 
 })


export default paymentRouter;

