import { useCallback, useState, useEffect} from "react"
import { Button, Col, Form, InputNumber, Modal, Row, Typography, message } from "antd"
import { useOperationStore } from "../../slices/operation-store"
import { ServerError, ServerResponse } from "../../consts/server-types"

import { CreateOperation, Operation, OperationEnum, RegisterSession } from "../../consts/operations"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { QUERIES } from "../../consts/query-consts"
import axios from "axios"
import { API_URL } from "../../consts/endpoints"


export interface PaymentModalProps {


    open: boolean,
    onOk: (change: number)=>void
    onCancel:()=>void
    
}

export const PaymentModal = ({ onCancel, onOk, open }:PaymentModalProps)=>{


    const [form] = Form.useForm();
    const {products, client} = useOperationStore(state=> ({ client: state.clientStore.client, products: state.saleStore.products}))
    const [errors, setErrors] = useState<ServerError[]>([])
    const [pChange, setPChange]  = useState(0)


    const cash = Form.useWatch('cashAmount', { form});
    const card = Form.useWatch('cardAmount', { form});
    const queryClient = useQueryClient()
    const session = queryClient.getQueryData<RegisterSession[]>([QUERIES.lastSession])


    useEffect(()=>{

        form.resetFields()
        setErrors([])
        setPChange(0)
    },[open])


    let total = 0;
    products.forEach(product=> {
        total += product.price! * product.quantity
    })
 

    // console.log(pChange)


    const saleMutation = useMutation( async (operation : CreateOperation)=>{
        const response = await  axios.post<ServerResponse<Operation>>(API_URL+"operations/sales", operation)
        return response.data

    },{

        onError: (err)=>{

            alert("Something went wrong ")

        }, 

        onSuccess:()=>{



            // alert(JSON.stringify(response.data, null, 5))

            console.log("On ok change:" + pChange)
            setPChange(0)
            onOk(pChange)
        }

    })
    
    
    
    
    



    const onFinish = useCallback(({cardAmount, cashAmount}: {cardAmount: number, cashAmount: number})=>{
        

        setErrors([])
        setPChange(0)
        const sum =cardAmount + cashAmount
        let remaining =total;
        let actualCash = 0 
        



        if(sum<total){
            setErrors([{location:"global", message:"The amount you provide is not enough!"}])
            return 
        }

        
        if(cardAmount>0){
            
            if(cardAmount> total){
                setErrors([{location:"cardAmount", message:"If you pay with card amount cant be greater than total"}])
                return 
            }

            remaining = total - cardAmount

        }

        const change = cashAmount -remaining;
        actualCash = cashAmount - change

        // console.log("change before " + change)
        setPChange(change)
        
            


        const operation = {

            cardAmount, 
            cashAmount: actualCash,
            clientId: client?.id,
            sessionId: session![0].id,
            total,
            type:OperationEnum.SALE,
            products


        } as CreateOperation
        
        saleMutation.mutate(operation)

    }, [session, products])


    const onFinishFailed = useCallback((errors: unknown)=>{


    },[])



    const index = errors.findIndex(error => error.location==="global")
    let globalError;

    if(index>=0){


       globalError = <Typography.Text  style={{color:"red", fontSize:"1.2em"}}>
            {errors[index].message}
        </Typography.Text>
    }

    return (
        <Modal title="Payment" 
        width={800}
            open={open} 
            // onOk={onOk} 
            onCancel={onCancel}
            footer={[
                
            ]}
            >
            
            <Row style={{width:"100%", marginTop:"1em"}}>
                <Col span={24}>
                    <Typography.Text style={{ fontSize:"1.5em", textAlign:"center" }} >{`Total: ${total.toFixed(2)} MXN`}</Typography.Text>
                </Col>
            </Row>

            <Form 
              form={form}
              layout="vertical"
              initialValues={{ 

                cardAmount:0,
                cashAmount :0

               }}
               
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
        
        >

{/* 
cardAmount: number,
    cashAmount: number, 
    creditAmount: number */}
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cashAmount"
                label="Amount Cash"
                
                // validateStatus={`${errors.find(field => field.location === "username") ? "error" : "" }`}
                // help={ errors.find(field => field.location ==="username")?.message}
                // rules={[{ required: true, message: 'Please enter username' }]}
              >
                <InputNumber
                    style={{width:"100%"}}
                    min={0}
                  precision={2}  
                  />
              </Form.Item>
            </Col>


            <Col span={12}>
              <Form.Item
                name="cardAmount"
                label="Amount Card"
                
                validateStatus={`${errors.find(field => field.location === "cardAmount") ? "error" : "" }`}
                help={ errors.find(field => field.location ==="cardAmount")?.message}
                // rules={[{ required: true, message: 'Please enter username' }]}
              >
                <InputNumber
                    style={{width:"100%"}}
                    min={0}
                    precision={2}  
                  />
              </Form.Item>
            </Col>

            </Row>

            <Row>
                <Col>
                
                        {globalError}
                </Col>

            </Row>


            <Row>
                <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>
                
                    <Button 
                            htmlType="submit" 
                            type="primary" 
                            style={{marginRight:"10px"}}
                            disabled ={ (cash + card) <=0 }
                            > Pay</Button>
                    
                    <Button key="back" onClick={onCancel} >
                        Cancel
                    </Button>
                </Col>
            </Row>
            

            </Form>
        </Modal>


    )
}