import mongoose from "mongoose";
import express from "express";

const app = express();

async function main() {
    await mongoose.connect(process.env.MONGO_URL as string);
    app.listen(3000);
}

main();