import { useEffect, useRef, useState, useCallback } from "react"
import { Button, Col, InputNumber, Input, Row,  Typography, InputRef, Table, Space, Modal } from "antd"
import { ClientCheckout } from "../../components/checkout/client-checkout";

import {  useOperationStore } from "../../slices/operation-store";
import {  ProductType, sampleProducts } from "../../consts/product-types";
import { ColumnsType } from "antd/es/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "../../consts/query-consts";

import { OperationEnum, OperationType, ProductOperationDetail, RegisterSession } from "../../consts/operations";

import { SearchProduct } from "../../components/operations/search-products";
import { API_URL } from "../../consts/endpoints";
import axios from "axios";
import { ServerResponse } from "../../consts/server-types";



const { Text, Title } = Typography
const { Search } = Input



export const Sale = ()=>{


    const searchRef = useRef<InputRef>(null)
    const decimalProduct = useRef<ProductType>()

    
    

    
    const [cash, setCash] = useState(0)
    const [searchProduct, setSearchProduct] = useState("")  
    const [isSearchResourceOpen, setIsSearchResourceOpen]= useState(false)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [isDecimalOpen, setIsDecimalOpen] = useState(false)
    const [productQuantity, setProductQuantity] = useState(0)

      

    const { productsStore, client }  = useOperationStore((state)=>({ productsStore : state.saleStore, client: state.clientStore.client}))
    
    const queryClient = useQueryClient()

    const lastSessions = queryClient.getQueryData<RegisterSession[]>([QUERIES.lastSession])
    const registerSession = lastSessions ? lastSessions[0]: null

    let total = 0
    productsStore.products.forEach((acc)=>{ total = total + (acc.price * acc.quantity!) })


    
    const searchByBarcode = useMutation(async (query: string)=>{

            const response = await axios.post<ServerResponse<ProductType>>(API_URL+"products/barcode",{ query})
            return response.data.data
    },
    
        {
            onError:()=>{

                console.log("There was an error")
                setSearchProduct("")
            }
        }

    )


    const handleSearchResourceOpen = useCallback(()=>{
            setIsSearchResourceOpen(true)
    },[])

    const handleSearchResourceCancel = useCallback(()=>{
        setIsSearchResourceOpen(false)
    },[])


    const handleSearchSelect = useCallback((product:ProductType)=>{


        if(!product.saleUnit.fractional){
            productsStore.addProduct({ product, quantity :1, type:OperationEnum.SALE })
        setSearchProduct("")
        // setChangeProduct((prev)=>!prev )
        setIsSearchResourceOpen(false)
            return
        }


        decimalProduct.current = product
        setIsSearchResourceOpen(false)
        setIsDecimalOpen(true)          
        setSearchProduct("")
    


    },[])


    const handlePaymentCancel = useCallback(()=>{
        setIsPaymentOpen(false)
    },[])

    const handlePaymentOk = useCallback ( ()=>{
        const change = cash -total 

        if(change < 0) return

            console.log({

                id:1,
                sessionId: registerSession?.id,
                type:OperationEnum.SALE.toLocaleString(),
                amount: +total.toFixed(2),
                provider: client,
                products: productsStore.products

            } as OperationType)
        productsStore.clearProducts()
        setCash(0)
        setIsPaymentOpen(false)
        
    },[cash, total, registerSession?.id, client, productsStore])


    const handleFractionalCancel = useCallback(()=>{
        setIsDecimalOpen(false)
    },[])

    
    const handleFractionalOk = useCallback ( ()=>{

        productsStore.addProduct({product: {...decimalProduct.current! }, quantity: productQuantity || 0})
        setIsDecimalOpen(false)
        setProductQuantity(0)
        
    },[productQuantity, productsStore])


    
    const handleCashChange = useCallback((e: number | null)=>{
        setCash(e? e : 0)
    }, [])


    const handleProductQuantityChange = useCallback(
        (quantity: number | null) => {
          
            setProductQuantity(quantity || 0)

        },
        [],
      )

    const handleDeleteItem = useCallback(
      (id: number) => {
        productsStore.deleteProduct(id)
      },
      [productsStore],
    )
    
    const handleIncrement = useCallback(
        (id: number) => {
          productsStore.modifyQuantity(id, 1)
        },
        [productsStore],
      )


      const handleDecrement= useCallback(
        (id: number) => {
                productsStore.modifyQuantity(id, -1)
        },
        [productsStore],
      )
    

      const onSearchProduct = async(value: string) =>{

        
        
        if(value==="") return       
        
        const selectedProduct= await searchByBarcode.mutateAsync(value)


        // console.log(product)
        // const selectedProduct = sampleProducts.find(searchable => searchable.id === +value)
        


        if(!selectedProduct){
            setSearchProduct("")
            return
        }
        
        if(!selectedProduct.saleUnit.fractional){
                productsStore.addProduct({product: selectedProduct, quantity :1, type:OperationEnum.SALE})
            setSearchProduct("")
            // setChangeProduct((prev)=>!prev )
            return
        }

        decimalProduct.current = selectedProduct
        setIsDecimalOpen(true)          
        setSearchProduct("")

    }

    
      useEffect(()=>{
        searchRef.current?.focus()   
    },[productsStore.products])


   


    const columns: ColumnsType<ProductOperationDetail> = [
        
        {
            title:"Quantity",
            key: "quantity",
            render: (_, record)=>{
         
                if(!record.product?.saleUnit.fractional){

                    return (
                        <>
                            <Button disabled={ record.quantity ===1} size="small" onClick={()=>{ handleDecrement(record.product!.id)}}> - </Button>
                                <Text style={{margin: "0 10px"}}>{`${record.quantity} ${record.product!.saleUnit.abbreviation}`} </Text>
                            <Button size="small" onClick={()=>{ handleIncrement(record.product!.id)}} > + </Button>
                        </>
                        )
                }

                return (
                    <>  
                        <Text>{`${record.quantity!.toFixed(3)} ${record.product?.saleUnit.abbreviation}`}</Text>
                        {/* <Button size="small"> Edit</Button> */}
                    </>
                )
            }
        },
        
        {
          title: 'Name',
          key: 'name',
          render: (_, record)=> record.product!.name
        },

        {
            title: 'Price',
            key: 'price',
            render: (_, record)=> record.price
        },


        {
            title: 'Sub Total',
            key: 'price',
            render: (_, record)=>`$${ (record.price! * record.quantity!).toFixed(2) }`
        },
 
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <Button type="text" danger onClick={()=>{handleDeleteItem(record.product!.id) }}>  Delete</Button>
              
            </Space>
          ),
        },
      ];


   

    



    if(!registerSession) return "Something went wrong"



    const openAt = new Date(registerSession.openAt)
    

    return (
        <>

         <Row>
            <Col span={24} style={{ display:"flex", justifyContent:"flex-end"}}>
                     <Title level={4}> {registerSession.register.name} </Title> 
                    
            </Col>

            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>
                <Text>Opened at: {` ${openAt.toLocaleDateString()} ${openAt.toLocaleTimeString()}`}</Text>
            </Col>

            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>
                <Text>Operated By: {`${registerSession.user?.name} ${registerSession.user?.lastname}`}</Text>
            </Col> 
        </Row> 


        <Row>
            <Col >
                <ClientCheckout/>
            </Col>
        </Row>

        
        
        <Row>
            <Col span={24} style={{ display:"flex", justifyContent:"flex-end" }}>
                
                <Search

                    disabled={ !client  }
                    ref={searchRef}
                    style={{ width:"40%"}}
                    placeholder="Search by barcode"
                    enterButton
                    size="middle"
                    value={searchProduct}
                    onChange={(e)=>{ setSearchProduct(e.target.value) }}
                    onSearch={onSearchProduct}
                />

                <Modal title="Please insert the value" open={isDecimalOpen} onOk={handleFractionalOk} onCancel={handleFractionalCancel}>
                        <Row style={{width:"100%", marginTop:"1em"}}>
                            <Col span={24}>
                                <Text style={{ fontSize:"1.5em" }} >{`${decimalProduct.current?.name} ${decimalProduct.current?.saleUnit.abbreviation}`}</Text>
                            </Col>
                        </Row>

                        <Row style={{marginTop:"1em", marginBottom:"1em"}} >
                            <Col span={24} >
                                <InputNumber  value={productQuantity} onChange={handleProductQuantityChange}  style={{width:"100%"}} size="middle" placeholder="Insert quantity" onPressEnter={handleFractionalOk}/>
                            </Col>
                        </Row>
                        
                </Modal>
                
            </Col>
        </Row>

        <Row>
            <Col>
                <Button disabled={!client} onClick={handleSearchResourceOpen}>Search produuct</Button>
                <SearchProduct open={isSearchResourceOpen} onCancel={handleSearchResourceCancel} onSelect={handleSearchSelect} />
            </Col>
        </Row>

        <Row style={{marginTop:"2em", height:"50vh"}}>

            <Col span={24}>
                    <Table columns={columns} dataSource={productsStore.products} pagination={false}  rowKey={(record)=>record.product!.id}/>
            </Col>

        </Row>

        <Row>
            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>
                    <Title>
                        { total.toFixed(2) } MXN
                    </Title>

            </Col>
        </Row>


        <Row>
            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>

                    <Button onClick={()=>{ setIsPaymentOpen(true)}} disabled={productsStore.products.length === 0} size="large" type="primary">
                        Pay
                    </Button>

                    <Modal title="Payment" open={isPaymentOpen} 
                        onOk={handlePaymentOk} 
                        onCancel={handlePaymentCancel}
                        footer={[
                            <Button key="back" onClick={handlePaymentCancel}>
                        Cancel
                      </Button>,
                      <Button key="submit" type="primary" disabled={total>cash} onClick={handlePaymentOk}>
                        Pay
                      </Button>,]}
                        >
                        <Row style={{width:"100%", marginTop:"1em"}}>
                            <Col span={24}>
                                <Text style={{ fontSize:"1.5em", textAlign:"center" }} >{`Total: ${total.toFixed(2)} MXN`}</Text>
                            </Col>
                        </Row>

                        <Row style={{marginTop:"1em", marginBottom:"1em"}} >
                            <Col span={24} >
                                    <InputNumber 
                                        value={cash}
                                        status={`${total > cash? "error" : ""}`}
                                        onChange={handleCashChange}
                                        onPressEnter={handlePaymentOk}
                                        name="cash" 
                                        style={{width:"100%"   }} size="middle" 
                                        placeholder="Insert quantity"

                                        />
                            </Col>
                        </Row>

                        <Row style={{marginTop:"1em", marginBottom:"1em"}} >
                            <Col span={24} >
                                  <Text style={{ fontSize:"1.5em", textAlign:"center" }}>Change: {`${(cash - total).toFixed(2) }`}</Text>
                            </Col>
                        </Row>
                        
                    </Modal>

            </Col>
        </Row>
        </>
    )


  
}