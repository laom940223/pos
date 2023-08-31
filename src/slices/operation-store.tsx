import { create } from 'zustand'

import { ClientType, ProductOperationDetail } from '../consts/operations'
import { produce } from 'immer'





export interface  OperationState {


    productStore:{

            products:   ProductOperationDetail[],
            addProduct : (product : ProductOperationDetail)=>void
            modifyQuantity : (product: number, amount: number)=>void
            deleteProduct: (id: number)=>void

            clearProducts: ()=>void,

    },

    
    clientStore:{

        client?: ClientType,
        setClient:( client :ClientType) => void
        clearClient: ()=>void

    } 


}


export const useCartStore = create<OperationState>((set) => ({


    clientStore:{

        client: undefined,
        setClient: (client: ClientType) => set( produce<OperationState>((state)=>{ state.clientStore.client= client }) ) ,
        clearClient: ()=>set(produce<OperationState>((state)=> { state.clientStore.client = undefined })),
    } ,
    
    
    
    productStore :{

        products: [],

        addProduct: (product)=> set(produce<OperationState>((state)=>{ 
        
            const index = state.productStore.products.findIndex( fproduct => fproduct.product?.id === product.product?.id)

            if( index < 0 ){

                state.productStore.products =  state.productStore.products.concat(product)
                return
            }

            state.productStore.products[index]=  {...state.productStore.products[index], quantity: product.quantity! + state.productStore.products[index].quantity!}
             
        
        
        })),


        modifyQuantity: (productid, amount)=> set(produce<OperationState>((state)=>{

            const index = state.productStore.products.findIndex (fproduct => fproduct.product!.id === productid)

            if(index< 0) return

            const result = state.productStore.products[index].quantity! + amount

            state.productStore.products[index] = {...state.productStore.products[index], quantity: result> 0 ? result : 1   }

        })),



        clearProducts: ()=> set(produce<OperationState>((state)=>{ state.productStore.products = []})),

        deleteProduct: (id)=> set(produce<OperationState>((state)=>{ state.productStore.products=  state.productStore.products.filter( product =>  product.product!.id !== id)  }))

    }
       
  
    

    

        

}))