

export type ProductType = {

    id: number,
    barcode?: string,
    name: string, 
    description?: string,
    image?: string,
    price: number,
    // brand? : string,
    stock: number,
    saleUnit: UnitType 
    buyUnit: UnitType
    
    
} 



export type UnitType ={

    id: number,
    name: string,
    plural:string,
    abreviation: string
    fractional: boolean
}





export const sampleUnits : UnitType[] = [


    {
        id:1,
        name: "kilogram",
        plural: "kilograms",
        abreviation: "kg",
        fractional: true
        
    },

    {
        id:2,
        name: "Piece",
        plural:"Pieces",
        abreviation:"Pz",
        fractional: false
    },

    {
        id:3,
        name:"Box",
        plural:"Boxes",
        abreviation:"box",
        fractional: false
    },

    {
        id: 4, 
        name:"Costal",
        plural:"Costales",
        abreviation:"Cost",
        fractional:false

    }

]




export const sampleProducts:ProductType[]  = [


    {

        id:12,
        name:"Coca Cola",
        description:"short description",
        price:25.35,
        stock:0,
        saleUnit:sampleUnits[1],
        image:"https://fastly.picsum.photos/id/294/200/300.jpg?hmac=37ZMLugCxZOqrLbLvaJ_09fT_uPfl3zlMkICmkVxobg",
        buyUnit:sampleUnits[1]
        
    },


    {

        id:1,
        name:"Tomate",
        description:"short description",
        price:25.69,
        stock:0,
        saleUnit:sampleUnits[0],
        image:"https://fastly.picsum.photos/id/294/200/300.jpg?hmac=37ZMLugCxZOqrLbLvaJ_09fT_uPfl3zlMkICmkVxobg",

        buyUnit:sampleUnits[0]

    },

    {
        id:2425,
        name:"Platano",
        description:"description",
        price:15,
        stock:0,
        saleUnit:sampleUnits[0],
        image:"https://fastly.picsum.photos/id/294/200/300.jpg?hmac=37ZMLugCxZOqrLbLvaJ_09fT_uPfl3zlMkICmkVxobg",
        buyUnit:sampleUnits[2]
    },


    {
        id:123,
        name:"Azucar",
        description:"Costal de azucar",
        price:15.89,
        stock:0,
        buyUnit:sampleUnits[3],
        saleUnit:sampleUnits[0],
        barcode:"asdasde25"
    }
    



] 

