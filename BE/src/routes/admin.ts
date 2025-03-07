
import express from "express";
import { InvoiceModel, paymentModel, User } from "../models/db";
import { checkAdmin, verifyAcessToken } from "../middlewares/auth";

const adminrouter = express.Router();

adminrouter.get("/getpaydetails",verifyAcessToken ,checkAdmin ,async (req, res) => {
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



adminrouter.get("/getall" ,verifyAcessToken ,checkAdmin, async (req, res) => {
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


adminrouter.get("/getInfo/:id" ,verifyAcessToken ,checkAdmin, async (req, res) => {
try{
    const id = req.params.id;
    const payments = await paymentModel.find({ "notes.userId": id });

const orderIds = payments.map(p => p.orderId); // Extract orderIds from payments

const invoicesUrl = await InvoiceModel.find({ orderId: { $in: orderIds } }) // Find invoices for the orderIds
  .select("orderId url downloadUrl"); // Only select required fields

// Merge invoices into payments
const paymentsWithInvoices = payments.map(payment => {
  const invoice = invoicesUrl.find(inv => inv.orderId === payment.orderId);
  return {
    ...payment.toObject(),
    url: invoice ? invoice.url : null,
    downloadUrl: invoice ? invoice.downloadUrl : null
  };
});
    const invoices= await InvoiceModel.find({userId:id});

    const user = await User.findById(id);
    if(!user){
        res.status(404).json({message: "User not found"});
        return ;
    }
    const {
        _id,
        username,
        totalDonation,
        shopName,
        role,
        monthstatus,
        monthRent,
        email,
        currentRent,
        contact,
        address
    } = user
    const DatatoSend = {
        _id,
        username,
        totalDonation,
        shopName,
        role,
        monthstatus,
        monthRent,
        email,
        currentRent,
        contact,
        address}
    res.send({payments:paymentsWithInvoices, invoices:invoices, user:DatatoSend});
    return;

}catch(err){
    console.log(err);
    res.status(500).json({message: "Error while fetching user info"});
    return;
}
})

export default adminrouter;