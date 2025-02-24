import Razorpay from "razorpay"

import dotenv from "dotenv"
dotenv.config();


var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,//can be public too
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default instance;