import { useEffect, useRef, useState } from "react"
import { Button, Col, Form, InputNumber, Input, Row,  Typography, InputRef, Table, Space } from "antd"
import { SaleSession } from "../consts/sales";

import { ClientCheckout } from "../components/checkout/client-checkout";

import {  ProductBasketType, useCartStore } from "../slices/carts-store";
import {  sampleProducts } from "../consts/product-types";
import { ColumnsType } from "antd/es/table";


const { Text, Title } = Typography
const { Search } = Input



export const Checkout = ()=>{

    const [searchProduct, setSearchProduct] = useState("")  
    const searchRef = useRef<InputRef>(null)
    const [form] = Form.useForm<SaleSession>();
    const [registerSession, setRegisterSession] = useState(false)
    const { productsStore }  = useCartStore((state)=>({ productsStore : state.productStore}))
    const [changeProduct, setChangeProduct] = useState(false)
    

    let fakeTotal = 0

    productsStore.products.forEach(( acc)=>{ fakeTotal = fakeTotal + (acc.price * acc.quantity) })

    const columns: ColumnsType<ProductBasketType> = [
        
        {
            title:"Quantity",
            key: "quantity",
            render: (_, record)=>{

                return `${record.quantity} ${record.unit}`
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
            render: (_, record)=>`$${ (record.price * record.quantity).toFixed(2) }`
        },



        
        // {
        //   title: 'Action',
        //   key: 'action',
        //   render: (_, record) => (
        //     <Space size="middle">
        //       <a>Invite {record.name}</a>
        //       <a>Delete</a>
        //     </Space>
        //   ),
        // },
      ];


    useEffect(()=>{

        
            console.log("Focused")
            searchRef.current?.focus()
        

    },[productsStore.products, registerSession])

    const onSearchProduct = (value: string) =>{

        console.log(value)
        //Todo make an api call to search for product 
        if(value==="") return         


        const select = changeProduct ? 0 :1

        productsStore.addProduct( {  

            id: sampleProducts[select].id,
            quantity:1,
            name: sampleProducts[select].name,
            price: sampleProducts[select].price,
            barcode: sampleProducts[select].barcode,
            unit: sampleProducts[select].unit.abreviation

         })

         setSearchProduct("")
         setChangeProduct((prev)=>!prev )
    }




    const onFinish = (values: any) => {
                console.log(values)
        setRegisterSession(true)
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };


      



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
                    ref={searchRef}
                    style={{ width:"40%"}}
                    placeholder="Search a product"
                    enterButton
                    size="middle"
                    value={searchProduct}
                    onChange={(e)=>{ setSearchProduct(e.target.value) }}
                    onSearch={onSearchProduct}
                />

            </Col>
        </Row>

        <Row style={{marginTop:"2em"}}>
            <Col span={24}>

                  
                    <Table columns={columns} dataSource={productsStore.products} pagination={false}/>
                
            </Col>
        </Row>

        <Row>
            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>
                    <Title>
                        { fakeTotal.toFixed(2) } MXN
                    </Title>

            </Col>
        </Row>

        
        </>
    )


  
}