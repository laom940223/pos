
import { Button, Col, Row, Space, Spin, Table, Typography, notification } from 'antd'
import { ColumnsType } from 'antd/es/table';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ProviderType } from '../consts/provider';
import { AddEditProvider } from '../components/providers/add-edit-providers';
import { useQuery } from '@tanstack/react-query';
import { QUERIES } from '../consts/query-consts';
import axios from 'axios';
import { API_URL } from '../consts/endpoints';
import { ServerResponse } from '../consts/server-types';

const { Title, Text } = Typography




export const ProvidersPage =()=>{


    const [open, setOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<ProviderType>()

    const [api, contextHolder] = notification.useNotification()

    

    const providerQuery = useQuery([QUERIES.providers], async()=>{


      const response = await axios.get<ServerResponse<ProviderType[]>>(API_URL+"providers")

 
      return response.data.data


    })
    


    const showDrawer = () => {
      setOpen(true);
    };
  
    const onClose = () => {
        
      setOpen(false);
      setSelectedProvider(undefined)
    };


    const handleEdit  = (id: number)=>{
  
        setSelectedProvider(providerQuery.data?.find(provider => provider.id === id))

        showDrawer()
    }



    
const columns: ColumnsType<ProviderType> = [

    
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },

    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',

      
      sorter: (a,b)=>{
        
        if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;

      }, 
      sortDirections: ['descend','ascend'],
      
    },

    {

        title:"Address",
        dataIndex:"address",
        key:"address",
      

      },

    {
      title: 'RFC',
      dataIndex: 'rfc',
      key: 'rfc',
    },

    


    

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (

        
        <Space size="middle">
            
            <Link to={`/providers/${record.id}`}>
                <Button type="link" icon={<PlusCircleOutlined />} size={"small"} />
            </Link>

            <Button type="link" onClick={()=>{ handleEdit(record.id) }} icon={<EditOutlined />}/>

            {/* <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={handleConfirmDelete}
            
            >
                <Button danger type='link' icon={<DeleteOutlined />}/>
            </Popconfirm> */}
            
            
        </Space>
      ),
    },
  ];




  if(providerQuery.isLoading) return <Spin/>

  if(providerQuery.isError) return <>Something went wrong try again later</>



  return (
    <>

        <Row>
            <Col span={24}>

                    <Title>Providers</Title>
                    <Text> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde laboriosam in voluptates consequatur, nam harum eligendi voluptatibus dicta distinctio officia consequuntur facilis esse maxime quas veniam, quam excepturi nemo fuga!</Text>

                    <Col style={{marginTop:"1em"}}>
                        <Button type='primary' onClick={showDrawer}>Add new </Button>
                    </Col>
                    
            </Col>
        </Row>

        <Row>
            
        
             <Col style={{ width:"100%", marginTop:"2em"}}>
                <AddEditProvider  open={open} onClose={onClose} providerToEdit={selectedProvider}  />
                <Table columns={columns} dataSource={providerQuery.data}    rowKey={(record:ProviderType) => `${record.id}`} />
             </Col>   
        </Row>

        <Row>
            <Col>
                {contextHolder}
            </Col>
        </Row>
    </>
  )


}