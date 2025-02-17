import express from "express"
import { Request,Response } from "express";
import {BlogsModel} from "../models/db"
import { userAuth,AuthRequest, checkAdmin } from "../middlewares/auth";
import upload from "../middlewares/multer";
import cloudinary from "../utils/cloudinary";
const blogRouter= express.Router();



blogRouter.post("/create", userAuth ,checkAdmin ,upload.array("images",6) ,async(req:AuthRequest,res:Response)=>{
try{
    let imgUrlArr:any=[];

if(req.files){
    const imgUpload= (req.files as Express.Multer.File[]).map((e:Express.Multer.File)=>{
      return cloudinary.uploader.upload(e.path)
      .then((result)=>{
        imgUrlArr.push(result.url);

      })
      .catch((err)=>{
        console.log(err);
        
      })
    })
    
    await Promise.all(imgUpload)
}

console.log(req.files);
console.log(req.body);

if (typeof req.body.titleBody === "string") {
    req.body.titleBody = JSON.parse(req.body.titleBody);
}

    
    const {heading, dateTime, location, titleBody}= req.body;
const blog= new BlogsModel({
    heading:heading,
    dateTime:dateTime,
    location:location,
    titleBody:titleBody,
    images:imgUrlArr
    


})
await blog.save();
res.status(201).json(blog);
}catch(err:any){
    res.status(500).json({message:err.message});
}

})


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
})

blogRouter.get("/all",userAuth ,async (req: AuthRequest, res: Response) => {
    try {
        const blogs = await BlogsModel.find();
        if (!blogs || blogs.length === 0) {
res.status(404).json({ message: "No blogs found" });
return;
        }
        res.status(200).json(blogs);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});


export default blogRouter;