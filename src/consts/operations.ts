import dayjs from "dayjs"
import { ProductType } from "./product-types"
import { ProviderType } from "./provider"
import { UsersType, sampleUsers } from "./users"


export type RegisterSession = {

    id?: number, 
    user?: UsersType, 
    userId?: number
    openAt: Date,
    closedAt?: Date
    openingAmount: number
    closingAmount?: number
    openAuthorizedBy?: UsersType | number
    closeAuthorizedBy?: UsersType | number
    register: Register
    createdAt : Date

 }




 








 export type Register ={

    id: number, 
    name: string
 }


 export type Operation ={

    id: number, 
    sessionId: number,
    type: OperationEnum,
    
    
    
    authorized?: UsersType ,
    authorizedBy?: number,
    
    total: number,


    cardAmount: number,
    cashAmount: number, 
    creditAmount: number

    createdAt?: Date


    //Flieds for both
    products?: ProductOperationDetail[]

    //Fields for sales
    client?: ClientType,
    clientId: number,
    

    ///Fields for buys
    provider?: ProviderType,
    providerId: number,

}

export type CreateOperation = Omit<Operation, "id">

export type ProductOperationDetail = {

    id?:number

    operationId?: number,
    
    product?: ProductType,
    productId: number, 
    
    quantity: number, 


    price?: number,

    //Buy properties
    factor?: number,
    buyPrice1?: number,
    amountPrice1?: number,
    buyPrice2?: number,
    amountPrice2?: number,
    
    

}



export enum OperationEnum {

    SALE = "SALE", 
    BUY="BUY",
    CASHOUT="CASHOUT"

}


export type ClientType ={

    id: number,
    name: string, 
    address?: string
    rfc?: string
    
}

export type CreateClient  = Omit<ClientType,"id">



export const defaultClient: ClientType ={

    id: 1,
    name:"General public",
    

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
        openAt: dayjs(new Date()).subtract(3,'hours').toDate(),
        createdAt: dayjs(new Date()).subtract(4,'hours').toDate(),
        openingAmount:589,
        register: registers[0]

    }
]



