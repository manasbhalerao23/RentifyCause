import express from "express"
import { Request,Response } from "express";
import {BlogsModel} from "../models/db"
import { userAuth,AuthRequest, checkAdmin } from "../middlewares/auth";
import upload from "../middlewares/multer";
import cloudinary from "../utils/cloudinary";
const blogRouter= express.Router();



blogRouter.post("/create",upload.array("images",6) ,async(req:AuthRequest,res:Response)=>{ // add middlewares later rn for testing we have removed it --NOTE
try{
    let imgUrlArr:any=[];
    // console.log("Waiting 500ms to ensure files are ready...");
    // await new Promise(resolve => setTimeout(resolve, 500));
if(req.files){
    // Keep Cloudinary connection "warm" on server start

    for (const file of req.files as Express.Multer.File[]) {
        console.log(file);
        
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            timeout: 30000,
          });
          imgUrlArr.push(result.url);
        } catch (err) {
          console.error("Cloudinary Upload Error:", err);
          imgUrlArr.push(null); // Push null or handle the error gracefully
          res.status(500).json({message:err});
          return 
        }
      }
}

// console.log(req.files);
// console.log(req.body);


    
    const {heading, dateTime, location, body}= req.body;
    console.log(heading, dateTime, location,body);
    
const blog= new BlogsModel({
    heading:heading,
    dateTime:dateTime,
    location:location,
    body:body,
    images:imgUrlArr

});
await blog.save();
res.status(201).json(blog);
}catch(err:any){
    res.status(500).json({message:err.message});
}

});


blogRouter.delete("/delete",userAuth,checkAdmin ,async (req:AuthRequest,res:Response)=>{
    try{
        const id=req.body.id;
        const blog=await BlogsModel.findByIdAndDelete(id);
        if(!blog){
             res.status(404).json({message:"Blog not found"})
             return;
            }
            res.status(200).json(blog);
            }catch(err:any){
                res.status(500).json({message:err.message});
                }
});

blogRouter.get("/all" ,async (req: AuthRequest, res: Response) => { //,userAuth middleware ddaalna h for testing purposes its removed
    try {
        const blogs = await BlogsModel.find();
        if (!blogs || blogs.length === 0) {
            res.status(200).json({ message: "No blogs found" });
            return;
        }
        res.status(200).json(blogs);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

//check point for url
blogRouter.get("/open/:blogId",async (req: Request, res: Response) => {
    try{
        const {blogId} = req.params;
        //console.log(blogId);
        const blog = await BlogsModel.findById(blogId);
        if(!blog){
            res.status(200).json({
                message: "Empty blog"
            });
            return;
        }
        res.status(200).json(blog);
    }
    catch(e: any){
        res.status(500).json({
            message: e.message
        });
    }
})


export default blogRouter;