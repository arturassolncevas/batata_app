import React, { Component } from 'react'
import { PageHeader, Divider, Button } from 'antd';
import { DropboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'

export default class ProductsPage extends Component {

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Products"
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
          extra={[(
            <Link key="1" to="/products/new">
              <Button className="site-button soft" type="primary" shape="circle" icon={<PlusOutlined />} size={"large"} />
            </Link>)]}
        />
        <Divider className="site-devider after-header"></Divider>
      </div>
    )
  }
}