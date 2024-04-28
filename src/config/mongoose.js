const mongoose = require("mongoose");
const {mongoUrl} = require("../config/vars")

exports.databaseConnection =async ()=>{
    try {
        await mongoose.connect(mongoUrl)
        console.log("database connected")
    } catch (error) {
        console.log(error)
    }
}