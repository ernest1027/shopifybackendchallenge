import {Box, Button, Container, Flex, Heading, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useHistory} from "react-router";
import {Link} from "react-router-dom";

const axios = require("axios");
const {CONSTANTS} = require("../utils/CONSTANTS")

export default function HomePage() {
    const [items, setItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const history = useHistory();

    //Get Items and Locations
    useEffect(async () => {
        setTimeout(async () => {
            let ret = await axios.get(CONSTANTS.BASE_URL + '/item/all');
            setItems(ret.data.data.items);
            ret = await axios.get(CONSTANTS.BASE_URL + '/location/all');
            setLocations(ret.data.data.locations);
        }, 200);
    }, [])

    return (
        <Box mx={10}>
            <Heading textAlign={"center"}>Shopify Backend Challenge</Heading>
            <Heading py={10}>
                Items
                <Button onClick={() => history.push('/item/new')} mx={10}>Add new item</Button><
                /Heading>
            <ItemTable setItems={setItems} items={items}/>
            <Heading py={10}>
                Locations
                <Button onClick={() => history.push('/location/new')} mx={10}> Add new location</Button>
            </Heading>
            <LocationTable locations={locations}/>
        </Box>
    );
}

function ItemTable({items, setItems}) {

    //Delete item
    const deleteItem = (id) => {
        return (async () => {
            await axios.delete(CONSTANTS.BASE_URL + '/item/' + id)
            setItems(items.filter(item => item._id != id))
        })
    }

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Quantity</Th>
                    <Th>View Details/Inventory</Th>
                    <Th>Edit Details/Inventory</Th>
                    <Th>Delete Item</Th>
                </Tr>
            </Thead>
            <Tbody>
                {items.map((item) => <ItemTableRow key={item._id} item={item} deleteItem={deleteItem(item._id)}/>)}
            </Tbody>
        </Table>
    )
}

function ItemTableRow({item, deleteItem}) {
    return (
        <Tr>
            <Td>{item._id}</Td>
            <Td>{item.name}</Td>
            <Td>{item.quantity}</Td>
            <Td><Link to={'/item/view/' + item._id}>View Details/Inventory</Link></Td>
            <Td><Link to={'/item/edit/' + item._id}>Edit Details/Inventory</Link></Td>
            <Td><Button onClick={deleteItem}>Delete item</Button></Td>
            <Td></Td>
        </Tr>
    )
}

function LocationTable({locations}) {
    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>View Details/Inventory</Th>
                    <Th>Edit Details/Inventory</Th>
                </Tr>
            </Thead>
            <Tbody>
                {locations.map((location) => <LocationTableRow key={location._id} location={location}/>)}
            </Tbody>
        </Table>
    )
}

function LocationTableRow({location}) {
    return (
        <Tr>
            <Td>{location._id}</Td>
            <Td>{location.name}</Td>
            <Td><Link to={'/location/view/' + location._id}>View Details/Inventory</Link></Td>
            <Td><Link to={'/location/edit/' + location._id}>Edit Details/Inventory</Link></Td>
        </Tr>
    )
}
