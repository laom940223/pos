import { Avatar, Button, Col, Dropdown, Layout, Menu, MenuProps, Row, Space, theme } from "antd"
import Sider from "antd/es/layout/Sider"
import { Content, Header } from "antd/es/layout/layout"
import { Link, Outlet } from "react-router-dom"
import { useState } from "react"

import {
    DownOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';

export const AppLayout = ()=>{

    const [collapsed, setCollapsed] = useState(false)
    const {
        token: { colorBgContainer },

      } = theme.useToken();


      

      const items: MenuProps['items'] = [
        {
          label: <a href="https://www.antgroup.com">1st menu item</a>,
          key: '0',
        },
        {
          label: <a href="https://www.aliyun.com">2nd menu item</a>,
          key: '1',
        },
        {
          type: 'divider',
        },
        {
          label: '3rd menu item',
          key: '3',
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
                            label: <Link to ="/" > Test </Link>
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: <Link to ="/asdasdesa" > 3 </Link>
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: <Link to ="/" > Test ssaas</Link>
                        },
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