import bcrypt from "bcrypt"
import express from "express"
import {InvoiceModel, User} from "../models/db"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import {Request , Response, Router} from "express"
import { send } from "process"
import { AuthRequest, userAuth } from "../middlewares/auth"
dotenv.config()

const authRouter= express.Router();
//Fix this type error later
//@ts-ignore  
authRouter.post("/reconnection", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ error: "You need to login again (error=RT12)" });
      return 
    }

    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY as string) as JwtPayload;
    const _id = (decoded as JwtPayload)._id;
    
      if (!_id) {
        res.status(403).json({ error: "Invalid refresh token" });
        return 
      }
    

    const user = await User.findById(_id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return
    }

    // Generate a new access token
    const newAccessToken = jwt.sign({ _id: user._id }, process.env.JWT_KEY as string, { expiresIn: "30m" });

    const sendingUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      address: user.address,
      contact: user.contact,
      currentDonation: user.currentDonation,
      currentRent: user.currentRent,
      monthRent: user.monthRent,
      totalDonation: user.totalDonation,
      role: user.role,
      shopName: user.shopName,
      monthStatus: user.monthstatus
    };

    return res.json({ msg: sendingUser, token: newAccessToken });
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: "Internal server error" });
  }
});



authRouter.post("/login", async( req: Request, res: Response):Promise<void>=>{
  try{
    const {username, password} = req.body;
    
    console.log(username);
    
    let user = await User.findOne(
      {$or:[{username},
        {email:username}
      ]}
    );
    console.log(user);
    
    
    if(!user){
    
       res.status(400).json({ error: "Not Found User" });
       return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password as string);
    if(!isValidPassword){
       res.status(400).json({ error: "Invalid credentials" });
       return;
      }

  const accessToken= jwt.sign({_id:user._id},process.env.JWT_KEY as string, {expiresIn:"30m"});
  const refreshToken= jwt.sign({_id:user._id},process.env.JWT_REFRESH_KEY as string, {expiresIn:"7d"});

  res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    // secure:true //after HTTPS certification,
    sameSite:"strict"
  })


  
      const sendingUser={
        _id:user._id,
        username:user.username,
        email:user.email,
        address:user.address,
        contact:user.contact,
        currentDonation:user.currentDonation,
        currentRent:user.currentRent,
        monthRent:user.monthRent,
        totalDonation:user.totalDonation,
        role:user.role,
        shopName:user.shopName,
        monthStatus:user.monthstatus

      }
    console.log(user?.monthstatus);
console.log(sendingUser.monthStatus);
      res.json({ msg:sendingUser, token:accessToken });
      return;


    

  }catch(err){
    console.log(err)
    res.status(500).json({ error: "Internal Server Error" });


  }
})

authRouter.post("/getInfo",userAuth,async (req:AuthRequest, res:Response)=>{
  try{

    const {id, orderId}= req.body;
    if(!id){
      res.status(400).json({ error: "Id not found" });
      return;
    }
    const user= await User.findById(id);
    if(!user){
      res.status(400).json({ error: "Not Found User" });
      return;
      }

    const sendingUser={
      _id:user._id,
      username:user.username,
      email:user.email,
      address:user.address,
      contact:user.contact,
      currentDonation:user.currentDonation,
      currentRent:user.currentRent,
      monthRent:user.monthRent,
      totalDonation:user.totalDonation,
      role:user.role,
      shopName:user.shopName,
      monthStatus:user.monthstatus

    }
let order;
    if(orderId){
       order= await InvoiceModel.findOne({orderId:orderId});

    }

    res.json({ msg:sendingUser, downloadUrl:order?.downloadUrl, Url: order?.url });
    return;



  }catch(err){
    console.log(err)
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
})

authRouter.post("/signup",async (req: Request,res: Response)=>{

    try{
            
const {username, password, contact, address, shopName,email }= req.body;
const hashedPassword = await bcrypt.hash(password, 10);
const user = new User({
    username,
    password: hashedPassword,
    contact,
    address,
    shopName,
    email,
    role:"user"
    });

    const sendingUser={
      username:user.username,
      email:user.email,
      contact:user.contact,
      address:user.address,
      shopName:user.shopName,
      role:user.role

    }

    await user.save();

res.send("User added "+ sendingUser)
    }catch(err){
        console.log(err);
        
    }
})

authRouter.post("/logout", userAuth,async (req:Request, res:Response) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0), 
  });
res.json({msg :"User Logged Out Successful!"} );


});


export default authRouter;