import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Layout, Menu, Dropdown, Row, Col, Button, Badge, Avatar } from 'antd';
import { MenuFoldOutlined, MenufoldOutlined } from '@ant-design/icons'
import logoImage from '../../../images/batata-logo.svg'
const { Header } = Layout;



const menu = (handleLogout) => {
  return (
    <Menu>
      <Menu.Item key="0">
        <a href="#">User settings</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="#">Messages</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">
        <a
          onClick={handleLogout}
        >
          Logout
      </a>
      </Menu.Item>
    </Menu>
  )
}

export default (props) => {
  const { handleMenuClick, handleLogOut } = props
  return (<Header className="header" style={{ padding: '0px' }} >
    <Row justify="space-between">
      <Col style={{ display: "flex" }}>
        <Button
          className="l1-width l1-height"
          type="primary"
          icon={<MenuFoldOutlined style={{ fontSize: "24px" }} />}
          onClick={handleMenuClick}
        />
        <div style={{ paddingLeft: '20px', width: '200px', height: '64px' }}>
          <img style={{ height: "100%", padding: "10px" }} src={logoImage} />
        </div>
      </Col>
      <Col style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ color: "white" }}>Arturas</div>
        <div style={{
        }}>
          <Dropdown overlay={menu(handleLogOut)} trigger={['click']}>
            <a
              style={{
                height: '64px',
                width: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                float: 'right'
              }}

              className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <Badge count={1}>
                <Avatar shape="square" src="https://avatars3.githubusercontent.com/u/10627086?s=40&v=4" />
              </Badge>
            </a>
          </Dropdown>
        </div>
      </Col>
    </Row>
  </Header>)
}