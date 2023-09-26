
import { Button, Col, Form, InputNumber, Row,  Spin, Typography } from "antd"
import { useState, useCallback} from "react"
import {  RegisterSession } from "../../consts/operations"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERIES } from "../../consts/query-consts"
import { Navigate, Outlet } from "react-router-dom"
import axios, { AxiosResponse, isAxiosError } from "axios"
import { API_URL } from "../../consts/endpoints"
import { useOperationStore } from "../../slices/operation-store"
import { ServerError, ServerResponse } from "../../consts/server-types"
import { UsersType } from "../../consts/users"
import { AuthorizeOperation } from "../auth/authorize-operation"



const {Text, Title } = Typography


export type CreateSession={

    
    openingAmount:number;
    registerId:number;
    userId:number;
    openAuthorizedBy:number;
}

export const VerifyCashierSession =  (   )=>{

    const queryClient = useQueryClient()
    const registerStore = useOperationStore(state=> state.registerStore)
    const [form] = Form.useForm();
    const auth = queryClient.getQueryData<UsersType>([QUERIES.auth])   
    const [authorization, setAuthorization] = useState(false)
    const [amount, setAmount] = useState(0)

    const registerSession = useQuery<RegisterSession[] , AxiosResponse<ServerResponse<unknown>>>( [QUERIES.lastSession], async()=>{
        const response = await axios.get<ServerResponse<RegisterSession[]>>(API_URL+"register-sessions/"+registerStore.register?.id)
        return response.data.data
    }) 



    const createSessionMutation = useMutation((values: CreateSession)=>{


     
        return axios.post(API_URL+"register-sessions",values )

    },{

        onError:(err)=>{

            if(isAxiosError(err)){

                alert("Something went wrong")
            }

        },

        onSuccess:()=>{


            queryClient.invalidateQueries([QUERIES.lastSession])

        }


    })


    const onSuccessAuthorization = useCallback((id: number)=>{


        const formated  = {

            userId: auth?.id,
            openAuthorizedBy: id,
            openingAmount: amount,
            registerId: registerStore.register?.id
        } as CreateSession
            
       

        createSessionMutation.mutate(formated)
        
            


    },[amount, auth?.id, createSessionMutation, registerStore.register?.id])


    // const onFailedAuthorization = useCallback(()=>{

      

    // },[])

    const onOpenAuthorization= useCallback(() => {
        setAuthorization(true)
      },[],)
    

      const onCancelAuthorization= useCallback(() => {
        setAuthorization(false)
      },[],)

      const onCloseAuthorization= useCallback(() => {
        setAuthorization(false)
      },[],)


   


    const onFinish = (values: any) => {
        // setRegisterSession(  { id:125, openTime:new Date(), user, register: {name: values.register}, moneyAtOpen: values.moneyAtOpen,authorizedBy:undefined, closingTime:undefined, moneyAtClose:undefined  } as RegisterSession )

        
        setAmount(values.openingAmount)   
        if(auth?.role=== "EMPLOYEE" ){
            onOpenAuthorization()
            return
        }

        onSuccessAuthorization(auth?.id||0)

    };

    const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    };



    if(!registerStore.register) return <Navigate to={"/registers"}  />
  
    if(registerSession.isLoading){

        return <Spin/>
    }

    if(registerSession.isError) {


        if(isAxiosError(registerSession.error)){


            console.log("inside axios error")
            console.log(registerSession.error.response?.status)
            if(registerSession.error.response?.status === 400){

                console.log("inside error code 400")

                 const err = registerSession.error.response?.data.errors[0] as ServerError

                 if(err.location ==="register")return <>The register you provide does not exist please contact your supervisor </>
                 

            }
        }

        return <>Something went wrong</>

    }



    if(registerSession.data.length>0) {

        const lastSession = registerSession.data[0]

        
        if(!lastSession.closedAt){

            if(lastSession.user?.id !==auth?.id){
                return <>This register has a session with another user please contact your supervisor</>
            }
            
            // if(!queryClient.getQueryData([QUERIES.registerSession])){

            //     console.log(lastSession)
            //     queryClient.setQueryData([QUERIES.registerSession], ()=> lastSession)
            // }
                


            console.log("Before outlet")
            return <Outlet/>

            
        }

    }

    


    return(
        <>
                <Row style={{ marginBottom:"3em"}} >
                    <Col>
                            <Title>Open Register</Title>
                            <Text>Before you can checkout please input the info below</Text>
                            

                            
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form 
                        form={form}
                        layout="vertical"
                        initialValues={{ 
                        }}

                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        style={{
                            width:"100%"

                        }}  
                        >

                        <Row gutter={16}>

                            <Col span={12}>
                                <Typography.Text>
                                    {`You are using ${registerStore.register.name} ${registerStore.register.id}`}
                                </Typography.Text>
                            </Col>


                            <Col span={12}>
                                <Form.Item
                                name="openingAmount"
                                label="Cash available"

                                rules={[{ required: true, type:"number" ,  message: 'Please enter a quantity' }]}
                                >
                                    <InputNumber style={{width:"100%"}} min={0} precision={2} placeholder="Please enter a quantity" />
                                </Form.Item>
                            </Col>
                           
                        </Row>


                        <Row>
                            <AuthorizeOperation open={authorization} 
                                onCancel={onCancelAuthorization} 
                                onClose={onCloseAuthorization}
                                onSuccess={onSuccessAuthorization} />
                        </Row>
                       


                        <Row gutter={16}>
                        <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>

                        <Button htmlType="submit" type="primary">
                        Submit
                        </Button>
                        </Col>
                        </Row>

                        </Form>
                        </Col>
                </Row>
            
            </>

    )
}