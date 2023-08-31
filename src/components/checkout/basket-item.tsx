
import {  Typography } from "antd"
import { ProductBasketType } from "../../slices/operation-store";

const { Text } = Typography

export const BasketItem = ({item} : {item: ProductBasketType})=>{



    return (
        <div>
            <Text> {item.name} </Text>
            <Text> {item.amount} </Text>
            <Text> {item.price}</Text>
            
        </div>
        )


}