import { model, Schema } from "mongoose";

//users
const UserSchema = new Schema({
    username : {type: String, unique: true},
    email: {type:String , unique:true},
    password : {type: String},
    role: {type: String, required: true,
        default:"user"
    },
    contact: {type: String},
    address: {type: String},
    shopName: {type: String, required: true},
    monthRent: {type: String,
        default: "10000"
    },
    currentRent: {type: String,
        default: "10000"
    },
    currentDonation: {type: String,
        default: "0"
    },
    totalDonation: {type: String,
        default:"0"
    }
    },{ timestamps: true }
);

export const User = model('User', UserSchema);



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
    body: { type: String, required: true },
    images: [{ type: String }]
})

export const BlogsModel = model('Blogs', BlogsSchema);

//payments