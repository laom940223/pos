import { useState } from "react"
import { Button, Col, Form, Input, InputNumber, Row, Typography } from "antd"
import { SaleSession } from "../consts/sales";
import { useCartStore } from "../slices/carts-store";
import { shallow } from "zustand/shallow";
import { sampleProducts } from "../consts/product-types";

const { Text, Title } = Typography




export const Checkout = ()=>{


    const { clientStore, productStore } = useCartStore()

    const [form] = Form.useForm<SaleSession>();
    const [registerSession, setRegisterSession] = useState(false)


    const onFinish = (values: any) => {
        // handleToggle()

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

            <Col>
            
                  <> {JSON.stringify(productStore.products,null,5)}</>      

            </Col>

            <Col>
                <Button onClick={()=>{ 
                    
                            productStore.addProduct(sampleProducts[0])
                }}>Add Product </Button>


                <Button onClick={()=>{ 
                        
                        productStore.clearProducts()
                }}>Clear Products</Button>


                <Button onClick={()=>{ 
                        
                        productStore.deleteProduct(sampleProducts[1].id)
                }}>deleteProduct</Button>


            </Col>
        </Row>


        <Row>

            <Col>
            
                  <> {JSON.stringify(clientStore.client,null,5)}</>      

            </Col>

            <Col>
                <Button onClick={()=>{ 
                    
                        
                        !clientStore.client?
                            clientStore.setClient({ id:2, name:"Agapito Rivas" }) :
                            clientStore.clearClient()

                    
                    
                    
                    }}>SetClient </Button>
            </Col>
        </Row>


        
       
        </>
    )


  
}