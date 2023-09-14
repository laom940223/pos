export type ProviderType ={

    id: number
    name: string
    address: string
    rfc? :string

}

export type  CreateProvider = Omit<ProviderType, "id">


export const sampleProviders: ProviderType[] = [

    {
        id:1,
        name: "Coca Cola",
        address:"Example adrees coca",
        
    },

    {
        id:2,
        name: "Pepsi",
        address:"Example adrees pepsi",
        
    }

]