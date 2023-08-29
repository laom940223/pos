import { useEffect, useRef, useState, useCallback, Ref, MutableRefObject } from "react"
import { Button, Col, Form, InputNumber, Input, Row,  Typography, InputRef, Table, Space, Modal } from "antd"
import { SaleSession } from "../consts/sales";

import { ClientCheckout } from "../components/checkout/client-checkout";

import {  useCartStore } from "../slices/carts-store";
import {  ProductType, sampleProducts } from "../consts/product-types";
import { ColumnsType } from "antd/es/table";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "../consts/query-consts";


const { Text, Title } = Typography
const { Search } = Input



export const Checkout = ()=>{

    const searchRef = useRef<InputRef>(null)
    const floatProduct = useRef<ProductType>()
    
    const [cash, setCash] = useState(0)
    const [searchProduct, setSearchProduct] = useState("")  
    const [registerSession, setRegisterSession] = useState(false)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [isFloatOpen, setIsFloatOpen] = useState(false)
    const [productQuantity, setProductQuantity] = useState(0)

    const [form] = Form.useForm<SaleSession>();
    const { productsStore, client }  = useCartStore((state)=>({ productsStore : state.productStore, client: state.clientStore.client}))
    const queryClient = useQueryClient()

    let total = 0


    

    productsStore.products.forEach(( acc)=>{ total = total + (acc.price * acc.quantity!) })



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
            
            user: queryClient.getQueryData([QUERIES.auth]), 
            client: client,
            products: productsStore.products

        })

        productsStore.clearProducts()
        setCash(0)
        setIsPaymentOpen(false)
        
    },[cash, productsStore, total, client, queryClient])


    const handleFloatCancel = useCallback(()=>{
        setIsFloatOpen(false)
    },[])

    
    const handleFloatOk = useCallback ( ()=>{

        productsStore.addProduct({...floatProduct.current!, quantity: productQuantity || 0})

               
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
          productsStore.incrementProduct(id, 1)
        },
        [productsStore],
      )


      const handleDecrement= useCallback(
        (id: number) => {
                productsStore.incrementProduct(id, -1)
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
        
        if(!selectedProduct.saleUnit.float){
                productsStore.addProduct({...selectedProduct, quantity :1})
            setSearchProduct("")
            // setChangeProduct((prev)=>!prev )
            return
        }

       
       
        floatProduct.current = selectedProduct
        setIsFloatOpen(true)  
        
        setSearchProduct("")

    }




    const onFinish = (values: any) => {
                console.log(values)
        setRegisterSession(true)
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

    
      useEffect(()=>{
        searchRef.current?.focus()   
    },[productsStore.products, registerSession])


   


    const columns: ColumnsType<ProductType> = [
        
        {
            title:"Quantity",
            key: "quantity",
            render: (_, record)=>{

                
                
                
                if(!record.saleUnit.float){

                    return (
                        <>
                            <Button disabled={ record.quantity ===1} size="small" onClick={()=>{ handleDecrement(record.id)}}> - </Button>
                                <Text style={{margin: "0 10px"}}>{`${record.quantity} ${record.saleUnit.abreviation}`} </Text>
                            <Button size="small" onClick={()=>{ handleIncrement(record.id)}} > + </Button>
                        </>
                        )
                }

                return (
                    <>  
                        <Text>{`${record.quantity!.toFixed(3)} ${record.saleUnit.abreviation}`}</Text>
                        {/* <Button size="small"> Edit</Button> */}
                    </>
                )
            }
        },
        
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },

        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },


        {
            title: 'Sub Total',
            key: 'price',
            render: (_, record)=>`$${ (record.price * record.quantity!).toFixed(3) }`
        },



        
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <Button type="text" danger onClick={()=>{handleDeleteItem(record.id) }}>  Delete</Button>
              
            </Space>
          ),
        },
      ];


   

    



      



    if(!registerSession){


        return    (           
             <>
                <Row style={{ marginBottom:"3em"}} >
                    <Col>
                            <Title>Open Register</Title>
                            <Text>Before you can checkout please input the info below</Text>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form 
                        form={form}
                        layout="vertical"
                        initialValues={{ 
                        }}

                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        style={{
                            width:"100%"

                        }}  
                        >

                        <Row gutter={16}>
                            <Col span={12}>
                            <Form.Item
                            name="moneyInRegister"
                            label="Cash available"

                            rules={[{ required: true, type:"number" ,  message: 'Please enter a quantity' }]}
                            >
                                <InputNumber style={{width:"100%"}} placeholder="Please enter a quantity" />
                            </Form.Item>
                            </Col>
                           
                        </Row>


                       


                        <Row gutter={16}>
                        <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>

                        <Button htmlType="submit" type="primary">
                        Submit
                        </Button>
                        </Col>
                        </Row>

                        </Form>
                        </Col>
                </Row>
            
            </>
            )
    }

    console.log

    return (
        <>

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
                                <Text style={{ fontSize:"1.5em" }} >{`${floatProduct.current?.name} ${floatProduct.current?.saleUnit.abreviation}`}</Text>
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

                  
                    <Table columns={columns} dataSource={productsStore.products} pagination={false}/>
                
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