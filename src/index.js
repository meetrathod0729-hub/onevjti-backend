import dotenv from "dotenv"

import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

// console.log("Cloudinary ENV:", {
//   cloud: process.env.CLOUDINARY_CLOUD_NAME,
//   key: process.env.CLOUDINARY_API_KEY,
//   secret: process.env.CLOUDINARY_API_SECRET ? "LOADED" : "MISSING"
// });


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
        
    })
})
.catch((err) => {
    console.log("Mongo DB connection FAILED!", err);
    
})

