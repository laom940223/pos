



import { Button, Col, Row, Space, Spin, Table, Typography, notification } from 'antd'
import { ColumnsType } from 'antd/es/table';

import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { ProductType, sampleProducts } from '../consts/product-types';
import { AddEditProduct } from '../components/products/add-edit-products';
import { useQuery } from '@tanstack/react-query';
import { QUERIES } from '../consts/query-consts';
import axios from 'axios';
import { API_URL } from '../consts/endpoints';
import { ServerResponse } from '../consts/server-types';

const { Title, Text } = Typography





export const ProductsPage =()=>{


    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductType>()

    const [api, contextHolder] = notification.useNotification()



    const productsQuery = useQuery([QUERIES.products], async ()=>{
          const response = await axios.get<ServerResponse<ProductType[]>>(API_URL+"products")
          return response.data
    })


   
    const handleConfirmDelete = useCallback(
      async () => {
            try{
                const response = await fetch("https://swapi.dev/api/people")
                const datos = await response.json()
                // console.log(datos)
                
                api.success({
                     
                    message:"User deleted succesfully",
                    placement:"bottomRight"
                })


            }catch(err){

                api.error({
                    message:"Something went wrong try again later",
                    placement:"bottomRight"
                })
            }

                
                
    
      },[api]
    )
    


    const showDrawer = () => {
      setOpen(true);
    };
  
    const onClose = () => {
        
      setOpen(false);
      setSelectedProduct(undefined)
    };


    const handleEdit  = (id: number)=>{

        setSelectedProduct(productsQuery.data?.data.find(product => product.id ===id))
        showDrawer()
    }



    
const columns: ColumnsType<ProductType> = [

    
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
    },

    {
      title: 'Name',
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

        title:"Price",
        key:"price",
        render: (_, record)=>{
          return record.prices[0].amount
        }

      },

    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },

    {
        title: 'Unit',
        key: 'unit',
        render: (_, record)=>{

            
            return record.saleUnit.name
        }

      },

   


    

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (

        
        <Space size="middle">
            
            <Link to={`/products/${record.id}`}>
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




  if(productsQuery.isLoading) return <Spin/>


  if(productsQuery.isError) return <>Something went wrong try again later</>

  return (
    <>

        <Row>
            <Col span={24}>

                    <Title> Products</Title>
                    <Text> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde laboriosam in voluptates consequatur, nam harum eligendi voluptatibus dicta distinctio officia consequuntur facilis esse maxime quas veniam, quam excepturi nemo fuga!</Text>

                    <Col style={{marginTop:"1em"}}>
                        <Button type='primary' onClick={showDrawer}> Add new product</Button>
                    </Col>
                    
            </Col>
        </Row>

        <Row>
            
        
             <Col style={{ width:"100%", marginTop:"2em"}}>
                <AddEditProduct  open={open} onClose={onClose} productToEdit={selectedProduct} />
                <Table columns={columns} dataSource={productsQuery.data.data}    rowKey={(record:ProductType) => `${record.id}`} />
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