import { Button, Col, Drawer, Form, Input, Row, Select, Upload } from "antd"
import { UserRoles, UsersType } from "../../consts/users";
import { useEffect } from "react";
import { ProductType, sampleUnits } from "../../consts/product-types";
import { UploadOutlined } from "@ant-design/icons";
const { Option } = Select;

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};


export const AddEditProduct = ({ open, onClose, productToEdit } :{ onClose: ()=>void, open :boolean, productToEdit? : ProductType } )=>{


    const [form] = Form.useForm<ProductType>();

      useEffect(()=>{

        form.resetFields()

      }, [productToEdit, form])

      const onFinish = (values: any) => {
        // handleToggle()
        console.log('Success:', values);
        
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };


      

      

    return (

        <Drawer
        title= { !productToEdit ? "Create a new product" : "Edit product"}
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
       
      >


        <Form 
              form={form}
              layout="vertical"
              initialValues={{ 

                  name: !productToEdit ? "" : productToEdit.name,
                  barcode: !productToEdit ? "" : productToEdit.barcode,
                  brand: !productToEdit ? "" : productToEdit.brand,
                //   image:  !productToEdit ? "" : productToEdit.image,
                  description: !productToEdit ? "" : productToEdit.description,
                  unitS: !productToEdit ? "" : productToEdit.unitS

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
                
                rules={[{ required: true, message: 'Please enter name' }]}
              >
                <Input placeholder="Please enter a name" />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="barcode"
                label="Barcode"
                rules={[{ message: 'Please enter a valid code' }]}
              >
                <Input  placeholder="Please enter a code" />
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
           
            <Col span={12}>
              <Form.Item
                name="unitS"
                label="Unit"
                rules={[{ required: true, message: 'Please choose the unit' }]}
                // initialValue={  !productToEdit ? "" : productToEdit.role}
              >
                <Select placeholder="Please choose the unit">

                    {
                        sampleUnits.map((unit)=><Option key={unit.id} value={unit.id}>{unit.name}</Option>  )
                    }
                        
                  
                </Select>
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={24}>
            <Form.Item
                name="description"
                label="Description"
                rules={[{ message: 'Please enter a valid description' }]}
              >
                <Input.TextArea  placeholder="Please enter a description" />
              </Form.Item>
            </Col>
          </Row>
         
        
          

          
          

          <Row gutter={16}>
            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>

              <Button htmlType="submit" type="primary">
                  Create
                </Button>
            </Col>
          </Row>

        </Form>
      </Drawer>

    )

}