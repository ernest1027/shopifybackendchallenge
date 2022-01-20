const express = require("express")
const LocationRouter = express.Router();
const Location = require("../models/location")
const {updateItemQuantities,Item} = require("../models/item");
const {Inventory,updateInventories,updateLocationDetails} = require("../models/inventory")

//Create location
//PARAMS:
//name: string
//description: string
//inventories: array (contains list of inventory objects for this location for all items)
LocationRouter.post('/', async (req, res, next) => {
    const {name, description} = req.body;
    let {inventories} = req.body;
    try {
        //Check if all inventory objects exist
        if(await (Item.countDocuments()) !== inventories.length)
        {
            throw new Error("Not all inventory data present")
        }

        //Save location
        const location = new Location(
            {name, description}
        )
        await location.save()

        //update quantities of items based on new inventory data
        await updateItemQuantities(inventories,true);

        //Save inventory data
        inventories = await updateLocationDetails(name, location._id.toString(), inventories)
        await Inventory.collection.insertMany(inventories)
        next({
            code: 200,
            data: {
                location,
                inventories
            }
        })
    } catch (err) {
        return next({
            code: 400,
            errors: {error: err.message}
        });
    }

})

//Get all locations
LocationRouter.get('/all', (req, res, next) => {
    try {
        Location.find().then((ret) => {
            next({
                code: 200,
                data: {locations: ret}
            })
        })
    } catch (err) {
        return next({
            code: 400,
            errors: {error: err.message}
        });
    }

})

//Get details of location
LocationRouter.get('/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
        //Get location details
        const location = await Location.findById(id)

        //Get related inventory data
        const inventories = await Inventory.find({locationId: id})
        next({
            code: 200,
            data: {location, inventories}
        })
    } catch (err) {
        return next({
            code: 400,
            errors: {error: err.message}
        });
    }
})

//Update inventory
//PARAMS:
//name: string
//description: string
//inventories: array (contains list of inventory objects for this location for all items)
LocationRouter.put('/:id', async (req, res, next) => {
    const {id} = req.params;
    const {name, description} = req.body;
    let {inventories} = req.body;
    try {
        //Check if all inventory objects exist
        if(await (Item.countDocuments()) !== inventories.length)
        {
            throw new Error("Not all inventory data present")
        }

        //update location details
        const location = await Location.findByIdAndUpdate(id, {
            name,
            description
        }, {new: true})

        //update quantities of items based on new inventory data
        await updateItemQuantities(inventories);

        //Update new inventory data
        inventories = await updateLocationDetails(name,id,inventories);
        await updateInventories(inventories);
        next({
            code: 200,
            data: {
                location,
                inventories
            }
        })
    } catch (err) {
        return next({
            code: 400,
            errors: {error: err.message}
        });
    }
})

module.exports = {LocationRouter}

