import React from 'react'
import { PageHeader, Divider } from 'antd';
import { DropboxOutlined } from '@ant-design/icons';

export default function ProductsPage() {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Products"
        avatar={{ icon: (<DropboxOutlined className="header-icon"/>) }}
      />
      <Divider className="site-devider after-header"></Divider>
    </div>
  )
}