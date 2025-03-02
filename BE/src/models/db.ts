import mongoose, { model, Schema } from "mongoose";

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
    shopName: {type: String},
    monthRent: {type: Number,
        default: 2000
    },
    currentRent: {type: Number,
        default: 2000
    },
    currentDonation: {type: Number,
        default: 0
    },
    totalDonation: {type: Number,
        default:0
    },
    rentPaidUntil: { type: Date 
    },
    monthstatus: { type: [Boolean],
        default: ()=> [true,false,false,false,false,false,false,false,false,false,false,false]
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
const PaymentSchema=new Schema({
        
        paymentId:{
            type:String,
        },
        orderId:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        },
        amount:{
            type:Number,
            required:true
        },
        currency:{
            type:String,
            required:true
        },
        receipt:{
            type:String,
            required:true
        },
        monthsPaid:{
            type:Number,
        },
        
        notes:{
            username:{
                type:String,
            },
            email:{
                type:String,
            },
            contact:{
                type:String,
            },
            userId:{
                type: Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            paymentType:{
                type:String,
                },
            months_paid:{
                type: Number
            }
        },
        paymentMethod:{
            type:String,
          },
          paidAt:{
            type:Date,
           
          },
},{timestamps:true});

PaymentSchema.pre("save", function (next) {
    if (this.status === "captured" && !this.paidAt) {
        this.paidAt = new Date();//bult here the logic
    }
    next();
});

export const paymentModel= model('Payment',PaymentSchema)



const InvoiceSchema= new Schema({
    userId:{
        type:Schema.Types.ObjectId ,
        ref:"User",
        required:true
    },
    receiptId:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    orderId:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true
    },
    downloadUrl:{
        type:String,
    }


},{timestamps:true})
InvoiceSchema.pre("save",function(next){
    if (this.url) {
        this.downloadUrl = this.url.replace("/upload/", "/upload/fl_attachment/");
    }
    next();
})
export const InvoiceModel=model('Invoice',InvoiceSchema)





