const mongoose = require("../config/mongoose")

//Initialize location schema
const locationSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        unique:true
    },
    description:{
        type: String,
        default: "NO DESCRIPTION"
    },
})



module.exports = Location = mongoose.model("location", locationSchema)

