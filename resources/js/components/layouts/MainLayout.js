import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Link, withRouter } from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Dropdown, Row, Col, Button } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined} from '@ant-design/icons';
import { Avatar, Badge } from 'antd';
import { logOut } from '../redux/actions/authActions'
import { triggerMenu } from '../redux/actions/menuActions'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Header from "../shared/Header"

const { SubMenu } = Menu;
const { Sider } = Layout;

class MainLayout extends Component {
  constructor(props) {
    super(props)
    console.log(props)

  }

  async handleLogOut(e) {
    e.preventDefault
    await this.props.logOut()
    this.props.history.push("/")
  }

  async handleMenuClick(e) {
    console.log("handle")
    await this.props.triggerMenu()
  }

  render() {
    return (
      <Layout style={{ height: "100vh" }} >
        <Header
          handleMenuClick={(e) => { this.handleMenuClick(e) }}
          handleLogOut={(e) => { this.handleLogOut(e) }}
         />
        <Layout style={{ position: "relative" }}>
          <Sider style={{
            overflowY: 'scroll',
            overflowX: 'hidden',
            left: '0px',
            bottom: '0px',
            top: '0px',
            position: 'absolute',
            zIndex: '100'
          }}
          width={this.props.menuReducer.opened ? 200 : 0}
          >
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
          <Layout className={`content ${ this.props.menuReducer.opened ? "opened" : "closed"}`}>
            {this.props.children}
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  const { authReducer, menuReducer } = state
  return { authReducer, menuReducer }
}

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut()),
  triggerMenu: () => dispatch(triggerMenu())
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(MainLayout)))