

import { Button, Col,  Drawer, Form, Input, Row, Typography } from "antd"

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { API_URL } from "../../consts/endpoints";
import { ServerError, ServerResponse } from "../../consts/server-types";
import { QUERIES } from "../../consts/query-consts";
import { ClientType, CreateClient } from "../../consts/operations";
import { UsersType } from "../../consts/users";







export const AuthorizeOperation = ({ open, onCancel, onSuccess, onClose   } :{ onCancel: ()=>void, onClose:()=>void, onSuccess:(id: number)=>void,  open :boolean } )=>{


    const [form] = Form.useForm<UsersType>();
    const [serverErrors, setServerErrors] = useState<ServerError[]>([])

    

    const queryClient= useQueryClient()

      useEffect(()=>{
        form.resetFields()
        
        
        setServerErrors([])
      }, [open, form])



      const authorizeMutation = useMutation(async(values: {username: string, password: string})=>{



            const response =  await axios.post<ServerResponse<{authorizedBy: string}>>(API_URL+"auth/authorize", values)

            return response.data.data

      }, {


        onError:(error)=>{

          if(isAxiosError(error)){

            
            console.log(error.code)

            // if(error.code){

            //     alert(error.code)
            //     return
            // }

                
            
            if(error.response){

                // console.log(error.response)
              setServerErrors(error.response?.data.errors)
            }
            
          }


    


        },

        onSuccess: (data)=>{

            // queryClient.invalidateQueries([QUERIES.clients])
            onClose()
            onSuccess(+data.authorizedBy)
            form.resetFields()
        }



      })


      


      const onFinish = async (values: any) => {
        // handleToggle()
        

        

        authorizeMutation.mutate(values)

        // if(result) {

        //     onClose()
        //     onSuccess(result)
            
        // }

        
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };


      

    return (

        <Drawer
        title= {"Confirm Operation"}
        width={720}
        onClose={onCancel}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
       
      >


        <Form 
              form={form}
              layout="vertical"
              initialValues={{ 

                  
                  name: "",
                  password:""

               }}
               
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
        
        >

            <Row>
               <Col>
                    <Typography.Text>
                        Please ask a supervisor or admin to continue with the process
                    </Typography.Text>
               </Col>
            </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Please enter a name' }]}
                validateStatus={ serverErrors.find( error => error.location==="username") ? "error" :"success" }
                help={serverErrors.find( error => error.location==="username")?.message }
              >
                <Input placeholder="Please enter a name" />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true ,  message: 'Please enter a password' }]}
                validateStatus={ serverErrors.find( error => error.location==="password") ? "error" :"success" }
                help={serverErrors.find( error => error.location==="password")?.message }
              >
                <Input type="password" placeholder="Please enter an address" />
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
      </Drawer>

    )

}

