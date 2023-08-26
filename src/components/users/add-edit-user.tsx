import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from "antd"
import { UserRoles, UsersType } from "../../consts/users";
import { useEffect } from "react";
const { Option } = Select;




export const AddEditUser = ({ open, onClose, usertoEdit } :{ onClose: ()=>void, open :boolean, usertoEdit? : UsersType } )=>{


    const [form] = Form.useForm<UsersType>();

      useEffect(()=>{

        form.resetFields()

      }, [usertoEdit, form])

      const onFinish = (values: any) => {
        // handleToggle()
        console.log('Success:', values);
        
      };
      
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };


      

    return (

        <Drawer
        title= { !usertoEdit ? "Create a new user" : "Edit user"}
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
       
      >


        <Form 
              form={form}
              layout="vertical"
              initialValues={{ 

                  username: !usertoEdit ? "" : usertoEdit.username,
                  email: !usertoEdit ? "" : usertoEdit.email,
                  name: !usertoEdit ? "" : usertoEdit.name,
                  lastName:  !usertoEdit ? "" : usertoEdit.lastname,

               }}
               
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
        
        >
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Username"
                
                rules={[{ required: true, message: 'Please enter username' }]}
              >
                <Input placeholder="Please enter a username" />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type:"email" ,  message: 'Please enter a valid email' }]}
              >
                <Input  placeholder="Please enter an email" />
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter user name' }]}
              >
                <Input placeholder="Please enter user name" />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter user last name' }]}
              >
                <Input placeholder="Please enter user last name" />
              </Form.Item>
            </Col>
          </Row>


      {
        !usertoEdit ? 
      
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required:true, message: 'Please enter a password' }]}
              >
                <Input.Password placeholder="Please enter a password" />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="cPassword"
                label="Confirm Password"
                rules={[{ required: true, message: 'Please enter a password' }]}
              >
                <Input.Password placeholder="Please confirm the password" />
              </Form.Item>
            </Col>
          </Row>
        :
        

        <Button> To Do Link to edit password</Button>

      }

          <Row gutter={16}>
           
            <Col span={12}>
              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: 'Please choose the role' }]}
                initialValue={  !usertoEdit ? "" : usertoEdit.role}
              >
                <Select placeholder="Please choose the role">

                  
                  <Option value={UserRoles.ADMIN}>{UserRoles.ADMIN}</Option>
                  <Option value={UserRoles.EMPLOYEE}>{UserRoles.EMPLOYEE}</Option>
                  <Option value={UserRoles.SUPERVISOR}>{UserRoles.SUPERVISOR}</Option>
                  
                </Select>
              </Form.Item>
            </Col>
          </Row>
          

          <Row gutter={16}>
            <Col span={24} style={{display:"flex", justifyContent:"flex-end"}}>

              <Button htmlType="submit" type="primary">
                  Submit
                </Button>
            </Col>
          </Row>

        </Form>
      </Drawer>

    )

}