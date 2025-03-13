
import express from "express";
import { InvoiceModel, paymentModel, User } from "../models/db";
import { checkAdmin, verifyAcessToken } from "../middlewares/auth";
import ExcelJs from "exceljs"
import fs from "fs"
import cloudinary from "../utils/cloudinary";
import path from "path"

const adminrouter = express.Router();

adminrouter.get("/getRentDonations", async (req, res) => {
    try{
        const resp = await paymentModel.find({status: "captured"});
        res.json({resp});
    }
    catch(e){
        console.log(e);
    }
})

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


    adminrouter.post("/extempt" ,async(req,res)=>{ //,verifyAcessToken,checkAdmin
        try{
            const id = req.body.id;
            const changeMonth= req.body.index;
            const user = await User.findById(id);
            if(!user){
                res.status(404).json({message: "User not found"});
                return ;
            }
            // user.monthstatus[changeMonth]=null
            if (changeMonth < 0 || changeMonth >= user.monthstatus.length) {
                res.status(400).json({ message: "Invalid month index" });
                return 
            }

            (user.monthstatus as (boolean | null)[])[changeMonth] = null;
            await user.save();
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
            res.send({user:DatatoSend});
        }catch(err){
            console.log(err);
            res.status(500).json({message:"Error while doing the Task"})
            return;
        }
    })

    adminrouter.post("/generate-receipts", async (req, res) => {
        try {
          const date = req.body.date;
          if (!date) { res.status(400).json({ error: "Date is required" });
          return}
          const startOfDay = new Date(date);
          startOfDay.setUTCHours(0, 0, 0, 0);
          
          const endOfDay = new Date(date);
          endOfDay.setUTCHours(23, 59, 59, 999);
          // Fetch payments from DB
          const payments = await paymentModel.find({
            updatedAt:{ $gte: startOfDay, $lte: endOfDay },
            "notes.paymentType":"rent",
            status:"captured"
            }); // Adjust for SQL queries if needed
      
          if (!payments.length) { res.status(404).json({ message: "No payments found" });
          return}
      
          // Create Excel file
          const workbook = new ExcelJs.Workbook();
          const sheet = workbook.addWorksheet("Rent Receipts");
      
          // Add Headers
          sheet.columns = [
            {header: "Name", key:"name", width:20},
            {header: "Contact", key:"contact", width:15},
            {header: "Email", key:"email", width:15},
            { header: "Amount Paid", key: "amount", width: 15 },
            {header:"Months Paid", key:"monthsPaid",width:10},
            { header: "Receipt ID", key: "receiptId", width: 20 },
            { header: "Order Id", key: "orderId", width: 20 },
            { header: "Date", key: "date", width: 20 },
          ];
      
          // Add Data
          payments.forEach((payment) => {
            sheet.addRow({
                name: payment?.notes?.username,
                contact: payment?.notes?.contact,
                email: payment?.notes?.email,
              amount: payment.amount,
              monthsPaid: payment?.notes?.months_paid,
              receiptId: payment.receipt, 
              orderId: payment.orderId,
              date: payment.updatedAt.toISOString().split("T")[0],
            });
          });
      
          // Save to a temp file
          const filePath = `./receipts_${date}.xlsx`;
          await workbook.xlsx.writeFile(filePath);
      
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "raw",
            folder: "rent_receipts",
          });
      
          // Delete local file
          fs.unlinkSync(filePath);
      
          res.json({ message: "Receipt generated", url: result.url });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      });

      adminrouter.post("/generate-excel", async (req, res) => {
        try {
            const { date, month } = req.body;
            let payments;
    
            if (date) {
                const startOfDay = new Date(date);
                startOfDay.setUTCHours(0, 0, 0, 0);
    
                const endOfDay = new Date(date);
                endOfDay.setUTCHours(23, 59, 59, 999);
    
                payments = await paymentModel.find({
                    updatedAt: { $gte: startOfDay, $lte: endOfDay },
                    "notes.paymentType": "rent",
                    status: "captured",
                });
            } else if (month) {
                console.log("Received month:", month);

                const startOfMonth = new Date();
    startOfMonth.setUTCMonth(month, 1); // Set the given month (0-based)
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
    endOfMonth.setDate(0); // Last day of the month
    endOfMonth.setUTCHours(23, 59, 59, 999);

    console.log("Filtering payments from:", startOfMonth, "to", endOfMonth);

    payments = await paymentModel.find({
        updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
        "notes.paymentType": "rent",
        status: "captured",
    });
            } else {
                res.status(400).json({ error: "Either date or month is required" });
                return
            }
            console.log("Payments Data:", payments);
            if (!payments) {
                res.json({ message: "No payments found" });
                return
            }
    
            // Create Excel file
            const workbook = new ExcelJs.Workbook();
            const sheet = workbook.addWorksheet("Rent Receipts");
    
            // Add Headers
            sheet.columns = [
                { header: "Name", key: "name", width: 20 },
                { header: "Contact", key: "contact", width: 15 },
                { header: "Email", key: "email", width: 15 },
                { header: "Amount Paid", key: "amount", width: 15 },
                { header: "Months Paid", key: "monthsPaid", width: 10 },
                { header: "Receipt ID", key: "receiptId", width: 20 },
                { header: "Order Id", key: "orderId", width: 20 },
                { header: "Date", key: "date", width: 20 },
            ];
    
            // Add Data
            payments.forEach((payment) => {
                sheet.addRow({
                    name: payment?.notes?.username,
                    contact: payment?.notes?.contact,
                    email: payment?.notes?.email,
                    amount: payment.amount,
                    monthsPaid: payment?.notes?.months_paid,
                    receiptId: payment.receipt,
                    orderId: payment.orderId,
                    date: payment.updatedAt.toISOString().split("T")[0],
                });
            });
    
            // Save file to a temporary directory
            const fileName = date ? `receipts_${date}.xlsx` : `receipts_${month}.xlsx`;
            const filePath = path.join(__dirname, "../temp", fileName);
            await workbook.xlsx.writeFile(filePath);
    
            res.download(filePath, fileName, (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                    res.status(500).json({ error: "Error generating file" });
                }
            
                // Delete file after sending
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) console.error("Error deleting file:", unlinkErr);
                });
            });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
export default adminrouter;