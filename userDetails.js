const mongoose = require("mongoose")

const userDetailsSchema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    password : String
},{
    collection: "userInfo"
})

const user = mongoose.model("userInfo",userDetailsSchema)
module.exports = user