import React from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Dropdown, PageHeader } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, DownOutlined, MessageOutlined, SettingOutlined, HomeFilled } from '@ant-design/icons';
import { Avatar, Badge } from 'antd';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

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
      <PageHeader
        className="site-page-header"
        title="Title"
        avatar={{icon: (<HomeFilled />)}}
      />

    </Content>
  )
}