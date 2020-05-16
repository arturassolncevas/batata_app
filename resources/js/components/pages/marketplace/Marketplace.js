import React from 'react'
import { PageHeader, Divider } from 'antd';
import { ShopOutlined } from '@ant-design/icons';

export default function MarketPlacePage() {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Marketplace"
        avatar={{ icon: (<ShopOutlined />) }}
      />
      <Divider className="site-devider after-header"></Divider>
    </div>
  )
}