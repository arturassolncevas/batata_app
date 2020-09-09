import React from 'react'
import { PageHeader, Divider, Row, Col, Table, Tag } from 'antd';
import { DotChartOutlined } from '@ant-design/icons';
import Trend from 'ant-design-pro/lib/Trend';
import { Bar, ChartCard, Field, Pie } from 'ant-design-pro/lib/Charts';
import 'ant-design-pro/dist/ant-design-pro.css';
import numeral from 'numeral';
import moment from 'moment'

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

const tableColumns = [
  {
    title: '',
    width: 100,
    dataIndex: 'picture',
    key: 'picture',
    fixed: 'left',
    render: link => <img style={{ height: "80px", padding: "2px" }} src={link} />
  },
  {
    title: 'Title',
    width: 100,
    dataIndex: 'title',
    key: 'title',
    fixed: 'left',
  },
  {
    title: 'Categry',
    dataIndex: 'category',
    key: 'categry',
    width: 150,
  },
  {
    title: 'In Stock',
    dataIndex: 'inStock',
    key: 'quantityInStock',
    width: 150,
  },
  {
    title: '',
    dataIndex: 'identifier',
    key: 'identifier',
    width: 150,
    render: text => (
      <Tag style={{ margin: "4px" }} color={text == "Low" ? "error" : "warning"}>
        {text}
      </Tag>)
  },
];

const tableData = [
  {
    key: 1,
    picture: "https://www.plantorama.dk/-/media/Images/Guide/Have/Haveplanter/Spiselige-baer-og-planter/Krydderurter/Dyrkning-af-basilikum/basilikum-spot-1.png?width=200&height=200&mode=crop&quality=70",
    title: 'Basil',
    category: 'Food > Vegetables > R',
    inStock: " 58 x 150 g(pack)",
    identifier: "Low"

  },
  {
    key: 3,
    picture: "https://www.myswanlake.com/wp-content/uploads/2016/08/Hot-House-Tomatoes-On-The-Vine-200x200.jpg",
    title: 'Cherry tomatoes',
    category: 'Food > Vegetables > Tomatoes',
    inStock: "248 kg",
    identifier: "Low"

  },
  {
    key: 4,
    picture: "https://5.imimg.com/data5/IQ/NS/MY-11305339/whole-uncooked-raw-chicken-500x500.jpg",
    title: 'Broiler',
    category: 'Food > Poultry > Broiler',
    inStock: " 28 x 1,5kg(pack)",
    identifier: "Low"

  },
  {
    key: 2,
    picture: "https://gardenseedsmarket.com/images/thumbnails/320/320/detailed/61/rabarbar-victoria.jpg",
    title: 'Summer Rhubarb',
    category: 'Food > Vegetables > Rhubarbar',
    inStock: "142 x 15 pcs(pack)",
    identifier: "Medium"

  },
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
            title="Sales orders"
            total={"Total: 934"}
            contentHeight={300}
          >
            <Bar height={250} data={generateSalesData()} />,
          </ChartCard>
        </Col>
        <Col md={12}>
          <ChartCard
            title="Revenue"
            total={() => <span dangerouslySetInnerHTML={{ __html: "87.512 Kr" }} />}
            footer={<Field label={`(2020-09-01 - ${moment(Date.now()).format('YYYY-MM-DD')})`} />}
            contentHeight={35}
            avatar={
              <img
                style={{ width: 56, height: 56 }}
                src="https://www.iconfinder.com/data/icons/personal-business-finance-set-2-1/64/b-75-512.png"
                alt="indicator"
              />
            }
          >
            <span>
              <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                -12%
          </Trend>
            </span>
          </ChartCard>

          <ChartCard
            title="August"
            total={() => <span dangerouslySetInnerHTML={{ __html: "124.571 Kr" }} />}
            footer={<Field label={"(2020-08-01 - 2020-08-31)"} />}
            contentHeight={35}
          >
            <span>
              <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                +11%
          </Trend>
            </span>
          </ChartCard>
          <ChartCard
            title="July"
            total={() => <span dangerouslySetInnerHTML={{ __html: "101.401 Kr" }} />}
            footer={<Field label={"(2020-07-01 - 2020-07-30)"} />}
            contentHeight={35}
          >
            <span>
              <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
                +5%
          </Trend>
            </span>
          </ChartCard>

        </Col>
        <span style={{ margin: "0px 0px 10px 15px", color: "rgba(0, 0, 0, 0.85)", fontSize: "30px"}}>Low stock</span>
        <Table columns={tableColumns} dataSource={tableData} scroll={{ y: 300 }} />
      </Row>
    </div>
  )
}