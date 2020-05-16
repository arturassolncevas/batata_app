import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout } from 'antd';
import { logOut } from '../redux/actions/authActions'
import { triggerMenu } from '../redux/actions/menuActions'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Header from "../shared/Header"
import Menu from "../shared/Menu"

const { Content } = Layout;

class MainLayout extends Component {

  async handleLogOut(e) {
    e.preventDefault
    await this.props.logOut()
    this.props.history.push("/")
  }

  async handleMenuClick(e) {
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
          <Menu />
          <Layout style={{ overflowY: 'auto' }} className={`content ${this.props.menuReducer.opened ? "opened" : "closed"}`}>
            <Content
              className="site-layout-background"
              style={{
                padding: 15,
                margin: 0,
                background: 'white',
                minHeight: 'initial'
              }}
            >
              {this.props.children}
            </Content>
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