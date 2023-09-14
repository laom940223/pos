import { Button, Checkbox, Col,  Drawer, Form, Input, Row,  } from "antd"

import { useEffect, useState } from "react";
import { CreateUnit, UnitType } from "../../consts/product-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { API_URL } from "../../consts/endpoints";
import { ServerError, ServerResponse } from "../../consts/server-types";
import { QUERIES } from "../../consts/query-consts";








export const AddEditUnit = ({ open, onClose, unitToEdit } :{ onClose: ()=>void, open :boolean, unitToEdit? : UnitType } )=>{


    const [serverErrors, setServerErrors] = useState<ServerError[]>([])

    const queryClient = useQueryClient()

    const unitMutation  = useMutation((unit : CreateUnit)=>{
        if(!unitToEdit) return axios.post<ServerResponse<UnitType>>(API_URL+"product-unit", unit)
        return axios.put<ServerResponse<UnitType>>(API_URL+"product-unit/"+unitToEdit.id, unit)

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

        queryClient.invalidateQueries([QUERIES.units])
        form.resetFields()
        onClose()

      }



    })


    const [form] = Form.useForm<UnitType>();

      useEffect(()=>{

        form.resetFields()

      }, [unitToEdit, form])

      const onFinish = (values: any) => {
        // handleToggle()
        // console.log('Success:', values);


        unitMutation.mutate({...values})
        
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);


        // console.log(form.getFieldInstance("name"))
      };


      

    return (

        <Drawer
        title= { !unitToEdit ? "Create a new unit" : "Edit unit"}
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
       
      >


        <Form 
              form={form}
              layout="vertical"
              initialValues={{ 

                  
                  name: !unitToEdit ? "" : unitToEdit.name,
                  plural: !unitToEdit ? "" : unitToEdit.plural,
                  abbreviation: !unitToEdit? "": unitToEdit.abbreviation,
                  fractional:!unitToEdit ? false: unitToEdit.fractional 
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
            <Col span={12}>
            <Form.Item
                name="plural"
                label="Plural"  
                rules={[{ required: true ,  message: 'Please enter a plural' }]}
                

              >
                <Input  placeholder="Please enter a plural" />
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="abbreviation"
                label="Abreviation"
                rules={[{ required: false, }]}
              >
                <Input placeholder="Please enter an abreviation" />
              </Form.Item>
            </Col>

            <Col span={12}>
            <Form.Item
                name="fractional"
                valuePropName="checked"
                // wrapperCol={{ offset: 8, span: 16 }}
              >
                <Checkbox>Is Fractional?</Checkbox>
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