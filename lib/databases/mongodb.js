import mongoose from 'mongoose'
import express from "express";
import Router from "../routes/routes.js"



mongoose.connect("mongodb+srv://grialtt:Kayota2009@serverapptodolist.im69p3a.mongodb.net/?retryWrites=true&w=majority")

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