

export type ProductType = {

    id: number,
    barcode?: string,
    name: string, 
    description?: string,
    image?: string,
    price: number,
    brand? : string,
    stock: number,
    unit: UnitType 
    
    
    
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
    }

]




export const sampleProducts:ProductType[]  = [


    {

        id:12,
        name:"Coca Cola",
        description:"short description",
        price:25.35,
        stock:0,
        unit:sampleUnits[1]

    },


    {

        id:1,
        name:"Tomate",
        description:"short description",
        price:25.69,
        stock:0,
        unit:sampleUnits[0]

    },

    {
        id:2425,
        name:"Platano",
        description:"description",
        price:15,
        stock:0,
        unit:sampleUnits[0]
    }



] 

