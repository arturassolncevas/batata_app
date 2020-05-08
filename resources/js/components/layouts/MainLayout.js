import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Dropdown } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, DownOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Badge } from 'antd';
import { logOut } from '../redux/actions/authActions'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const menu = (that) => (
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
        onClick={that.handleLogOut}
      >
        Logout
      </a>
    </Menu.Item>
  </Menu>
);

class MainLayout extends Component {
  constructor(props) {
    super(props)
    this.handleLogOut = this.handleLogOut.bind(this)
  }
  handleLogOut(e) {
    e.preventDefault
    console.log(this.props)
    this.props.logOut()
    this.props.history.push("/")
  }

  render() {
    return (
      <Layout style={{ height: "100vh" }} >
        <Header className="header" style={{ padding: '0px' }} >
          <div style={{ paddingLeft: '20px', width: '200px' }}>
            <img className="logo" src="https://carrothealth.com/wp-content/uploads/2019/10/carrot-logo-200w.png" />
          </div>
          <div style={{
            height: '64px',
            width: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            float: "right"
          }}>
            <Dropdown overlay={(() => menu(this))()} trigger={['click']}>
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
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} style={{ float: 'right' }} >
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
          </Menu>
        </Header>
        <Layout>
          <Sider style={{
            overflowY: 'scroll',
            overflowX: 'hidden',
            left: 0,
          }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu
                key="sub1"
                title={<span> <UserOutlined /> subnav 1 </span>} >
                <Menu.Item key="1">option1</Menu.Item>
                <Menu.Item key="2">option2</Menu.Item>
                <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={<span> <LaptopOutlined /> subnav 2 </span>} >
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub3"
                title={<span> <NotificationOutlined /> subnav 3 </span>} >
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: '24px 24px 24px' }}>
            {this.props.children}
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  const { authReducer } = state
  return { authReducer }
}

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut())
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MainLayout))