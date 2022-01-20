import {
    Box,
    Button,
    FormControl, FormHelperText, FormLabel,
    Heading, Input,
    Link,
    Table,
    Tbody,
    Td, Textarea,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router";
import EditInventoryTable from "../Components/EditInventoryTable";

const axios = require("axios");
const {CONSTANTS} = require("../utils/CONSTANTS")

export default function AddEditDataPage(props) {
    const [inventories, setInventories] = useState({});
    const [dataName, setDataName] = useState('');
    const [description, setDescription] = useState('');
    const [weight, setWeight] = useState(0);
    const [size, setSize] = useState(0);
    const [invalidId, setInvalidId] = useState(false);
    const [hasInvalidInput, setHasInvalidInput] = useState(false)
    const history = useHistory();
    const {id} = useParams();

    const baseURL = CONSTANTS.BASE_URL + (props.isLocation ? '/location' : '/item')

    //Fill in exisiting details if page is edit page
    useEffect(async () => {
        if (!props.isEditPage) return;
        try {
            let newInventories = {};
            let ret = (await axios.get(baseURL + '/' + id)).data.data


            if (props.isLocation) {
                setDataName(ret.location.name);
                setDescription(ret.location.description);
                ret.inventories.forEach((inventory) => newInventories[inventory.itemId] = inventory)
            }


            else {
                setDataName(ret.item.name);
                setDescription(ret.item.description);
                setWeight(ret.item.size);
                setSize(ret.item.weight);
                ret.inventories.forEach((inventory) => newInventories[inventory.locationId] = inventory)
            }


            setInventories(newInventories)
        } catch (e) {
            setInvalidId(true);
        }
    }, [])

    //Render if there is no invalid id
    if (invalidId) return <Heading>Not a valid ID</Heading>

    //Process form submission
    const submitForm = async (e) => {
        e.preventDefault();

        //Format inventory data
        const inventoriesArray = []
        for (const id in inventories) {
            inventoriesArray.push(inventories[id])
        }

        //Format request
        const request = {
            name: dataName,
            description,
            weight,
            size,
            inventories: inventoriesArray
        }

        //Make request
        try {
            if (props.isEditPage) {
                await axios.put(baseURL + '/' + id, request);
            } else {
                await axios.post(baseURL, request);
            }
            history.push('/')
        } catch (e) {
            setHasInvalidInput(true);

        }
    }


    return (
        <Box mx={10}>
            <Heading textAlign={"center"}>Shopify Backend Challenge</Heading>
            {hasInvalidInput ? <Heading>Please ensure all inputs are valid</Heading> : <></>}
            <Heading fontSize={'lg'} textAlign={"center"}>Add New {props.isLocation ? 'Location' : 'Item'}</Heading>
            <form onSubmit={submitForm}>
                <FormControl>
                    <CustomFormInput
                        value={dataName}
                        stateSetter={setDataName}
                        label={'Name'}
                        helperText={'Provide a name. Name should be unique!'}
                        htmlId={'itemName'}/>
                    <CustomFormInput
                        value={description}
                        stateSetter={setDescription}
                        label={'Description'}
                        helperText={'Provide a description.'}
                        htmlId={'description'}/>
                    {props.isLocation
                        ? <></>
                        : (<>
                            <CustomFormInput
                                value={size}
                                stateSetter={setSize}
                                label={<p>Size (m<sup>3</sup>)</p>}
                                helperText={'Provide a size for the item in cubic metres.'}
                                htmlId={'size'}/>
                            <CustomFormInput
                                value={weight}
                                stateSetter={setWeight}
                                label={'Weight (Kg)'}
                                helperText={'Provide a weight for the item in kilograms.'}
                                htmlId={'weight'}/>
                        </>)}
                    <Heading fontSize={'lg'}>Inventory</Heading>
                    <EditInventoryTable {...props} inventories={inventories}
                                   setInventories={setInventories}/>
                    <Button type={'submit'}>Submit</Button>
                    <Button my={10} mx={10} onClick={() => history.push('/')}>Go Back</Button>
                </FormControl>
            </form>
        </Box>
    );
}

function CustomFormInput({value, stateSetter, label, helperText, htmlId}) {
    const editInput = (e) => stateSetter(e.target.value);

    return (
        <>
            <FormLabel htmlFor={htmlId}>{label}</FormLabel>
            <Input id={htmlId} value={value} onChange={editInput}/>
            <FormHelperText>{helperText}</FormHelperText>
        </>
    )
}

