import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "../consts/query-consts"
import axios from "axios"
import { ServerResponse } from "../consts/server-types"
import { Register } from "../consts/operations"
import { Button, Card, Col, Row, Spin, Typography } from "antd"
import { API_URL } from "../consts/endpoints"

import { OperationState, useOperationStore } from "../slices/operation-store"
import { useCallback, useState } from "react"
import { REGISTER_KEY } from "../hooks/use-load-register"
import { AddEditRegister } from "../components/register/ad-edit-register"


export const RegistersPage = ()=>{


    const [open, setOpen] = useState(false)
    const [registerToEdit, setRegisterToEdit] = useState<Register>()



    const registerStore = useOperationStore((state:OperationState)=> state.registerStore)

    
    const registersQuery = useQuery([QUERIES.registers], async()=>{
        const response =  await axios.get<ServerResponse<Register[]>>(API_URL+"register")
        return response.data
    })


    const onClickSelect =useCallback((id: number)=>{

        const selected=registersQuery.data?.data.find( regis=> regis.id ===id)

        if(selected){

            localStorage.setItem(REGISTER_KEY, JSON.stringify(selected))
            registerStore.setRegister(selected)
        }
            
    },[registerStore, registersQuery.data?.data])

 

    const onOpen = useCallback(()=>{
        setOpen(true)
    },[])


    const onClose  =useCallback(()=>{
        setOpen(false)
    },[])

    const onEditRegister  =useCallback((id: number)=>{

        const selected =registersQuery.data?.data.find(el=> el.id === id)

        console.log(selected)

        if(selected){
            setRegisterToEdit(selected)
            onOpen()
        }

    },[onOpen, registersQuery.data?.data])



    if(registersQuery.isLoading) return <Spin/>


    if(registersQuery.isError) return<>Something went wron try again later</>



    const cards = registersQuery.data.data.map( regis=>{
        
        


        return (

                    <Col span={8}>
                        <Card title={regis.name}  >

                            <Row style={{width:"100%"}}>
                                <Col span={24} style={{ display:"flex", gap:15}}>
                                    <Button disabled={regis.name === registerStore.register?.name} type="primary" onClick={()=>{ onClickSelect(regis.id)}} >Select</Button>
                                    <Button type="default" onClick={()=>{ onEditRegister(regis.id)}} >Edit</Button>
                                </Col>
                            </Row>
                                


                        </Card>
                    </Col>
    )})

    return (


        <>


            <Row>
                <Col span={12}>
                    <Typography.Title level={3}>
                        {registerStore.register ? `Curently this computer is: ${registerStore.register.name}` : "Please select a register to assign to this computer" }
                    </Typography.Title>
                        
                </Col>
            </Row>

            <Row style={{margin:"2em 0" }}>
                <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>
                    <AddEditRegister onClose={onClose} open={open} registerToEdit={registerToEdit} />
                    <Button onClick={onOpen} type="primary">Add new register</Button>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <Row gutter={16}>
                    
                        {cards}
                    
                    </Row>
                </Col>
            </Row>
        
        </>
        

    )




}