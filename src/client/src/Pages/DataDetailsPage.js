import {Box, Button, Container, Flex, Heading, Link, Table, Tbody, Td, Text, Th, Thead, Tr} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router";
import ViewInventoryTable from "../Components/ViewInventoryTable";

const axios = require("axios");
const {CONSTANTS} = require("../utils/CONSTANTS")

export default function DataDetailsPage({isLocation}) {
    const [dataDetails, setDataDetails] = useState({});
    const [inventories, setInventories] = useState([]);
    const {id} = useParams();
    const history = useHistory();
    const baseURL = CONSTANTS.BASE_URL + (isLocation ? '/location' : '/item')

    //Function to delete Item
    const deleteItem = async () => {
        await axios.delete(baseURL + id)
        history.push('/')
    }

    //Function to go to editing page
    const goToEditPage =   () => history.push((isLocation ? '/location' : '/item') + '/edit/' + id)

    //Make get request and set data
    useEffect(async () => {
        try {
            let ret = (await axios.get(baseURL + '/' + id)).data.data
            setInventories(ret.inventories);
            if (!isLocation) return setDataDetails(ret.item);
            setDataDetails(ret.location)
        } catch {
            setDataDetails(null);
        }
    }, [])


    if (dataDetails === null) return <Heading>Not a valid ID</Heading>
    return (
        <Box mx={10}>
            <Heading textAlign={"center"}>{isLocation ? 'Location' : 'Item'} Details</Heading>
            <Text>Name: {dataDetails.name}</Text>
            <Text>Description: {dataDetails.description}</Text>
            {isLocation
                ? <></>
                : <>
                    <Text>Quantity: {dataDetails.quantity}</Text>
                    <Text>Size: {dataDetails.size} m<sup>3</sup></Text>
                    <Text>Weight: {dataDetails.weight} Kg</Text>
                    <Text>Last Edited: {dataDetails.lastEdit}</Text>
                    <Button my={10} mr={10} onClick={deleteItem}>Delete item</Button>
                </>
            }
            <Button my={10} onClick={goToEditPage}>Edit Details/Inventory</Button>
            <Button my={10} mx={10} onClick={() => history.push('/')}>Go Back</Button>
            <ViewInventoryTable inventories={inventories}/>
        </Box>
    );
}

