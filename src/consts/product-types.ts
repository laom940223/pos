

export type ProductType = {

    id: number,
    barcode: string,
    altBarcode?: string
    name: string, 
    image?: string,
    price: number,
    prices: ProductPrice[]
    stock: number,
    saleUnit: UnitType 
    buyUnit: UnitType
} 


export type ProductPrice = {

    id: number | null, 
    productId?: number,
    priceNumber: number,
    amount: number,
    minimum: number
}


export type CreateProductPrice = Omit<ProductPrice, "id" >

export type CreateProduct = Omit<ProductType, "id">


export type UnitType ={

    id: number,
    name: string,
    plural:string,
    abbreviation: string
    fractional: boolean
}

export type CreateUnit =  Omit<UnitType,"id">





export const sampleUnits : UnitType[] = [


    {
        id:1,
        name: "kilogram",
        plural: "kilograms",
        abbreviation: "kg",
        fractional: true
        
    },

    {
        id:2,
        name: "Piece",
        plural:"Pieces",
        abbreviation:"Pz",
        fractional: false
    },

    {
        id:3,
        name:"Box",
        plural:"Boxes",
        abbreviation:"box",
        fractional: false
    },

    {
        id: 4, 
        name:"Costal",
        plural:"Costales",
        abbreviation:"Cost",
        fractional:false

    }

]

const samplePrice : ProductPrice[] = [


    {
        id:1,
        amount:25.36,
        minimum:1,
        priceNumber:1,
        productId:24
    }
]


export const sampleProducts:ProductType[]  = [


    {

        id:12,
        name:"Coca Cola",
        barcode:"123456",
        price:25.35,
        prices: [...samplePrice],
        stock:0,
        saleUnit:sampleUnits[1],
        image:"https://fastly.picsum.photos/id/294/200/300.jpg?hmac=37ZMLugCxZOqrLbLvaJ_09fT_uPfl3zlMkICmkVxobg",
        buyUnit:sampleUnits[1]
        
    },


    {

        id:1,
        name:"Tomate",
        barcode:"2536",
        price:25.69,
        prices: [...samplePrice],
        stock:0,
        saleUnit:sampleUnits[0],
        image:"https://fastly.picsum.photos/id/294/200/300.jpg?hmac=37ZMLugCxZOqrLbLvaJ_09fT_uPfl3zlMkICmkVxobg",

        buyUnit:sampleUnits[0]

    },

    {
        id:2425,
        name:"Platano",
        barcode:"8969",
        price:15,
        prices: [...samplePrice],
        stock:0,
        saleUnit:sampleUnits[0],
        image:"https://fastly.picsum.photos/id/294/200/300.jpg?hmac=37ZMLugCxZOqrLbLvaJ_09fT_uPfl3zlMkICmkVxobg",
        buyUnit:sampleUnits[2]
    },


    {
        id:123,
        name:"Azucar",
        barcode:"1234",
        price:15.89,
        prices: [...samplePrice],
        stock:0,
        buyUnit:sampleUnits[3],
        saleUnit:sampleUnits[0],
        
    }
    



] 





