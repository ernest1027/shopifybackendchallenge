const mongoose = require("../config/mongoose")
const {Inventory} = require("./inventory")

//Initializes Item Schema
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String,
        default: "NO DESCRIPTION"
    },
    size: {
        type: Number,
        require: true
    },
    weight: {
        type: Number,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    lastEdit: {
        type: Date,
        default: Date.now()
    }
})

Item = mongoose.model("item", itemSchema)

//Updates quantity of items based on set of inventories
const updateItemQuantities = (inventories,isNew) => {
    inventories.forEach(async (inventory) => {
        const oldQuantity = isNew? 0:(await Inventory.findById(inventory._id)).quantity
        const difference = inventory.quantity - oldQuantity;
        await Item.findByIdAndUpdate(inventory.itemId, {$inc: {quantity: difference}})
    })
}

module.exports = {Item, updateItemQuantities}

