import dayjs from "dayjs"
import { ProductType } from "./product-types"
import { ProviderType } from "./provider"
import { UsersType, sampleUsers } from "./users"


export type RegisterSession = {

    id?: number, 
    user?: UsersType, 
    userId?: number
    openTime: Date,
    closingTime?: Date
    moneyAtOpen: number
    moneyAtClose?: number
    authorizedOpenBy?: UsersType | number
    authorizedCloseBy?: UsersType | number
    register: Register
    createdAt : Date

 }






 export type Register ={

    id: number, 
    name: string
 }


 export type OperationType ={

    id: number, 
    sessionId: number,
    type: string,
    client?: ClientType | number,
    provider?: ProviderType | number
    amount: number,
    authorizedBy?: UsersType | number
    products?: ProductOperationDetail[]
    createdAt?: Date

}

export type ProductOperationDetail = {

    id?:number
    operationId?: number,
    factor?: number,
    type:string,
    price?: number,
    quantity: number,
    product?: ProductType ,

    salePrice1?: number,
    salePrice2?: number,
    salePrice3?: number,
    

}

export enum ProductDetailType {

    SALE ="SALE",
    BUY= "BUY"
}

export enum OperationEnum {

    SALE = "SALE", 
    BUY="BUY",
    CASHOUT="CASHOUT"

}


export type ClientType ={

    id: number, 
    name: string,
    
    
}



export const defaultClient: ClientType ={

    id: 1,
    name:"General public"


}


export const registers: Register[] = [

    {
        id:1,
        name:"Caja 1"

    },

    {

        id:2,
        name:"Register 2"

    }

]



export const sampleregisterSession: RegisterSession[] = [


    {
        id:1,
        user:sampleUsers[0],
        openTime: dayjs(new Date()).subtract(3,'hours').toDate(),
        createdAt: dayjs(new Date()).subtract(4,'hours').toDate(),
        moneyAtOpen:589,
        register: registers[0]

    }
]