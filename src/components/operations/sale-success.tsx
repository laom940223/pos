



import { Button, Col, Form, Modal, Result, Row, Typography, message } from "antd"



export interface SuccessModalProps {


    open: boolean,
    onOk: ()=>void
    onCancel:()=>void,
    change: number
    
}

export const SaleSuccessModal = ({ onCancel, onOk, open, change }:SuccessModalProps)=>{


    const [form] = Form.useForm();
  

 


    

    return (
        <Modal title="Payment" 
        width={800}
            open={open} 
            onOk={onOk} 
            onCancel={onCancel}
            
            >
            
            <Row style={{width:"100%", marginTop:"1em"}}>
                <Col span={24}>

                <Result
                    status="success"
                    title="Success"
                    subTitle={`Change ${change}`}
                    
                />


                </Col>
            </Row>

           
        </Modal>


    )
}