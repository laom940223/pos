import { Button, Col,  Drawer, Form, Input, Row } from "antd"

import { useEffect, useState } from "react";
import { CreateProvider, ProviderType } from "../../consts/provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { API_URL } from "../../consts/endpoints";
import { ServerError } from "../../consts/server-types";
import { QUERIES } from "../../consts/query-consts";
import { ClientType, CreateClient } from "../../consts/operations";


const RFC_LENGTH = 8




export const AddEditClient = ({ open, onClose, clientToEdit } :{ onClose: ()=>void, open :boolean, clientToEdit? : ClientType } )=>{


    const [form] = Form.useForm<ClientType>();
    const [serverErrors, setServerErrors] = useState<ServerError[]>([])

    

    const queryClient= useQueryClient()

      useEffect(()=>{
        form.resetFields()
        setServerErrors([])
      }, [clientToEdit, form])



      const providerMutation = useMutation((client : ClientTypes | CreateClient)=>{


          if(!clientToEdit) return axios.post(API_URL+"clients", client)


          return axios.put(API_URL+"clients/"+clientToEdit.id, client)

      }, {


        onError:(error)=>{

          if(isAxiosError(error)){

            
            console.log(error.code)

            if(error.code){

                alert(error.code)
                return
            }

                
            
            if(error.response){

              setServerErrors(error.response?.data.errors)
            }
            
          }


    


        },

        onSuccess: ()=>{

            queryClient.invalidateQueries([QUERIES.clients])
            onClose()
            form.resetFields()
        }



      })


      const onFinish = (values: any) => {
        // handleToggle()
        console.log('Success:', values);

        if(!clientToEdit) {

          providerMutation.mutate(values)
        }
        else{


          providerMutation.mutate({id: clientToEdit.id , ...values})
        }


        
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };


      

    return (

        <Drawer
        title= { !clientToEdit ? "Create a new provider" : "Edit provider"}
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
       
      >


        <Form 
              form={form}
              layout="vertical"
              initialValues={{ 

                  
                  name: !clientToEdit ? "" : clientToEdit.name,
                  address: !clientToEdit ? "" : clientToEdit.address,
                  rfc: !clientToEdit? "": clientToEdit.rfc

               }}
               
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
        
        >
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter a name' }]}
                validateStatus={ serverErrors.find( error => error.location==="name") ? "error" :"success" }
                help={serverErrors.find( error => error.location==="name")?.message }
              >
                <Input placeholder="Please enter a name" />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true ,  message: 'Please enter an address' }]}
                validateStatus={ serverErrors.find( error => error.location==="address") ? "error" :"success" }
                help={serverErrors.find( error => error.location==="address")?.message }
              >
                <Input  placeholder="Please enter an address" />
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rfc"
                label="RFC"
                rules={[{ required: false, message: `RFC must be ${RFC_LENGTH} characters long`, len:RFC_LENGTH }]}
                validateStatus={ serverErrors.find( error => error.location==="rfc") ? "error" :"success" }
                help={serverErrors.find( error => error.location==="rfc")?.message }
              >
                <Input placeholder="Please enter an RFC" />
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