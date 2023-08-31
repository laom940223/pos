import {useEffect, useState} from "react"
import { Button, Col, Form, InputNumber, Row, Select, Spin, Typography } from "antd"
import { Option } from "antd/es/mentions"
import { Register, RegisterSession, registers, sampleregisterSession } from "../../consts/operations"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERIES } from "../../consts/query-consts"
import { UsersType } from "../../consts/users"
import { Outlet } from "react-router-dom"



const {Text, Title } = Typography




export const VerifyCashierSession =  (   )=>{


    // const [registerSession, setRegisterSession] = useState<RegisterSession>()
    const [form] = Form.useForm();
    // const []

    const queryClient= useQueryClient()
    const user = queryClient.getQueryData<UsersType>([QUERIES.auth])

    

    const registerSession = useQuery<RegisterSession | null>( [QUERIES.registerSession], ()=>{
         
        return new Promise<RegisterSession | null>((resolve)=>{
          const time=   setTimeout(()=>{
                resolve(sampleregisterSession[0])
                // resolve(null)
                clearTimeout(time)
            }, 1500)
         })

    })


    const onFinish = (values: any) => {
        // setRegisterSession(  { id:125, openTime:new Date(), user, register: {name: values.register}, moneyAtOpen: values.moneyAtOpen,authorizedBy:undefined, closingTime:undefined, moneyAtClose:undefined  } as RegisterSession )
    };

    const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    };



   
    if(registerSession.isLoading){

        return <Spin/>
    }

    if(registerSession.isError) return <>Something went wrotn</>


    if(registerSession.data) return <Outlet/>


    return(
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
                                name="register"
                                label="Register"
                                rules={[{ required: true, message: 'Please select a register' }]}
                                // initialValue={  !usertoEdit ? "" : usertoEdit.role}
                                >
                                <Select placeholder="Please select a register">


                                    <Option value="Register 1">Register 1</Option>
                                    <Option value="Register 2">Register 2</Option>
                                    <Option value="Register 3">Register 3</Option>

                                </Select>
                            </Form.Item>
                            </Col>


                            <Col span={12}>
                            <Form.Item
                            name="moneyAtOpen"
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