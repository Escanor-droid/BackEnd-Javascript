// require("dotenv").config({path: './.env'});

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
});


connectDB().then(() => {
    app.on("error" , ((err) => {
        console.log("Error starting the server", err);
        throw err;
    }))
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port ${process.env.PORT}`)
    })

}).catch((err) => {
    console.log("MONGODB Connection failed !!!", err);
})

































// import express from "express";

// const app = express();

// ( async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (err) => {
//             console.error("Error starting the server", err);
//             throw err;
//         });

//         app.listen(process.env.PORT,() => {
//             console.log(`Server started on port ${process.env.PORT}`);
//         })
//     }catch(err){
//         console.error("Error connecting to the database", err);
//         throw err;
//     }
// })()