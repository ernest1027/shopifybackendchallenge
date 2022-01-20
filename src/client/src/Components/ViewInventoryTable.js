import {Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";



export default function ViewInventoryTable({inventories, isLocation}) {
    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>{!isLocation ? 'Location' : 'Item'} Name</Th>
                    <Th>{!isLocation ? 'Location' : 'Item'} ID</Th>
                    <Th>Quantity</Th>
                </Tr>
            </Thead>
            <Tbody>
                {inventories.map((inventory) => <ViewInventoryTableRow key={inventory._id} inventory={inventory}/>)}
            </Tbody>
        </Table>
    );
}

function ViewInventoryTableRow({inventory, isLocation}) {
    return (
        <Tr>
            {!isLocation
                ? <>
                    <Td>{inventory.locationName}</Td>
                    <Td>{inventory.locationId}</Td>
                </>
                : <>
                    <Td>{inventory.itemName}</Td>
                    <Td>{inventory.itemId}</Td>
                </>
            }
            <Td>{inventory.quantity}</Td>
        </Tr>
    );
}