import React from 'react'
import { PageHeader, Divider } from 'antd';
import { CarryOutOutlined } from '@ant-design/icons';

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Orders"
        avatar={{ icon: (<CarryOutOutlined />) }}
      />
      <Divider className="site-devider after-header"></Divider>
    </div>
  )
}