const express = require("express")
const {getTotalQuantity} = require("../models/inventory");
const ItemRouter = express.Router();
const {Item} = require("../models/item")
const {updateItemDetails} = require("../models/inventory");
const {Inventory, updateInventories} = require("../models/inventory")
const Location = require("../models/location")


//Get all items
ItemRouter.get('/all', (req, res, next) => {
    const {id} = req.params;
    try {
        //Find all items in database
        Item.find().then((ret) => {
            next({
                code: 200,
                data: {items: ret}
            })
        })
    } catch (err) {
        return next({
            code: 400,
            errors: {error: err.message}
        });
    }

})

//Get item details including inventory data
ItemRouter.get('/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        //Find Item by ID
        const item = await Item.findById(id)

        //Find related inventory data by item ID
        const inventories = await Inventory.find({itemId: id})

        next({
            code: 200,
            data: {item, inventories}
        })
    } catch (err) {
        return next({
            code: 400,
            errors: {error: err.message}
        });
    }
})

//Create item
//PARAMS:
//name: string
//description: string
//size: number
//weight: number
//inventories: array (contains list of inventory objects for this item for all locations)
ItemRouter.post('/', async (req, res, next) => {
    const {name, description, size, weight} = req.body;
    let {inventories} = req.body;
    try {
        //Check if all inventory objects exist
        if(await (Location.countDocuments()) !== inventories.length)
        {
            throw new Error("Not all inventory data present")
        }

        //Get total Quantity
        const quantity = getTotalQuantity(inventories)

        //Save item details
        const item = new Item(
            {
                name, description, size, weight, quantity
            }
        )
        await item.save()

        //Save inventory details
        inventories = updateItemDetails(name, item._id.toString(), inventories)
        await Inventory.collection.insertMany(inventories)
        next({
            code: 200,
            data: {
                item,
                inventories,
                quantity
            }
        })
    } catch (err) {
        return next({
            code: 400,
            errors: {error: err.message}
        });
    }
})

//Delete item
ItemRouter.delete('/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        //Delete item details
        const item = await Item.findByIdAndDelete(id)

        //Delete all related inventory
        await Inventory.deleteMany({itemId: id})
        next({
            code: 200,
            data: {
                item
            }
        })
    } catch (err) {
        return next({
            code: 400,
            errors: {error: err.message}
        });
    }
})

//Update item detail
//PARAMS:
//name: string
//description: string
//size: number
//weight: number
//inventories: array (contains list of inventory objects for this item for all locations)
ItemRouter.put('/:id', async (req, res, next) => {
    const {id} = req.params;
    const {name, description, size, weight} = req.body;
    let {inventories} = req.body;
    try {
        //Check if all inventory objects exist
        if(await (Location.countDocuments()) !== inventories.length)
        {
            throw new Error("Not all inventory data present")
        }

        //Calculate total quantity and update item
        const quantity = getTotalQuantity(inventories)
        const item = await Item.findByIdAndUpdate(id, {
            name,
            description,
            size,
            weight,
            quantity,
            lastEdit: Date.now()
        }, {new: true})

        //Updates inventory data
        inventories = updateItemDetails(name, id, inventories)
        updateInventories(inventories);
        next({
            code: 200,
            data: {
                item,
                inventories,
                quantity
            }
        })
    } catch (err) {
        return next({
            code: 400,
            errors: {error: err.message}
        });
    }
})

module.exports = {ItemRouter}

