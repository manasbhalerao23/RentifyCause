import { model, Schema } from "mongoose";

//users
const UserSchema = new Schema({
    username : {type: String, unique: true},
    password : {type: String},
    role: {type: String, required: true},
    contact: {type: String},
    address: {type: String},
    shopName: {type: String, required: true},
    monthRent: {type: String},
    currentRent: {type: String},
    currentDonation: {type: String},
    totalDonation: {type: String}
    }
);

export const UserModel = model('User', UserSchema);


//admin
const AdminSchema = new Schema({
    username : {type: String, unique: true},
    password : {type: String},
    contact: {type: String},
    role: {type: String, required:true}
    }
);

export const AdminModel = model('Admin', AdminSchema);


//blogs
const BlogsSchema = new Schema({
    heading : {type: String, required: true},
    dateTime : {type: Date, required: true, default: Date.now},
    location : {type: String, required: true},
    titleBody : [{title: String,
                  body: String
                }]
})

export const BlogsModel = model('Blogs', BlogsSchema);


//payments