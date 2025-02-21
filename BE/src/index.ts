import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
dotenv.config();
import {Request, Response} from "express";
import authRouter from "./routes/auth"
import blogRouter from "./routes/blog";


const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.get("/",async (req:Request,res:Response)=>{
    res.send("Starting ")
    
})
app.use("/auth", authRouter);
app.use("/blog",blogRouter);


async function main() {
    await mongoose.connect(process.env.MONGO_URL as string);
    app.listen(3000);
}
const port = process.env.PORT || 4000;


main()
.then(()=>{
    console.log("Database Connected");
    app.listen(port,()=>{
        console.log("Server Running on "+ port);
        
    })
    
})
.catch((err) => {
    console.error("can't connect to Database");
  });



