import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from "antd"
import { UserRoles, UsersType } from "../../consts/users";
import { useEffect } from "react";
import { ProviderType } from "../../consts/provider";


const RFC_LENGTH = 8




export const AddEditProvider = ({ open, onClose, providerToEdit: providerToEdit } :{ onClose: ()=>void, open :boolean, providerToEdit? : ProviderType } )=>{


    const [form] = Form.useForm<UsersType>();

      useEffect(()=>{

        form.resetFields()

      }, [providerToEdit, form])

      const onFinish = (values: any) => {
        // handleToggle()
        console.log('Success:', values);
        
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };


      

    return (

        <Drawer
        title= { !providerToEdit ? "Create a new provider" : "Edit provider"}
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
       
      >


        <Form 
              form={form}
              layout="vertical"
              initialValues={{ 

                  
                  name: !providerToEdit ? "" : providerToEdit.name,
                  address: !providerToEdit ? "" : providerToEdit.address,
                  rfc: !providerToEdit? "": providerToEdit.rfc

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
                name="address"
                label="Address"
                rules={[{ required: true ,  message: 'Please enter an address' }]}
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