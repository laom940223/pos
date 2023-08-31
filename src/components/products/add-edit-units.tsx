import { Button, Checkbox, Col,  Drawer, Form, Input, Row,  } from "antd"

import { useEffect } from "react";
import { UnitType } from "../../consts/product-types";








export const AddEditUnit = ({ open, onClose, unitToEdit } :{ onClose: ()=>void, open :boolean, unitToEdit? : UnitType } )=>{


    const [form] = Form.useForm<UnitType>();

      useEffect(()=>{

        form.resetFields()

      }, [unitToEdit, form])

      const onFinish = (values: any) => {
        // handleToggle()
        console.log('Success:', values);
        
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
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
                  abreviation: !unitToEdit? "": unitToEdit.abreviation

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
                name="abreviation"
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