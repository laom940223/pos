
export type ProductType = {

    id: number,
    barcode?: string,
    name: string, 
    description: string,
    images?: string[],
    price: number,
    brand? : string,
    stock: number,
    unit: UnitType 


}



export type UnitType ={


    id: number,
    name: string,
    plural:string,
    abreviation?: string
}





export const sampleUnits : UnitType[] = [


    {
        id:1,
        name: "Gram",
        plural: "Grams",
        abreviation: "g"
    },

    {
        id:2,
        name: "Piece",
        plural:"Pieces",
        abreviation:"Pz",
    },

    {
        id:3,
        name:"Box",
        plural:"Boxes",
        abreviation:"box"
    }

]




export const defaultProducts:ProductType[]  = [


    {

        id:12,
        name:"Coca Cola",
        description:"short description",
        price:25.35,
        stock:0,
        unit:{
            id:2,
            name: "Pieza",
            plural:"Pz"
        }

    }

] 