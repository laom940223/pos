


import { Button, Checkbox, Col,  Drawer, Form, Input, Row,  } from "antd"

import { useEffect, useState } from "react";
import { CreateUnit, UnitType } from "../../consts/product-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { API_URL } from "../../consts/endpoints";
import { ServerError, ServerResponse } from "../../consts/server-types";
import { QUERIES } from "../../consts/query-consts";
import { Register } from "../../consts/operations";








export const AddEditRegister = ({ open, onClose, registerToEdit } :{ onClose: ()=>void, open :boolean, registerToEdit? : Register } )=>{


    const [serverErrors, setServerErrors] = useState<ServerError[]>([])

    const queryClient = useQueryClient()

    const registerMutation  = useMutation((name : string)=>{
        if(!registerToEdit) return axios.post<ServerResponse<Register>>(API_URL+"register", {name})
        return axios.put<ServerResponse<Register>>(API_URL+"register/"+registerToEdit.id, {name})

    },{
      onError: (e)=>{


        if(isAxiosError(e)){


          if(e.response){

              setServerErrors(e.response.data.errors)
              console.log(e.response.data)

              

          }
        }


        console.log("Error")

      },

      onSuccess: ()=>{

        queryClient.invalidateQueries([QUERIES.registers])
        form.resetFields()
        onClose()

      }



    })


    const [form] = Form.useForm<Register>();

      useEffect(()=>{

        form.resetFields()

      }, [registerToEdit, form])

      const onFinish = (values: any) => {
        // handleToggle()
        // console.log('Success:', values);


        registerMutation.mutate(values.name)
        
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);


        // console.log(form.getFieldInstance("name"))
      };


      

    return (

        <Drawer
        title= { !registerToEdit ? "Create a new REgister" : "Edit register"}
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
       
      >


        <Form 
              form={form}
              layout="vertical"
              initialValues={{ 

                  
                  name: !registerToEdit ? "" : registerToEdit.name,
                 
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
                help={serverErrors.find(a=> a.location==="name")?.message}
                validateStatus={ serverErrors.find(a=> a.location==="name") ? "error" : 'validating' }
              >
                <Input placeholder="Please enter a name" />
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