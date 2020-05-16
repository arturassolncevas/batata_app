import React from 'react'
import { Layout, Menu } from 'antd';
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import { withRouter, NavLink } from 'react-router-dom'
import { DotChartOutlined, CarryOutOutlined, ShopOutlined, DropboxOutlined } from '@ant-design/icons';
const { Sider } = Layout;

const menuKeys = {
  "1": { location: "/dashboard", regex: [new RegExp('^/$'), new RegExp('^/dashboard')] },
  "2": { location: "/orders", regex: [new RegExp('^/orders')] },
  "3": { location: "/products", regex: [new RegExp('^/products')] },
  "4": { location: "/marketplace", regex: [new RegExp('^/marketplace')] }
}

const selectMenuKeys = (locationString) => {
  let result = []
  for (let property in menuKeys) {
    for (let regex of menuKeys[property].regex) {
      if (locationString.match(regex)) {
        result.push(property)
        break
      }
    }
  }
  return result
}

const MenuComponent = (props) => {
  console.log(props)
  return (
    <Sider style={{
      overflowY: 'auto',
      overflowX: 'hidden',
      left: '0px',
      bottom: '0px',
      top: '0px',
      position: 'absolute',
      zIndex: '100'
    }}
      width={props.menuReducer.opened ? 200 : 0}
    >
      <Menu
        mode="inline"
        style={{ height: '100%', borderRight: 0 }}
        selectedKeys={selectMenuKeys(props.history.location.pathname)}
      >
        <Menu.Item key="1">
          <NavLink to={menuKeys["1"].location}>
            <DotChartOutlined />
            {props.intl.formatMessage({ id: 'menu.dashboard' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to={menuKeys["2"].location}>
            <CarryOutOutlined />
            {props.intl.formatMessage({ id: 'menu.orders' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to={menuKeys["3"].location}>
            <DropboxOutlined />
            {props.intl.formatMessage({ id: 'menu.products' })}
          </NavLink>
        </Menu.Item>
        <Menu.Item key="4">
          <NavLink to={menuKeys["4"].location}>
            <ShopOutlined />
            {props.intl.formatMessage({ id: 'menu.marketplace' })}
          </NavLink>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

const mapStateToProps = state => {
  const { authReducer, menuReducer } = state
  return { authReducer, menuReducer }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withRouter(MenuComponent)))