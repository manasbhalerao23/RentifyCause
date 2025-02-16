import bcrypt from "bcrypt"
import express from "express"
import {User} from "../models/db"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import {Request , Response, Router} from "express"
dotenv.config()

const authRouter= express.Router();


authRouter.post("/login", async( req: Request, res: Response):Promise<void>=>{
  try{
    const {username, password} = req.body;
    const user = await User.findOne({username});
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

      res.json({ msg:user });
      return;


    

  }catch(err){
    console.log(err)
    res.status(500).json({ error: "Internal Server Error" });


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

    await user.save();

res.send("User added "+ user)
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