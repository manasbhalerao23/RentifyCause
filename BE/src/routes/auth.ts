import bcrypt from "bcrypt"
import express from "express"
import {User} from "../models/db"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import {Request , Response, Router} from "express"
import { send } from "process"
import { AuthRequest, userAuth } from "../middlewares/auth"
dotenv.config()

const authRouter= express.Router();


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
      const token= jwt.sign({_id:user._id.toString()},process.env.JWT_KEY as string);

      res.cookie("token",token,{
        expires: new Date(Date.now()+10000000)
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
      res.json({ msg:sendingUser });
      return;


    

  }catch(err){
    console.log(err)
    res.status(500).json({ error: "Internal Server Error" });


  }
})

authRouter.post("/getInfo",userAuth,async (req:AuthRequest, res:Response)=>{
  try{

    const {id}= req.body;
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
    res.json({ msg:sendingUser });
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

authRouter.post("/logout", async (req:Request, res:Response) => {
res.cookie("token", null, {
  expires: new Date(Date.now()),
});
res.send("User Logged Out Successful!");


});


export default authRouter;