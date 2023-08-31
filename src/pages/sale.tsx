import { useEffect, useRef, useState, useCallback } from "react"
import { Button, Col, InputNumber, Input, Row,  Typography, InputRef, Table, Space, Modal } from "antd"
import { ClientCheckout } from "../components/checkout/client-checkout";

import {  useCartStore } from "../slices/operation-store";
import {  ProductType, sampleProducts } from "../consts/product-types";
import { ColumnsType } from "antd/es/table";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "../consts/query-consts";

import { OperationEnum, OperationType, ProductOperationDetail, RegisterSession } from "../consts/operations";



const { Text, Title } = Typography
const { Search } = Input



export const Sale = ()=>{


    const searchRef = useRef<InputRef>(null)
    const decimalProduct = useRef<ProductType>()
    
    const [cash, setCash] = useState(0)
    const [searchProduct, setSearchProduct] = useState("")  
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [isFloatOpen, setIsFloatOpen] = useState(false)
    const [productQuantity, setProductQuantity] = useState(0)

    
    const { productsStore, client }  = useCartStore((state)=>({ productsStore : state.productStore, client: state.clientStore.client}))
    const queryClient = useQueryClient()

    const registerSession = queryClient.getQueryData<RegisterSession>([QUERIES.registerSession])
    
    let total = 0


   


    

    productsStore.products.forEach((acc)=>{ total = total + (acc.product!.price * acc.quantity!) })



    const handlePaymentCancel = useCallback(()=>{
        setIsPaymentOpen(false)
    },[])


    const handleCashChange = useCallback((e: number | null)=>{

        setCash(e? e : 0)
    }, [])


    const handlePaymentOk = useCallback ( ()=>{

        const change = cash -total 
        if(change < 0) return


            console.log({

                id:1,
                sessionId: registerSession?.id,
                type:OperationEnum.SALE.toLocaleString(),
                amount: +total.toFixed(2),
                client,
                products: productsStore.products

            } as OperationType)


       

        productsStore.clearProducts()
        setCash(0)
        setIsPaymentOpen(false)
        
    },[cash, total, registerSession?.id, client, productsStore.products])


    const handleFloatCancel = useCallback(()=>{
        setIsFloatOpen(false)
    },[])

    
    const handleFloatOk = useCallback ( ()=>{

        productsStore.addProduct({product: {...decimalProduct.current! }, quantity: productQuantity || 0})

               
        setIsFloatOpen(false)
        setProductQuantity(0)
        // setChangeProduct((prev)=>!prev )
        
    },[productQuantity, productsStore])



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
    

      const onSearchProduct = (value: string) =>{

        
        //Todo make an api call to search for product 
        if(value==="") return         
        const selectedProduct = sampleProducts.find(searchable => searchable.id === +value)
        
        if(!selectedProduct){
            setSearchProduct("")
            return
        }
        
        if(!selectedProduct.unit.fractional){
                productsStore.addProduct({product:{...selectedProduct}, quantity :1})
            setSearchProduct("")
            // setChangeProduct((prev)=>!prev )
            return
        }

       
       
        decimalProduct.current = selectedProduct
        setIsFloatOpen(true)  
        
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

                
                
                
                if(!record.product?.unit.fractional){

                    return (
                        <>
                            <Button disabled={ record.quantity ===1} size="small" onClick={()=>{ handleDecrement(record.product!.id)}}> - </Button>
                                <Text style={{margin: "0 10px"}}>{`${record.quantity} ${record.product!.unit.abreviation}`} </Text>
                            <Button size="small" onClick={()=>{ handleIncrement(record.product!.id)}} > + </Button>
                        </>
                        )
                }

                return (
                    <>  
                        <Text>{`${record.quantity!.toFixed(3)} ${record.product?.unit.abreviation}`}</Text>
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
            render: (_, record)=> record.product!.price
        },


        {
            title: 'Sub Total',
            key: 'price',
            render: (_, record)=>`$${ (record.product!.price * record.quantity!).toFixed(2) }`
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



    
    

    return (
        <>

        <Row>
            <Col span={24} style={{ display:"flex", justifyContent:"flex-end"}}>
                    <Title level={4}> {registerSession.register.name} </Title>
                    
            </Col>

            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>
                <Text>Opened at: {` ${registerSession.openTime.toLocaleDateString()} ${registerSession.openTime.toLocaleTimeString()}`}</Text>
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
                    placeholder="Search a product"
                    enterButton
                    size="middle"
                    value={searchProduct}
                    onChange={(e)=>{ setSearchProduct(e.target.value) }}
                    onSearch={onSearchProduct}
                />

                <Modal title="Please insert the value" open={isFloatOpen} onOk={handleFloatOk} onCancel={handleFloatCancel}>
                        <Row style={{width:"100%", marginTop:"1em"}}>
                            <Col span={24}>
                                <Text style={{ fontSize:"1.5em" }} >{`${decimalProduct.current?.name} ${decimalProduct.current?.unit.abreviation}`}</Text>
                            </Col>
                        </Row>

                        <Row style={{marginTop:"1em", marginBottom:"1em"}} >
                            <Col span={24} >
                                <InputNumber  value={productQuantity} onChange={handleProductQuantityChange}  style={{width:"100%"}} size="middle" placeholder="Insert quantity" onPressEnter={handleFloatOk}/>
                            </Col>
                        </Row>
                        
                </Modal>
                
            </Col>
        </Row>

        <Row style={{marginTop:"2em", height:"60vh"}}>
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