import { Button, Col, Drawer, Form, Input, Row, Select, Spin, Upload } from "antd"
import { useEffect } from "react";
import { CreateProduct, CreateUnit, ProductType, UnitType, sampleUnits } from "../../consts/product-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "../../consts/query-consts";
import axios, { isAxiosError } from "axios";
import { API_URL } from "../../consts/endpoints";
import { ServerResponse } from "../../consts/server-types";




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

    const queryClient = useQueryClient()


    const unitsQuery = useQuery([QUERIES.productunitoptions], async()=>{

            const resaxios = await axios.get<ServerResponse<UnitType[]>>(API_URL+"product-unit")
            return resaxios.data

    })


    const productMutation = useMutation((product : CreateProduct)=>{


          return axios.post<ServerResponse<UnitType>>(API_URL+"products", product)
        

    }, {

      onError:(e)=>{

          if(isAxiosError(e)){

            console.log(e.response?.data.errors)
          }

      },


      onSuccess: ()=>{

          queryClient.invalidateQueries([QUERIES.products])
          
          form.resetFields()
          onClose()
        
      }


    })




      useEffect(()=>{

        form.resetFields()

      }, [productToEdit, form])





      const onFinish = (values: any) => {
        // handleToggle()
        console.log('Success:', values);

        productMutation.mutate(values)
        
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };


    
      let unitsOptions:JSX.Element[] = []

      if(!unitsQuery.isLoading && !unitsQuery.isError){

          unitsOptions = unitsQuery.data.data.map((unit)=><Option key={unit.id} value={unit.id}>{unit.name}</Option>) 
      }
      

      // console.log(unitsQuery.data?.data)
      

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
                  
                //   image:  !productToEdit ? "" : productToEdit.image,
                  description: !productToEdit ? "" : productToEdit.description,
                  buyUnit: !productToEdit ? "" : productToEdit.buyUnit.name,
                  saleUnit: !productToEdit ? "" : productToEdit.saleUnit.name

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
                name="buyUnit"
                label="Buy unit"
                rules={[{ required: true, message: 'Please choose the unit' }]}
                // initialValue={  !productToEdit ? "" : productToEdit.role}
              >
                <Select placeholder="Please choose the unit">

                    {
                        unitsOptions
                    }
                        
                  
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="saleUnit"
                label="Sale unit"
                rules={[{ required: true, message: 'Please choose the unit' }]}
                // initialValue={  !productToEdit ? "" : productToEdit.role}
              >
                <Select placeholder="Please choose the unit">

                    {
                      unitsOptions
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