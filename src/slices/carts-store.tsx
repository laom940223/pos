import { create } from 'zustand'

import { ClientType } from '../consts/sales'
import { produce } from 'immer'


export type ProductBasketType = {
    id: number;
    barcode?: string | undefined;
    name: string;
    price: number;
    quantity: number,
    unit?: string | undefined;
}

export interface  SaleState {

    productStore:{

            products:   ProductBasketType[],
            addProduct : (product : ProductBasketType)=>void
            deleteProduct: (id: number)=>void
            clearProducts: ()=>void,

    },

    


    clientStore:{

        client?: ClientType,
        setClient:( client :ClientType) => void
        clearClient: ()=>void

    } 


}


export const useCartStore = create<SaleState>((set) => ({


    clientStore:{

        client: undefined,
        setClient: (client: ClientType) => set( produce<SaleState>((state)=>{ state.clientStore.client= client }) ) ,
        clearClient: ()=>set(produce<SaleState>((state)=> { state.clientStore.client = undefined })),
    } ,
    
    
    
    productStore :{

        products: [],
        addProduct: (product)=> set(produce<SaleState>((state)=>{ 
        
            const index = state.productStore.products.findIndex( fproduct => fproduct.id === product.id)

            console.log

            if( index < 0 ){

                state.productStore.products =  state.productStore.products.concat(product)
                return
            }

            state.productStore.products[index]=  {...state.productStore.products[index], quantity: ++state.productStore.products[index].quantity}
             
        
        
        })),
        clearProducts: ()=> set(produce<SaleState>((state)=>{ state.productStore.products = []})),

        deleteProduct: (id)=> set(produce<SaleState>((state)=>{ state.productStore.products=  state.productStore.products.filter( product =>  product.id !== id)  }))

    }
       
  
    

    

        

}))