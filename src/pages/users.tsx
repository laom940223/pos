
import { Button, Col, Popconfirm, Row, Space, Table, Tag, Typography, notification } from 'antd'
import { ColumnsType } from 'antd/es/table';
import { UserRoles, UsersType } from '../consts/users';
import { DeleteOutlined, DownloadOutlined, EditOutlined, MoreOutlined, PlusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { AddEditUser } from '../components/users/add-edit-user';

const { Title, Text } = Typography



  
  const data: UsersType[] = [
    {
      id: 1,
      name: 'John',
      lastname:' Brown',
      email:"jogh@test.com",
      role: UserRoles.EMPLOYEE,
      username:"jognas"
      
    },

    {
        id: 2,
        name: 'Albert',
        lastname:' Crasiz',
        email:"sogh@test.com",
        role: UserRoles.EMPLOYEE,
        username:"gnas"
        
      },


      {
        id: 3,
        name: 'Zendaya',
        lastname:' Rown',
        email:"zend@test.com",
        role: UserRoles.ADMIN,
        username:"aognas"
        
      },
  ];


export const UsersPage =()=>{


    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UsersType>()

    const [api, contextHolder] = notification.useNotification()

   
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
      setSelectedUser(undefined)
    };


    const handleEdit  = (id: number)=>{

        
        
        
        setSelectedUser(data.find(user => user.id ===id))

        showDrawer()


    }



    
const columns: ColumnsType<UsersType> = [

    
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },

    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',

      
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

        title:"Email",
        dataIndex:"email",
        key:"email",
        // filteredValue:["ze"],
        // onFilter: (value, record)=>{

        //     return String(record.email)
        //         .toLowerCase()
        //         .includes("ze")
        // }

      },

    {
      title: 'First Name',
      dataIndex: 'name',
      key: 'firstName',
    },

    {
        title: 'Last Name',
        dataIndex: 'lastname',
        key: 'lastName',

      },

      
      {

        title: 'Role',
        dataIndex: 'role',
        key: 'role  ',

      },


    

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (

        
        <Space size="middle">
            
            <Link to={`/users/${record.id}`}>
                <Button type="link" icon={<PlusCircleOutlined />} size={"small"} />
            </Link>

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

                    <Title> Users</Title>
                    <Text> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde laboriosam in voluptates consequatur, nam harum eligendi voluptatibus dicta distinctio officia consequuntur facilis esse maxime quas veniam, quam excepturi nemo fuga!</Text>

                    <Col style={{marginTop:"1em"}}>
                        <Button type='primary' onClick={showDrawer}> Add new User</Button>
                    </Col>
                    
            </Col>
        </Row>

        <Row>
            
        
             <Col style={{ width:"100%", marginTop:"2em"}}>
                <AddEditUser  open={open} onClose={onClose} usertoEdit={selectedUser} />
                <Table columns={columns} dataSource={data}    rowKey={(record:UsersType) => `${record.id}`} />
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