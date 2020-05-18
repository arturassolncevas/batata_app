import React, { Component } from 'react'
import { PageHeader, Divider, Button } from 'antd';
import { DropboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom'

class NewProdutPage extends Component {
  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="New Product"
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
          onBack={() => { this.props.history.goBack() }}
        />
        <Divider className="site-devider after-header"></Divider>
      </div>
    )
  }
}

export default withRouter(NewProdutPage)