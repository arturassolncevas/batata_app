import React from 'react'
import { PageHeader, Divider } from 'antd';
import { DotChartOutlined } from '@ant-design/icons';

export default function DashBoardPage() {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="DashBoard"
        avatar={{ icon: (<DotChartOutlined />) }}
      />
      <Divider className="site-devider after-header"></Divider>
    </div>
  )
}