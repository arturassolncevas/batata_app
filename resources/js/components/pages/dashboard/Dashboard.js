import React from 'react'
import { PageHeader, Divider, Row, Col } from 'antd';
import { DotChartOutlined } from '@ant-design/icons';
import { Bar, ChartCard, Field, Pie} from 'ant-design-pro/lib/Charts';
import 'ant-design-pro/dist/ant-design-pro.css';
import numeral from 'numeral';

let generateSalesData = () => {
  const salesData = [
    {
      x: "2012-01",
      y: 32,
    },

    {
      x: "2012-02",
      y: 61,
    },
    {
      x: "2012-03",
      y: 103,
    },
    {
      x: "2012-04",
      y: 151
    },
    {
      x: "2012-05",
      y: 178
    },
    {
      x: "2012-06",
      y: 143
    },
    {
      x: "2012-07",
      y: 121
    },
    {
      x: "2012-08",
      y: 145,
    }
  ];
  return salesData
}

const salesPieData = [
	{
		x: 'Vegetables',
		y: 32,
	},
	{
		x: 'Fruits',
		y: 48,
	},
	{
		x: 'Diary',
		y: 20
	}
];

export default function DashBoardPage() {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="DashBoard"
        avatar={{ icon: (<DotChartOutlined />) }}
      />
      <Divider className="site-devider after-header"></Divider>
      <Row style={{}}>
        <Col md={12}>
        <ChartCard
          title="Sales"
          total={"934"}
          contentHeight={300}
        >
          <Bar height={250} data={generateSalesData()} />,
      </ChartCard>
        </Col>
        <Col md={12}>
        <ChartCard
          title="Category Sales"
          total={""}
          contentHeight={300}
        >
	   <Pie
	      hasLegend
	      title="Category orders"
	      subTitle=""
	      total={""}
	      data={salesPieData}
	      valueFormat={val => ""}
	      height={294}
	    />
	  </ChartCard>
	</Col>
      </Row>
    </div>
  )
}
