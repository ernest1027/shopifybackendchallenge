const mongoose = require("mongoose");
const {MONGOURL} = require("./CONSTANTS")

//Code to connect to MongoDB
mongoose.connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then((result) => {
        console.log("connected");
    })
    .catch((error) => {
        console.log(error.message);
    });

module.exports = (mongoose);