import { useState } from 'react'
import { AutoComplete, Button, Col, Descriptions, DescriptionsProps, Modal, Row } from "antd"
import { DefaultOptionType } from "antd/es/select"
import { useOperationStore } from "../../slices/operation-store"
import { sampleProviders } from '../../consts/provider'



export const ProviderBuys = ()=>{



    const providerStore = useOperationStore((state)=> state.providerStore)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [selectedValue, setSelectedValue ] = useState<string | undefined>()


    const handleConfirm = ()=>{

        setIsModalOpen(false)
        providerStore.setProvider(sampleProviders.find( provider  => provider.name === selectedValue) || { id:1, name:"Fallback provider", address:"Fallback address"})
        // clientStore.setClient( clients.find(client=> client.name === selectedValue) || {id:58, name:"Fallback client" } )
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
          children: providerStore.provider?.name,
        },

        {

            key:"3",
            label:"Address",
            children:providerStore.provider?.address

        },

        {
            key:"2",
            label:"Change provider",
            labelStyle: { marginTop:"4px"},
            children:   <Button type={`${!providerStore.provider? "primary" : "text" }`}  onClick={handleSelectClient} >{ `${!providerStore.provider ? "Select a provider" : "Change Provider"}` }</Button>
        }
        
      ];

    const options:DefaultOptionType[] = sampleProviders.map(provider =>( { value:provider.name, label:provider.name}))


    return (

        <Row>
            <Col>
                
                
                    <Descriptions title="Provider details" items={items} /> 
                    
                    
                
                    
                    <Modal title="Select a provider" open={isModalOpen} onOk={handleConfirm} onCancel={handleCancel}>
                        
                        <AutoComplete
                            notFoundContent={"There are no options with that query"}
                            style={{ width: 200 }}
                            onSearch={handleSearch}
                            placeholder="Search for a client"
                            options={options}
                            onSelect={handleSelect}
                        />
                       

                    </Modal>

            </Col>
        </Row>
    )
}