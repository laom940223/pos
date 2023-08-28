import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { ProductType, sampleProducts } from "../consts/product-types"




export const ProductDetailPage =()=>{

    const { productId } = useParams()

    //fetch prodcut 
    const [product, setProduct] = useState<ProductType>()


    useEffect(() => {
        
         setProduct( ()=> sampleProducts.find(product =>  product.id === +productId!))
    
      return () => {
        setProduct(undefined)
      }
    }, [productId, product])
    

    


    return (

        <>
            {
                JSON.stringify(product, null, 5)

            }
        </>
    )



}