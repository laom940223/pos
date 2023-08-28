
import { Button, Col, Popconfirm, Row, Space, Table,  Typography, notification } from 'antd'
import { ColumnsType } from 'antd/es/table';

import {  DeleteOutlined, EditOutlined, PlusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { useState } from 'react';

import { UnitType, sampleUnits } from '../consts/product-types';
import { AddEditUnit } from '../components/products/add-edit-units';


const { Text, Title  } = Typography

export const UnitsPage =()=>{


    const [open, setOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<UnitType>()

    const [api, contextHolder] = notification.useNotification()

   
    function handleConfirmDelete(){
        

        alert("Confirm delete")

    }
    


    const showDrawer = () => {
      setOpen(true);
    };
  
    const onClose = () => {
        
      setOpen(false);
      setSelectedUnit(undefined)
    };


    const handleEdit  = (id: number)=>{

        
        
        
        setSelectedUnit(sampleUnits.find(prov => prov.id === id))
        showDrawer()


    }



    
const columns: ColumnsType<UnitType> = [

    
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

        title:"Plural",
        dataIndex:"plural",
        key:"plural",
      

      },

    {
      title: 'Abreviation',
      dataIndex: 'abreviation',
      key: 'abreviation',
    },

    


    

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (

        
        <Space size="middle">
            
            {/* <Link to={`/providers/${record.id}`}>
                <Button type="link" icon={<PlusCircleOutlined />} size={"small"} />
            </Link> */}

            <Button type="link" onClick={()=>{ handleEdit(record.id) }} icon={<EditOutlined />}/>

            <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={handleConfirmDelete}
            
            >
                <Button danger type='link' icon={<DeleteOutlined />}/>
            </Popconfirm>
            
            
        </Space>
      ),
    },
  ];



  return (
    <>

        <Row>
            <Col span={24}>

                    <Title>Product Units</Title>
                    <Text> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde laboriosam in voluptates consequatur, nam harum eligendi voluptatibus dicta distinctio officia consequuntur facilis esse maxime quas veniam, quam excepturi nemo fuga!</Text>

                    <Col style={{marginTop:"1em"}}>
                        <Button type='primary' icon={<PlusCircleOutlined/>} onClick={showDrawer}>Add new </Button>
                    </Col>
                    
            </Col>
        </Row>

        <Row>
            
        
             <Col style={{ width:"100%", marginTop:"2em"}}>
                <AddEditUnit  open={open} onClose={onClose} unitToEdit={selectedUnit}  />
                <Table columns={columns} dataSource={sampleUnits}    rowKey={(record:UnitType) => `${record.id}`} />
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

