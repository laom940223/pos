import { Button, Col, Drawer, Form, Input, InputNumber, Row, Select, Spin, Upload } from "antd"
import { useEffect, useState } from "react";
import { CreateProduct, CreateProductPrice, CreateUnit, ProductPrice, ProductType, UnitType, sampleUnits } from "../../consts/product-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "../../consts/query-consts";
import axios, { isAxiosError } from "axios";
import { API_URL } from "../../consts/endpoints";
import { ServerError, ServerResponse } from "../../consts/server-types";
import useNotification from "antd/es/notification/useNotification";




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

    const [serverErrors, setServerErrors] = useState<ServerError[]>([])
    const [api, contextHolder] = useNotification()


    const unitsQuery = useQuery([QUERIES.productunitoptions], async()=>{

            const resaxios = await axios.get<ServerResponse<UnitType[]>>(API_URL+"product-unit")
            return resaxios.data

    })


    const productMutation = useMutation((product : CreateProduct)=>{

        if(!productToEdit) return axios.post<ServerResponse<ProductType>>(API_URL+"products", product)
        
        

        return axios.put<ServerResponse<ProductType>>(API_URL+"products/"+productToEdit.id, product)

    }, {

      onError:(e)=>{

          if(isAxiosError(e)){

            if(e.response){

              setServerErrors(e.response?.data.errors)
            }
            
          }


          api.error({
            message:"Something went wrong try again",
            placement:"topLeft"
          })

      },


      onSuccess: ()=>{

          queryClient.invalidateQueries([QUERIES.products])
          
          
          onClose()
          form.resetFields()
          setServerErrors([])
      }


    })




      useEffect(()=>{

        form.resetFields()
        setServerErrors([])
      }, [productToEdit, form])





      const onFinish = (values: any) => {
        // handleToggle()
        // console.log('Success:', values);

          setServerErrors([])

        const array :ProductPrice[] =[]

       
                const price1 = values.price1
                const minimum1 = values.minimum1

                const price2 = values.price2
                const minimum2 = values.minimum2
            
                if( price2 !== 0 && minimum2 <=1){

                  setServerErrors([{
                    location:"minimum2",
                    message:"Needs to be greater than 1"

                  }])
                  return
                }

                

                

              array.push({ 
                id:  productToEdit?.prices.find(product => product.priceNumber ===1)?.id || null,
                amount: price1, 
                minimum: minimum1,
                priceNumber: 1,
              })

              array.push({ 
                id:  productToEdit?.prices.find(product => product.priceNumber ===2)?.id || null,
                amount: price2, 
                minimum: minimum2,
                priceNumber: 2,
              })
            
        
    
        // console.log(values.altBarcode)
        

        const formtedSend: CreateProduct = { 

            name: values.name, 
            barcode: values.barcode,
            altBarcode: values.altBarcode, 
            buyUnit: values.buyUnit,
            saleUnit: values.saleUnit, 
            stock:0,
            price:values.price1,
            prices: array

        }


        // console.log(formtedSend)
        productMutation.mutate(formtedSend)

        
        
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        setServerErrors([])
      };


    
      let unitsOptions:JSX.Element[] = []

      if(!unitsQuery.isLoading && !unitsQuery.isError){

          unitsOptions = unitsQuery.data.data.map((unit)=><Option key={unit.id} value={unit.id}>{unit.name}</Option>) 
      }
      

      // console.log(unitsQuery.data?.data)
      

    return (

        <Drawer
        title= { !productToEdit ? "Create a new product" : "Edit product"}
        width={1000}
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
                  altBarcode: !productToEdit ? "" : productToEdit.altBarcode,
                  price1: !productToEdit? 1 : productToEdit.prices[0].amount,
                  price2: !productToEdit? 0 : productToEdit.prices[1]?.amount || 0,

                  minimum1: !productToEdit? 1 : productToEdit.prices[0].minimum,
                  minimum2: !productToEdit? 0 : productToEdit.prices[1]?.minimum,
                  //   image:  !productToEdit ? "" : productToEdit.image,
                  
                  buyUnit: !productToEdit ? "" : productToEdit.buyUnit.id,
                  saleUnit: !productToEdit ? "" : productToEdit.saleUnit.id

               }}
               
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
        
        >
          
          <Row>
            <Col span={24}>
              <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Please enter name' }]}
                  validateStatus={serverErrors.find(e=> e.location === "name") ?"error": ""  }
                  help={serverErrors.find(e=> e.location === "name")?.message}
                >
                  <Input placeholder="Please enter a name" />
                </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                name="barcode"
                label="Barcode"
                rules={[{ required: true, message: 'Please enter a valid code' }]}
                validateStatus={serverErrors.find(e=> e.location === "barcode") ?"error": ""  }
                help={serverErrors.find(e=> e.location === "barcode")?.message}
              >
                <Input  placeholder="Please enter a code" />
              </Form.Item>
            </Col>


            <Col span={12}>
            <Form.Item
                name="altBarcode"
                label="Barcode"
                initialValue={""}
                rules={[{ message: 'Please enter a valid code' }]}
                validateStatus={serverErrors.find(e=> e.location === "altBarcode") ?"error": ""  }
                help={serverErrors.find(e=> e.location === "altBarcode")?.message}
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
            <Col span={12}>
            <Form.Item
                name="price1"
                label="Price 1"
                rules={[{ required:true, message: 'Please enter a price' }]}
                // validateStatus={serverErrors.find(e=> e.location === "price1") ?"error": ""  }
                // help={serverErrors.find(e=> e.location === "price1")?.message}
              >
                <InputNumber style={{width:"100%"}} min={0} precision={2}  placeholder="Please enter a price" />
              </Form.Item>

              <Form.Item
                name="minimum1"
                label="Minimum"
                initialValue={1}
                rules={[{ required:true, message: 'Please enter an amount' }]}
                // validateStatus={serverErrors.find(e=> e.location === "barcode") ?"error": ""  }
                // help={serverErrors.find(e=> e.location === "barcode")?.message}
              >
                <InputNumber disabled  style={{width:"100%"}} min={0} precision={2}  placeholder="Please enter an amount" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                  name="price2"
                  label="Price 2"
                  initialValue={0}
                  rules={[{ required: false, message: 'Please enter a price' }]}
                >
                  <InputNumber style={{width:"100%"}} min={0} precision={2}  placeholder="Please enter a price" />
                </Form.Item>

                <Form.Item
                  name="minimum2"
                  label="Minimum"
                  initialValue={0}
                  rules={[{ required: false, message: 'Please enter a minimum amount' }]}
                  validateStatus={serverErrors.find(e=> e.location === "minimum2") ?"error": ""  }
                  help={serverErrors.find(e=> e.location === "minimum2")?.message}

                >
                  <InputNumber  style={{width:"100%"}} min={0} precision={2}  placeholder="Please enter a description" />
                </Form.Item>
              </Col>

          </Row>
         
        
          

          
          

          <Row gutter={16}>
            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>

              <Button htmlType="submit" type="primary">
                  Create
                </Button>

                {contextHolder}
            </Col>
          </Row>

        </Form>
      </Drawer>

    )

}


