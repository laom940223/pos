import { create } from 'zustand'
import { ProductType } from '../consts/product-types'
import { ClientType } from '../consts/sales'
import { produce } from 'immer'


export interface  SaleState {

    productStore:{

            products:   ProductType[],
            addProduct : (product : ProductType)=>void
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
        addProduct: (product)=> set(produce<SaleState>((state)=>{ state.productStore.products =  state.productStore.products.concat(product) })),
        clearProducts: ()=> set(produce<SaleState>((state)=>{ state.productStore.products = []})),

        deleteProduct: (id)=> set(produce<SaleState>((state)=>{ state.productStore.products=  state.productStore.products.filter( product =>  product.id !== id)  }))

    }
       
  
    

    

        

}))