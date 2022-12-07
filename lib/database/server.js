import express from 'express';
import mongoose from 'mongoose'
import Router from "../index.js"

const PORT = process.env.PORT || 3030;
const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://grialtt:Kayota2009@serverapptodolist.im69p3a.mongodb.net/?retryWrites=true&w=majority")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Database connection failed: "));
db.once("open", function () {
    console.log("Connected successfully");
});

app.use(Router);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})