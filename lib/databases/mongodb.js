import mongoose from 'mongoose'
import express from "express";
import Router from "../routes/routes.js"
import 'dotenv/config';

mongoose.connect(process.env.MONGODB_CREDITS)

export default function connectMongodb(PORT) {
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "Database connection failed: "));
    db.once("open", function () {
        console.log("Connected successfully");
    });

    //Routes
    const app = express();
    app.use(Router)

    app.listen(PORT, () => {
        console.log(`MongoDB. Example app listening on port ${PORT}`)
    });
}