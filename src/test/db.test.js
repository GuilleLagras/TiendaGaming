import mongoose from "mongoose";
import config from "../config/config.js";
 mongoose.
 connect(config.mongo_uri)
 .then(()=> console.log("Connected Data Base"))
 .catch((error)=> console.log(error))