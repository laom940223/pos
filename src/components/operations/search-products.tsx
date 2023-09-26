import { AutoComplete, Button, Col, Modal, Row } from "antd"
import { useCallback, useState, useEffect } from 'react'
import { useDebounceValue } from "../../hooks/use-debounce"
import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "../../consts/query-consts"
import { ProductType, sampleProducts } from "../../consts/product-types"
import { DefaultOptionType } from "antd/es/select"
import axios from "axios"
import { ServerResponse } from "../../consts/server-types"
import { API_URL } from "../../consts/endpoints"


export interface SearchProductProps {

    open: boolean,
    onSelect: (product: ProductType)=>void,
    onCancel: ()=>void

}

export const SearchProduct = ({ onCancel, onSelect, open } : SearchProductProps )=>{


    const [productQuery, setProductQuery] = useState("")
    const debounceValue = useDebounceValue(productQuery, 200)
    const [selectedProduct, setSelectedProduct] = useState<ProductType | undefined>()


    
    

    const options = useQuery<ProductType[] | null>([QUERIES.SEARCH_PRODUCTS_BY_NAME], async ()=>{
        

        const response = await axios.post<ServerResponse<ProductType[]>>(API_URL+"products/search",{query: debounceValue})
        return response.data.data

    } , {enabled:false})


    const handleOk = useCallback(
      () => {

        onSelect(selectedProduct!)
        setSelectedProduct(undefined)
        setProductQuery("")
      },
      [onSelect, selectedProduct],
    )



    const onSearchProduct = useCallback((value: string)=>{
        setProductQuery(value)
    },[])


    const onSelectProduct = useCallback((value:string)=>{

            setSelectedProduct(options.data?.find(dat => dat.name === value))
    },[options.data])

    useEffect(()=>{

        console.log(debounceValue)
        options.refetch()

    },[debounceValue])
    


    let formatedOptions:DefaultOptionType[] = []

    if(!options.isLoading && !options.isError){
        formatedOptions =   options.data?.map<DefaultOptionType>((option)=>({ label: option.name, value:option.name}))  || []
    }
        

    // console.log()

    return (

        <Modal
        open={open}
        title="Search for product"
        onOk={handleOk}
        onCancel={onCancel}
        footer={[
            <Button key="back" onClick={onCancel}>
            Return
            </Button>,
            <Button disabled={!selectedProduct} key="submit" type="primary" onClick={handleOk}>
                     Submit
            </Button>,
            
           
            ]}
                >
                <Row>
                    <Col span={24} style={{minHeight:"20vh"}}>
                        
                        <AutoComplete
                            options={formatedOptions}
                            style={{width: "100%", marginTop:"2em"}}
                            placeholder="Search product"
                            backfill
                            onSearch={onSearchProduct}
                            onSelect={onSelectProduct}
                            
                        
                        />
                    </Col>
                </Row>
        </Modal>

    )
}