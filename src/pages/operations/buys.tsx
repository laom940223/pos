import { useEffect, useRef, useState, useCallback } from "react"
import { Button, Col, InputNumber, Input, Row,  Typography, InputRef, Table, Space, Modal } from "antd"
    

import {  useOperationStore } from "../../slices/operation-store";

import { ColumnsType } from "antd/es/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "../../consts/query-consts";

import { OperationEnum, OperationType, ProductOperationDetail, RegisterSession } from "../../consts/operations";
import { AddBuyItem } from "../../components/utils/add-buy-item";
import { ProviderBuys } from "../../components/checkout/provider-buys";
import { SearchProduct } from "../../components/operations/search-products";
import { ProductType, sampleProducts } from "../../consts/product-types";
import useNotification from "antd/es/notification/useNotification";




const { Text, Title } = Typography
const { Search } = Input



export const Buys = ()=>{


    const searchRef = useRef<InputRef>(null)
  
    const [api, contextHolder] = useNotification()

    const [searchProductOpen, setSearchProductOpen] = useState(false)
    const [barcode, setBarcode] = useState("") 
    const [selectedProduct, setSelectedProduct] = useState<ProductType | undefined| null>(null)
    const [paymentOpen, setPaymentOpen] = useState(false)
    const [cash, setCash] = useState(0)

    const { buyStore, provider }  = useOperationStore((state)=>({ buyStore : state.buyStore, provider: state.providerStore.provider}))
    
    const queryClient = useQueryClient()
    const lastSessions = queryClient.getQueryData<RegisterSession[]>([QUERIES.lastSession])
    
    const registerSession = lastSessions ? lastSessions[0]: null


    console.log(lastSessions)
    let total = 0
    buyStore.products.forEach((acc)=>{ total = total + (acc.price! * acc.quantity!) })




    const productBarcode = useQuery<ProductType | null>([QUERIES.SEARCH_PRODUCTS_BY_BARCODE], ()=>{

        return new Promise<ProductType | null>((resolve)=>{

            const timeout = setTimeout( ()=>{
                resolve(sampleProducts.find(prod=> prod.id === +barcode) || null)

                clearTimeout(timeout)
            } ,400)
        })
    }, { enabled:false })
    


    const handleSearchProductCancel = useCallback(()=>{
        setSearchProductOpen(false)
    },[])
    
    const handleSearchProductOpen = useCallback(()=>{
            setSearchProductOpen(true)
    },[])


    const handleSearchProductOk = useCallback(( product : ProductType)=>{
        
        setSelectedProduct(product)
        handleSearchProductCancel() 
    },[handleSearchProductCancel])

    const handleClickEdit =useCallback( (id: number)=>{


        const toEdit = buyStore.products.find(p=> p.product!.id === id)
        
        setSelectedProduct(toEdit?.product)

    },[buyStore.products])


   
    
    const handlePayClick = useCallback(()=>{
            setPaymentOpen(true)
    },[])


    const handlePaymentCancel = useCallback(()=>{


        setPaymentOpen(false)

    },[])



    const handlePaymentOk = useCallback( ()=>{
        

        if(total!= cash){
            api.error({
                message:"The quantities must match",
                
            })
            return
        }


        console.log({

            sessionId:  queryClient.getQueryData<RegisterSession>([QUERIES.registerSession])?.id,
            type: OperationEnum.BUY.toString(),
            provider: provider,
            id:1,
            amount: cash,
            products:buyStore.products,
            


        } as OperationType )


        setCash(0)
        setPaymentOpen(false)
        buyStore.clearProducts()

    },[total, cash, queryClient, provider, buyStore.products, api])


    const handleCashChange = (value: number | null) =>{

            setCash(value || 0)
    }


    const handleDeleteItem = useCallback(
      (id: number) => {
        buyStore.deleteProduct(id)
      },
      [buyStore],
    )


    
   
    

      const onSearchByBarcode =async (barcode: string) =>{

        if(barcode === "") return
        
        setBarcode(barcode)
        
        // if(buyStore.products.find(f=> f.product!.id === +barcode)) return 

        const data = await productBarcode.refetch()

        if(data.isError) {
            setBarcode("")
            return
        }

       
        if(data.data!==null) setSelectedProduct(data.data)
        
        

        setBarcode("")
    }

    
      useEffect(()=>{
        searchRef.current?.focus()   
    },[buyStore.products])


   


    const columns: ColumnsType<ProductOperationDetail> = [
        
        {
            title:"Quantity",
            key: "quantity",
            render: (_, record)=>{
         
                // if(!record.product?.saleUnit.fractional){

                //     return (
                //         <>
                //             <Button disabled={ record.quantity ===1} size="small" onClick={()=>{ handleDecrement(record.product!.id)}}> - </Button>
                //                 <Text style={{margin: "0 10px"}}>{`${record.quantity} ${record.product!.saleUnit.abreviation}`} </Text>
                //             <Button size="small" onClick={()=>{ handleIncrement(record.product!.id)}} > + </Button>
                //         </>
                //         )
                // }

                return (
                    <>  
                        <Text> {`${record.quantity} ${record.product?.buyUnit.name}`}</Text>
                        {/* <Button size="small"> Edit</Button> */}
                    </>
                )
            }
        },
        
        {
          title: 'Name',
          key: 'name',
          render: (_, record)=> record.product!.name
        },

        {
            title:"Factor",
            key:"factor",
            render:(_, record)=> `${record.factor +  " " +record.product?.saleUnit.name }`

        },


        {
            title: 'Price',
            key: 'price',
            render: (_, record)=> record.price
        },


        {
            title: 'Sub Total',
            key: 'price',
            render: (_, record)=>`$${ (record.price! * record.quantity!).toFixed(2) }`
        },
 
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
                    <Button type="text"  onClick={()=>{handleClickEdit(record.product!.id)  }}>  Edit</Button>
                    <Button type="text" danger onClick={()=>{handleDeleteItem(record.product!.id) }}>  Delete</Button>
              
            </Space>
          ),
        },
      ];


    if(!registerSession) return "Something went wrong"


    const openAt = new Date(registerSession.openAt)
    
    
    return (
        <>

        <>
            {contextHolder}
        </>
        <Row>
            <Col span={24} style={{ display:"flex", justifyContent:"flex-end"}}>
                    <Title level={4}> {registerSession.register.name} </Title>
                    
            </Col>

            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>
            <Text>Opened at: {` ${openAt.toLocaleDateString()} ${openAt.toLocaleTimeString()}`}</Text>
            </Col>

            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>
                <Text>Operated By: {`${registerSession.user?.name} ${registerSession.user?.lastname}`}</Text>
            </Col>
        </Row>


        <Row>
            <Col >
                <ProviderBuys/>
            </Col>
        </Row>

        
        
        <Row>
            <Col span={24} style={{ display:"flex", justifyContent:"flex-end" }}>
                
                <Search
                    
                    disabled={ !provider  }
                    ref={searchRef}
                    style={{ width:"40%"}}
                    placeholder="Search by barcode"
                    enterButton
                    size="middle"
                    value={barcode}
                    onChange={(e)=>{ setBarcode(e.target.value) }}
                    onSearch={onSearchByBarcode}
                />

               
                
            </Col>
        </Row>

        <Row>
            <Col>
                <Button disabled={!provider} onClick={handleSearchProductOpen}>Search produuct</Button>
                
                <AddBuyItem product={selectedProduct} set={setSelectedProduct} />
                <SearchProduct open={searchProductOpen}  onCancel={handleSearchProductCancel} onSelect={ handleSearchProductOk}/>

            </Col>
        </Row>

        <Row style={{marginTop:"2em", height:"50vh"}}>

            <Col span={24}>
                    <Table columns={columns} dataSource={buyStore.products} pagination={false}  rowKey={(record)=>record.product!.id}/>
            </Col>

        </Row>

        <Row>
            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>
                    <Title>
                        { total.toFixed(2) } MXN
                    </Title>

            </Col>
        </Row>


        <Row>
            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>

                    <Button onClick={handlePayClick} disabled={buyStore.products.length === 0} size="large" type="primary">
                        Pay
                    </Button> 

                     <Modal title="Payment" open={paymentOpen} 
                        onOk={handlePaymentOk} 
                        onCancel={handlePaymentCancel}
                        footer={[
                            <Button key="back" onClick={handlePaymentCancel}>
                        Cancel
                      </Button>,
                      <Button key="submit" type="primary" disabled={total>cash} onClick={handlePaymentOk}>
                        Pay
                      </Button>,]}
                        >
                        <Row style={{width:"100%", marginTop:"1em"}}>
                            <Col span={24}>
                                <Text style={{ fontSize:"1.5em", textAlign:"center" }} >{`Total: ${total.toFixed(2)} MXN`}</Text>
                            </Col>
                        </Row>

                        <Row style={{marginTop:"1em", marginBottom:"1em"}} >
                            <Col span={24} >
                                    <InputNumber 
                                        value={cash}
                                        status={`${total > cash? "error" : ""}`}
                                        onChange={handleCashChange}
                                        onPressEnter={handlePaymentOk}
                                        name="cash" 
                                        precision={2}
                                        min={total}
                                        style={{width:"100%"   }} size="middle" 
                                        placeholder="Insert quantity"
                                        

                                        />
                            </Col>
                        </Row>

                            
                        
                    </Modal>

            </Col>
        </Row>
        </>
    )


  
}