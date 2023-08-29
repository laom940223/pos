import { create } from 'zustand'

import { ClientType, Sale } from '../consts/sales'
import { produce } from 'immer'
import { ProductType } from '../consts/product-types'




export interface  SaleState {

    productStore:{

            products:   ProductType[],
            addProduct : (product : ProductType)=>void
            incrementProduct : (product: number, amount: number)=>void
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

            

            if( index < 0 ){

                state.productStore.products =  state.productStore.products.concat(product)
                return
            }

            state.productStore.products[index]=  {...state.productStore.products[index], quantity: product.quantity! + state.productStore.products[index].quantity!}
             
        
        
        })),


        incrementProduct: (productid, amount)=> set(produce<SaleState>((state)=>{

            const index = state.productStore.products.findIndex (fproduct => fproduct.id === productid)

            if(index< 0) return

            const result = state.productStore.products[index].quantity! + amount

            state.productStore.products[index] = {...state.productStore.products[index], quantity: result> 0 ? result : 1   }

        })),



        clearProducts: ()=> set(produce<SaleState>((state)=>{ state.productStore.products = []})),

        deleteProduct: (id)=> set(produce<SaleState>((state)=>{ state.productStore.products=  state.productStore.products.filter( product =>  product.id !== id)  }))

    }
       
  
    

    

        

}))