import { AutoComplete, Button, Col, Descriptions, DescriptionsProps, Modal, Row } from "antd"
import { useOperationStore } from "../../slices/operation-store"
import { useState, useEffect, useCallback } from "react"
import { ClientType } from "../../consts/operations"
import { DefaultOptionType } from "antd/es/select"
import { useQuery } from "@tanstack/react-query"
import { QUERIES } from "../../consts/query-consts"
import axios from "axios"
import { API_URL } from "../../consts/endpoints"
import { useDebounceValue } from "../../hooks/use-debounce"
import { ServerResponse } from "../../consts/server-types"




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

    const { clientStore } = useOperationStore((state)=> ({ clientStore:  state.clientStore}))
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedValue, setSelectedValue ] = useState<string | undefined>()

    const [query, setQuery] = useState("")

    const debouncedValue= useDebounceValue(query,100)


    const clientsQuery = useQuery([QUERIES.SEARCH_CLIENTS_BY_NAME],async ()=>{

        const response = await axios.post<ServerResponse<ClientType[]>>(API_URL+"clients/search?query="+debouncedValue)
        return response.data.data

    }, { enabled: false} )



    const reFetch = useCallback(async()=>{

         clientsQuery.refetch()

        
    },[clientsQuery]) 

    useEffect(() => {
      
        // console.log(debouncedValue)
        reFetch()
        
      
    }, [debouncedValue, reFetch])
    


    const handleConfirm = ()=>{

        setIsModalOpen(false)
        clientStore.setClient( clientsQuery.data?.find(client=> client.name === selectedValue) || {id:58, name:"Fallback client" } )
    }

    const handleCancel = ()=>{
        setIsModalOpen(false)
    }


    const handleSelectClient = ()=>{
            console.log("client selected")
            setIsModalOpen(true)
    }

    const handleSearch = (value : string)=>{

        // console.log("Handling search "+ value)
        setQuery(value)
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

    let options:DefaultOptionType[] = []

    if(!clientsQuery.isLoading && !clientsQuery.isError) options = clientsQuery.data?.map(client =>( { value:client.name, label:client.name}))
    
    


    return (

        <Row>
            <Col>
                
                
                    <Descriptions title="Client Details" items={items} /> 
                    
                    
                
                    
                    <Modal title="Select a client" open={isModalOpen} onOk={handleConfirm} onCancel={handleCancel}>
                        
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