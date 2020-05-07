import React from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Dropdown } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, DownOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Badge } from 'antd';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="#">User settings</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="#">Messages</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
      Logout
    </Menu.Item>
  </Menu>
);

export default function HomePage() {
  return (
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: 'white'
            }}
          >
            Content
        </Content>
  )
}