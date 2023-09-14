import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { ProductType, sampleProducts } from "../consts/product-types"
import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "../consts/query-consts"
import axios, { isAxiosError } from "axios"
import { API_URL } from "../consts/endpoints"
import { ServerResponse } from "../consts/server-types"
import { Spin } from "antd"




export const ProductDetailPage =()=>{

    const { productId } = useParams()

    //fetch prodcut 
    
    const productQuery = useQuery([QUERIES.singleProduct], async ()=>{


        const response = await axios.get<ServerResponse<ProductType>>(API_URL+"products/"+productId)

        return response.data

    }
    
    )


    
 
    if(productQuery.isLoading) return <Spin/>


    if(productQuery.isError) {


            if(isAxiosError(productQuery.error)){

                if(+productQuery.error.code! === 404){

                    return <>{productQuery.error.response}</>

                }

            }

            return<>Something went wrong</>

    }
    


    return (

        <>
            {
                JSON.stringify(productQuery.data.data, null, 5)

            }
        </>
    )



}