const mongoose = require("../config/mongoose")

//Initializes schema for Inventory collection
const inventorySchema = new mongoose.Schema({
    locationId:{
        type: String,
        require: true,
    },
    itemId:{
        type: String,
        require: true
    },
    locationName:{
        type: String,
        require: true
    },
    itemName:{
        type: String,
        require: true
    },
    quantity:{
        type: Number,
    }
})

Inventory = mongoose.model("inventory", inventorySchema)

//Updates set of inventories
const updateInventories = (inventories) =>{
    inventories.forEach(async (inventory)=>{
        console.log(inventory);
       await  Inventory.findByIdAndUpdate(inventory._id, inventory);
    })
}

//Updates location details in set of inventories
const updateLocationDetails = (name, id, inventories)=>{
    return inventories.map((inventory)=>{
        return {
            ...inventory,
            locationName: name,
            locationId: id
        }
    })
}

//Updates item details in set of inventories
const updateItemDetails = (name, id, inventories)=>{
    return inventories.map((inventory)=>{
        return {
            ...inventory,
            itemName: name,
            itemId: id
        }
    })
}

//Calculates total quantity in set of inventories
const getTotalQuantity = (inventories) =>{
    return inventories.reduce((previous, current) => previous + current.quantity, 0)
}

module.exports = {updateInventories, Inventory, updateItemDetails, updateLocationDetails,getTotalQuantity}

