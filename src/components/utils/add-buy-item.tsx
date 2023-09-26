import { AutoComplete, Button, Checkbox, Col, Descriptions, DescriptionsProps, Form, Image, Input, InputNumber, Modal, ModalProps, Row, Select, Typography } from "antd"
import { useCallback, useState, useEffect } from 'react'
import { ProductType } from "../../consts/product-types"

import { useOperationStore } from "../../slices/operation-store"


import { useForm } from "antd/es/form/Form"
import { ProductDetailType, ProductOperationDetail } from "../../consts/operations"


export interface SearchResourceProps  {

  product?: ProductType | null,
  set: React.Dispatch<React.SetStateAction<ProductType | undefined | null>>


}



export interface AddProductValues {

    quantity: number,
    factor: number,
    price: number,
    net: boolean,
    salePrice1: number,
    salePrice2?: number,
    salePrice3?:number

}


export const AddBuyItem =  ({ product, set }: SearchResourceProps)=>{

    
    
    const [form] = useForm()
    const priceValue = Form.useWatch<number>('price', form);
    const factorValue = Form.useWatch('factor', form);
    const salePrice1 = Form.useWatch('salePrice1', form);
    const buysStore  = useOperationStore((state)=>state.buyStore)

    const priceByUnit = priceValue / factorValue

    const index =     buysStore.products.findIndex(p => p.product?.id=== product?.id) 
    

    useEffect(()=>{


        if(product && index>=0){

            console.log("Editar producto")

            form.setFieldValue("quantity", buysStore.products[index].quantity)
            form.setFieldValue("factor", buysStore.products[index].factor)
            form.setFieldValue("price", buysStore.products[index].price)
            form.setFieldValue("salePrice1", buysStore.products[index].product?.prices[0].amount)
        }

        if(product && index<0 ){ 
        
            form.resetFields()
            form.setFieldValue("salePrice1", 1)
        }


    },[buysStore.products, form, index, product])


   

    const handleOk =useCallback(()=>{
        form.resetFields()
        set(undefined)
        
    },[set, form])


    const onCancel = useCallback(()=>{
        form.resetFields()
        set(undefined)
    },[set, form])




    const onFormFinish = useCallback((values:AddProductValues)=>{

        if(values.salePrice1 < (values.price / factorValue)) return

      if(index < 0){

        buysStore.addProduct({ 
            
            price: values.price ,
            factor: values.factor,
            quantity: values.quantity,
            product: product || undefined,
            type: ProductDetailType.BUY,
            salePrice1: values.salePrice1,
         } as ProductOperationDetail)
      }  

      if( index>=0){

        buysStore.editProduct({ 
            
            price: values.price ,
            factor: values.factor,
            quantity: values.quantity,
            product: product || undefined,
            type: ProductDetailType.BUY,
            salePrice1: values.salePrice1,
         } as ProductOperationDetail)

      }

       

        
        handleOk()

    },[factorValue, buysStore, product, handleOk,])


    const onFormFinishFailed = useCallback((errorInfo:unknown)=>{

            console.log(errorInfo)
    },[])


    const items: DescriptionsProps['items'] = [
        {
          key: '1',
          label: <Typography.Title>  </Typography.Title>,
          children: <Typography.Text >{product?.name}</Typography.Text>,
        },
        {
          key: '2',
          label: 'Description',
          children: <p>{product?.description}</p>,
        },
        {
          key: '3',
          label: 'Stock',
          children: <p>{product?.stock}</p>,
        },

        {
            key: '3',
            label: 'Sale Unit',
            children: <p>{product?.saleUnit.name}</p>,
          }
      ];
    

    return (

        <Modal  
            title="Add a product" 
            open={!!product} 
            onOk={handleOk} 
            onCancel={onCancel} 
            width={800}
            
            footer={
                
                  
                    [
                        <Button key="back" onClick={onCancel}>
                          Return
                        </Button>,
                        <Button key="submit" type="primary"  onClick={()=>{ form.submit()}} >
                          Submit
                        </Button>,
                        
                      ]

                }

            >
                
                        
                <Row>
                    <Col>
                        <Descriptions title="Product Details" items={items} />
                    </Col>
                </Row>


                <Row>
                    <Col>
                        To Do last purchase 
                    </Col>
                </Row>


                <Row>
                    <Col span={24}>

                    <Typography.Title level={4}>Purchase Detail</Typography.Title>
                    <Form 
                        form={form}
                        layout="vertical"
                        // initialValues={{ 

                        // username: !usertoEdit ? "" : usertoEdit.username,
                        // email: !usertoEdit ? "" : usertoEdit.email,
                        // name: !usertoEdit ? "" : usertoEdit.name,
                        // lastName:  !usertoEdit ? "" : usertoEdit.lastname,

                        // }}

                        onFinish={onFormFinish}
                        onFinishFailed={onFormFinishFailed}
                        autoComplete="off"

                        >

                        <Row gutter={16}>
                            <Col span={12}>
                            <Form.Item
                            name="quantity"
                            label="Quantity"
                            
                            initialValue={1}
                            rules={[{ required: true, message: 'Please enter a quantity' }]}
                            >
                                <InputNumber
                                    precision={ product?.buyUnit.fractional ? 2 : 0}
                                    addonAfter={product?.buyUnit.abbreviation}
                                    style={{width: "100%"}} placeholder="Please enter a quantity" />
                            
                            </Form.Item>
                        </Col>


                        <Col span={12}>
                            <Form.Item
                                name="factor"
                                label="Factor"
                                initialValue={1}
                                rules={[{ required: product?.saleUnit.id !== product?.buyUnit.id , message: 'Please enter a factor' }]}
                            >
                                <InputNumber disabled={product?.saleUnit.id === product?.buyUnit.id} style={{width: "100%"}} placeholder="Factor" />
                            </Form.Item>
                        </Col>
                        </Row>


                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                name="price"
                                label={"Price by " + product?.buyUnit.name}
                                initialValue={1}
                                rules={[{ required: true, message: 'Please enter a price' }]}
                                
                                >
                                    <InputNumber
                                        
                                        style={{ width:"100%" }} addonAfter={`x ${product?.buyUnit.abbreviation}`} placeholder="Please enter a price" />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item
                                name="net"
                                valuePropName="checked"
                                initialValue={false}
                                style={{ display:"flex", alignItems:"flex-end", marginTop:"2em"}}
                                >
                                    <Checkbox>Net price</Checkbox>
                                </Form.Item>


                            </Col>
                        </Row>

                        <Row>
                            <Col span={24}>
                            
                                <Row>
                                    <Col span={24}> Precios de compra </Col>
                                    <Col span={12}>
                                        {`${  priceValue  } x ${product?.buyUnit.abbreviation} `}
                                    </Col>

                                    <Col span={12}>
                                            { ` Precio ${(priceValue /  ( product?.buyUnit.id === product?.saleUnit.id ? 1 : isNaN(factorValue) ? 1 : factorValue   )).toFixed(2)} x${product?.saleUnit.name} `}
                                    </Col>

                                </Row>

                                
                                    
                                

                                    

                            </Col>

                            <Col span={12}>

                            
                            </Col>

                        </Row>

                        <Row style={{marginTop:"1em"}}>
                            <Col span={24}>
                                <Typography.Title level={4}>Sale Prices</Typography.Title>
                            </Col>

                            <Col span={24}>
                            <Row style={{ display:"flex", justifyContent:"space-between"}} >
                                
                                <Col span={7}>
                                    <Form.Item
                                    name="salePrice1"
                                    label={"Sale price 1"}
                                    
                                    rules={[{ required: true,  message: 'Please enter a  valid price' }]}
                                    >
                                        <InputNumber
                                                // min={priceByUnit}
                                                precision={2}
                                            style={{ width:"100%" }} addonAfter={`x ${product?.saleUnit.abbreviation}`} placeholder="Please enter a price" />
                                    </Form.Item>

                                    <Col>

                                        <Typography.Text>
                                            { ` ${ ((salePrice1 - priceByUnit) * 100 / priceByUnit).toFixed(2) } % ` }
                                        </Typography.Text>

                                    </Col>
                                </Col>


                                <Col span={7}>
                                    <Form.Item
                                    name="salePrice2"
                                    label={"Sale price 2"}
                                    initialValue={1}
                                    rules={[{ required: false, message: 'Please enter a price' }]}
                                    >
                                        <InputNumber
                                            
                                            style={{ width:"100%" }} addonAfter={`x ${product?.saleUnit.abbreviation}`} placeholder="Please enter a price" />
                                    </Form.Item>
                                </Col>

                                <Col span={7}>
                                    <Form.Item
                                    name="salePrice3"
                                    label={"Sale price 3    "}
                                    initialValue={1}
                                    rules={[{ required: false,message: 'Please enter a price' }]}
                                    >
                                        <InputNumber
                                            
                                            style={{ width:"100%" }} addonAfter={`x ${product?.saleUnit.abbreviation}`} placeholder="Please enter a price" />
                                    </Form.Item>
                                </Col>


                            </Row>
                            </Col>

                        </Row>
                       


                       
                        

                        {/* <Row gutter={16} >
                            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>
                                    <Button htmlType="submit" type="primary">
                                        Submit
                                    </Button>
                            </Col>
                        </Row> */}

                        </Form>


                    </Col>
                </Row>

 
        </Modal>
    )

}