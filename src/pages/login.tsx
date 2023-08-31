import { Button, Checkbox, Col, Form, FormInstance, Input, Layout, Row, notification } from "antd"
import { useState } from "react"
import { Content } from "antd/es/layout/layout"
import { ServerError } from "../consts/server-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "../consts/query-consts";
import { Navigate } from "react-router-dom";
import { UsersType, sampleUsers } from "../consts/users";


  
type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };


  

export const Login = ()=>{
  
    const [errors, setErrors] =  useState<ServerError[]>([])
    const queryClient  = useQueryClient()
    const data = queryClient.getQueryData([QUERIES.auth])
    

    const [api, contextHolder] = notification.useNotification();

    const mutation = useMutation<UsersType>(()=>{

        console.log("Enterign mutation")

        return new Promise<UsersType>((resolve)=>{
            setTimeout(()=>{

                resolve(sampleUsers)
            },100)

        })
    },
    
    
    {
            onSuccess: (user)=>{

                
                queryClient.setQueryData([QUERIES.auth], ()=>user)

            },


            onError:()=>{

                api.error({
                    message: `Something went wrong`,
                    description:
                      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
                    placement:"bottomRight"
                  })
            }


    }

    )
    

    const onFinish = async(values: any) => {
        // handleToggle()
        
        await mutation.mutateAsync()

        console.log(values)
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };


    const handleToggle = ()=>{
        setErrors(prev => prev.length > 0 ? [] : 
            [
                { 
                    location:"username",
                    message:"This is a server error"  
                },

                {
                    location:"password",
                    message:"This is a custom server error"
                }
            ] as ServerError[] )

    }

   


    console.log("DAta "+    data)

    if(data) {

        return <Navigate to="/" />
    }

    return(

        <Layout >
            <Content  >
                {contextHolder}
                <Row>
                    <Col span={24} style={{  display:"flex", justifyContent:"center", height:"100vh" }}>
                        <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        size="large"
                        style={
                            {
                                 width:600 ,
                                 display:"flex",
                                 flexDirection:"column",
                                 justifyContent:"center"
                            }
                            }
                        
                        
                        >
                            <Form.Item<FieldType>
                                label="Username"
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                                help={ errors.find(el => el.location === "username")?.message}
                                validateStatus={ errors.find(el => el.location === "username") ? "error"  : ""}
                                
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                                help={ errors.find(el => el.location === "password")?.message}
                                validateStatus={ errors.find(el => el.location === "password") ? "error"  : ""}
                                
                            >
                            <Input.Password />
                            </Form.Item>

                            <Form.Item<FieldType>
                            name="remember"
                            valuePropName="checked"
                            wrapperCol={{ offset: 8, span: 16 }}
                            >
                            <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                            Submit
                            </Button>
                            </Form.Item>

                            
                        </Form>
                        </Col>
                    </Row>
            </Content>
        </Layout>
    )
}