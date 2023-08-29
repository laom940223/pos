import { AutoComplete, Button, Col, Descriptions, DescriptionsProps, Modal, Row } from "antd"
import { useCartStore } from "../../slices/carts-store"
import { useState } from "react"
import { ClientType } from "../../consts/sales"
import { DefaultOptionType } from "antd/es/select"




const clients:ClientType[] =[

    {
        id:1,
        name:"Publico en general"

    },

    {
        id:2,
        name:"Test client 2"
    },

    {
        id:3,
        name: "Misael River ",

    }

]


export const ClientCheckout = ()=>{

    const { clientStore } = useCartStore((state)=> ({ clientStore:  state.clientStore}))
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [selectedValue, setSelectedValue ] = useState<string | undefined>()


    const handleConfirm = ()=>{

        setIsModalOpen(false)
        clientStore.setClient( clients.find(client=> client.name === selectedValue) || {id:58, name:"Fallback client" } )
    }

    const handleCancel = ()=>{
        setIsModalOpen(false)
    }


    const handleSelectClient = ()=>{
            console.log("client selected")
            setIsModalOpen(true)
    }

    const handleSearch = (value : string)=>{

        console.log("Handling search "+ value)
    }


    const handleSelect = (value: string)=> {

        

        setSelectedValue(value)
    }

    

    const items: DescriptionsProps['items'] = [
        {
          key: '1',
          label: 'Name',
          children: clientStore.client?.name,
        },

        {
            key:"2",
            label:"Change Client",
            labelStyle: { marginTop:"4px"},
            children:   <Button type={`${!clientStore.client? "primary" : "text" }`}  onClick={handleSelectClient} >{ `${!clientStore.client ? "Select a client" : "Change Client"}` }</Button>
        }
        
      ];

    const options:DefaultOptionType[] = clients.map(client =>( { value:client.name, label:client.name}))


    return (

        <Row>
            <Col>
                
                
                    <Descriptions title="Client" items={items} /> 
                    
                    
                
                    
                    <Modal title="Select a client" open={isModalOpen} onOk={handleConfirm} onCancel={handleCancel}>
                        
                        <AutoComplete
                            notFoundContent={"There are no options with that query"}
                            style={{ width: 200 }}
                            onSearch={handleSearch}
                            placeholder="input here"
                            options={options}
                            onSelect={handleSelect}
                        />
                       

                    </Modal>

            </Col>
        </Row>
    )
}