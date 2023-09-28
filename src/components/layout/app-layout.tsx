import { Avatar, Button, Col, Dropdown, Layout, Menu, MenuProps, Row, Space, theme } from "antd"
import Sider from "antd/es/layout/Sider"
import { Content, Header } from "antd/es/layout/layout"
import { Link, Outlet } from "react-router-dom"
import { useState } from "react"

import {
  DollarOutlined,
    
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VerticalAlignBottomOutlined,
    
  } from '@ant-design/icons';
import { useQueryClient } from "@tanstack/react-query"
import { QUERIES } from "../../consts/query-consts"
import { UsersType } from "../../consts/users"

export const AppLayout = ()=>{



    const queryClient = useQueryClient()

    const user = queryClient.getQueryData<UsersType>([QUERIES.auth])


    
    

    const [collapsed, setCollapsed] = useState(false)
    const {
        token: { colorBgContainer },

      } = theme.useToken();



      const handleLogOut = ()=> {

        queryClient.invalidateQueries([QUERIES.auth])

        console.log("asdas")
      }

               

      const items: MenuProps['items'] = [
        
        {

            label: <>{`Hello ${user?.username ? user.username : "Unknown"}`}</>,
             key:1

        },

        {
          
          label: <Button type="link" onClick={handleLogOut}>Log Out </Button>,
          key: '2',
        },
      ];


    return (
            <Layout style={{ height:"100vh" }}>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        
                        items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: <Link to ="/users" > Users </Link>,
                            

                        },
                        {
                            key: '2',
                            icon: <DollarOutlined />,
                            label: "Operations",
                            children:[
                                
                                {
                                    key: '98',
                                    label: <Link to ="/operations/sales" > Sales </Link>
                                },

                                {
                                    key: '99',
                                    label: <Link to ="/operations/buy" > Buying </Link>
                                },
                            ]

                        },
                       
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: "Products",
                            children: [

                                {
                                    key: '55',
                                    label: <Link to ="/products" > Items </Link>
                                },

                                {
                                    key: '6',
                                    label: <Link to ="/products/units" > Units </Link>
                                }


                            ]
                        },

                        {
                            key:"4",
                            icon: <VerticalAlignBottomOutlined />,
                            label:<Link to ="/providers" >Providers</Link>
                        },

                        {
                            key:"5",
                            icon: <VerticalAlignBottomOutlined />,
                            label:<Link to ="/clients" >Clients</Link>
                        },

                        {
                            key:"6",
                            icon: <VerticalAlignBottomOutlined />,
                            label:<Link to ="/registers" >Register</Link>
                        }

                        ]}
                    />
                </Sider>
            <Layout>

            <Header style={{ padding: 0, background: colorBgContainer }}>

            <Row>
                <Col span={4}>
                        <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                        />
                </Col>

                <Col span={20} style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", padding: " 0  16px "}}>
                
                
                    <Dropdown menu={{ items }} trigger={['click']} >
                        
                            <Avatar onClick={(e)=>{e?.preventDefault()}} style={{ cursor:"pointer"  }}  size="large" icon={<UserOutlined />} />


                    </Dropdown>
                </Col>
            </Row>
                
            </Header>
            
            <Content
                style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                }}
            >
                <Outlet/>
            </Content>
            
            </Layout>
        </Layout>

    )
}