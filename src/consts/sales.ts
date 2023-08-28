import { ProductType } from "./product-types"


export type SaleSession = {

    id: number, 
    employeeId: number, 
    openTime: Date,
    closingTime: Date
    moneyInRegister: number

 }


export type Sale = {

    id: number, 
    employeeId: number, 
    clientId: number,
    products: ProductType[]

}




export type ClientType ={

    id: number, 
    name: string,
    
    
}