import { create } from 'zustand'

import { ClientType, ProductOperationDetail, Register } from '../consts/operations'
import { produce } from 'immer'
import { ProviderType } from '../consts/provider'





export interface  OperationState {


    saleStore:{

            products:   ProductOperationDetail[],
            addProduct : (product : ProductOperationDetail)=>void
            modifyQuantity : (product: number, amount: number)=>void
            deleteProduct: (id: number)=>void

            
            clearProducts: ()=>void,

    },

    buyStore:{

        products:   ProductOperationDetail[],
        addProduct : (product : ProductOperationDetail)=>void
        modifyQuantity : (product: number, amount: number)=>void
        deleteProduct: (id: number)=>void
        editProduct: (product: ProductOperationDetail) => void
        

        clearProducts: ()=>void,

    },

    
    clientStore:{

        client?: ClientType,
        setClient:( client :ClientType) => void
        clearClient: ()=>void

    } ,

    providerStore :{
        
        provider?: ProviderType,
        setProvider:( provider: ProviderType) => void
        
    },


    registerStore:{

        register?: Register,
        setRegister:( register: Register)=>void,
        

    }

}


export const useOperationStore = create<OperationState>((set) => ({


    clientStore:{

        client: undefined,
        setClient: (client: ClientType) => set( produce<OperationState>((state)=>{ state.clientStore.client= client }) ) ,
        clearClient: ()=>set(produce<OperationState>((state)=> { state.clientStore.client = undefined })),
    } ,
    
    
    
    saleStore :{

        products: [],

        addProduct: (product)=> set(produce<OperationState>((state)=>{ 
        
            const index = state.saleStore.products.findIndex( fproduct => fproduct.product?.id === product.product?.id)

            if( index < 0 ){
                state.saleStore.products =  state.saleStore.products.concat({...product, productId: product.product?.id! , price: product.product?.prices[0].amount})
                return
            }
            state.saleStore.products[index]=  {...state.saleStore.products[index], quantity: product.quantity! + state.saleStore.products[index].quantity!}
        })),


        modifyQuantity: (productid, amount)=> set(produce<OperationState>((state)=>{

            const index = state.saleStore.products.findIndex (fproduct => fproduct.product!.id === productid)

            if(index< 0) return

            let result = state.saleStore.products[index].quantity! + amount

            result =result> 0 ? result : 1

            let price =state.saleStore.products[index].product!.prices[0].amount

            if(state.saleStore.products[index].product!.prices[1].amount >0 && result>= state.saleStore.products[index].product!.prices[1].minimum){

                price = state.saleStore.products[index].product!.prices[1].amount
            }


            state.saleStore.products[index] = {...state.saleStore.products[index], quantity: result, price: price   }

        })),


        

        clearProducts: ()=> set(produce<OperationState>((state)=>{ state.saleStore.products = []})),
        deleteProduct: (id)=> set(produce<OperationState>((state)=>{ state.saleStore.products=  state.saleStore.products.filter( product =>  product.product!.id !== id)  }))

    },

    buyStore :{

        products: [],

        addProduct: (product)=> set(produce<OperationState>((state)=>{ 
            

            const index = state.buyStore.products.findIndex( fproduct => fproduct.product?.id === product.product?.id)

            if( index < 0 ){
                state.buyStore.products =  state.buyStore.products.concat(product)
                return
            }
            
            state.buyStore.products[index]=  {...state.buyStore.products[index], quantity: product.quantity! + state.buyStore.products[index].quantity!}
        })),


        modifyQuantity: (productid, amount)=> set(produce<OperationState>((state)=>{

            const index = state.buyStore.products.findIndex (fproduct => fproduct.product!.id === productid)

            if(index< 0) return

            const result = state.buyStore.products[index].quantity! + amount

            state.buyStore.products[index] = {...state.buyStore.products[index], quantity: result> 0 ? result : 1   }

        })),

        editProduct: (product)=> set(produce<OperationState>((state)=>{ 
        
            const filteredProducts = state.buyStore.products.filter(p => p.product!.id !== product.product!.id)
    
            state.buyStore.products = filteredProducts.concat(product)
    
        })),

        clearProducts: ()=> set(produce<OperationState>((state)=>{ state.buyStore.products = []})),
        deleteProduct: (id)=> set(produce<OperationState>((state)=>{ state.buyStore.products=  state.buyStore.products.filter( product =>  product.product!.id !== id)  }))

    },
       
  
    providerStore:{
        provider: undefined,
        setProvider: (provider)=>set(produce<OperationState>((state)=>{ state.providerStore.provider= provider  })),
    }, 

    

    registerStore:{


        register:undefined,

        setRegister: (register)=> set(produce<OperationState>((state)=>{ state.registerStore.register=register}))
    }

    


        

}))