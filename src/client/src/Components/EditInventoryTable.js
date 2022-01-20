import {useEffect, useState} from "react";
import {Input, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import axios from "axios";
import {CONSTANTS} from "../utils/CONSTANTS";

export default function EditInventoryTable({inventories, setInventories, isEditPage, isLocation}) {
    const [dataSet, setDataSet] = useState([]);
    useEffect(async () => {
        const ret = (await axios.get((CONSTANTS.BASE_URL + (isLocation ? '/item' : '/location' )) + '/all')).data.data;
        let newInventories = {}

        if (isLocation) {
            if(!isEditPage) {
                ret.items.forEach((item) => newInventories[item._id] = {
                    itemId: item._id,
                    itemName: item.name,
                    quantity: 0
                })
                setInventories(newInventories)
            }
            setDataSet(ret.items);

        }

        else {
            if(!isEditPage)
            {
                ret.locations.forEach((location) => newInventories[location._id] = {
                    locationId: location._id,
                    locationName: location.name,
                    quantity: 0
                })
                setInventories(newInventories)
            }
            setDataSet(ret.locations);
        }
    }, [])

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>ID</Th>
                    <Th>{isLocation? 'Item ' : 'Location '}Name</Th>
                    <Th>Amount</Th>
                </Tr>
            </Thead>
            <Tbody>
                {dataSet.map((dataPoint) =>
                    <InventoryTableRow
                        key={dataPoint._id}
                        inventories={inventories}
                        setInventories={setInventories}
                        dataPoint={dataPoint}/>)}
            </Tbody>
        </Table>
    )
}

function InventoryTableRow({dataPoint, inventories, setInventories}) {
    const editQuantity = (e) => {
        let newInventories = {...inventories};
        if (isNaN(e.target.value)) return;
        newInventories[dataPoint._id].quantity = Number(e.target.value)
        setInventories(newInventories);
    }
    return (
        <Tr>
            <Td>{dataPoint._id}</Td>
            <Td>{dataPoint.name}</Td>
            <Td>
                <Input
                    value={inventories[dataPoint._id] ? inventories[dataPoint._id].quantity : 0}
                    onChange={editQuantity}>
                </Input>
            </Td>
        </Tr>
    )
}