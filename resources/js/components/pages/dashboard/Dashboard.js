import React from "react";
// import { PageHeader, Divider, Row, Col, Table, Tag } from 'antd';
// import { DotChartOutlined } from '@ant-design/icons';
// import Trend from 'ant-design-pro/lib/Trend';
// import { Bar, ChartCard, Field, Pie } from 'ant-design-pro/lib/Charts';
// import 'ant-design-pro/dist/ant-design-pro.css';
// import numeral from 'numeral';
// import moment from 'moment'

const Dashboard = () => {
    return (
        <div id="dashboard">
            <section className="performance-overview">
                <div>
                    <h3 className="text-capitalize mb-5">
                        performance overview
                    </h3>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="shadow-sm py-3 px-4 performance-card rounded ">
                            <div className="col-8 d-flex flex-column align-items-start justify-content-between">
                                <p className="m-0 text-normal text-uppercase text-light">
                                    total sales
                                </p>
                                <p className="m-0 text-larger fw-bold text-dark my-2">
                                    90,755{" "}
                                    <span className="text-small fw-normal text-light">
                                        DKK
                                    </span>
                                </p>
                                <p
                                    className="m-0 text-normal"
                                    style={{ color: "#16C538" }}
                                >
                                    15%
                                </p>
                            </div>
                        </div>
                        <div className="shadow-sm py-3 px-4 performance-card rounded ">
                            <div className="col-8 d-flex flex-column align-items-start justify-content-between">
                                <p className="m-0 text-normal text-uppercase text-light">
                                    total orders
                                </p>
                                <p className="m-0 text-larger fw-bold text-dark my-2">
                                    345
                                </p>
                                <p
                                    className="m-0 text-normal"
                                    style={{ color: "#16C538" }}
                                >
                                    34%
                                </p>
                            </div>
                        </div>
                        <div className="shadow-sm py-3 px-4 performance-card rounded ">
                            <div className="col-8 d-flex flex-column align-items-start justify-content-between">
                                <p className="m-0 text-normal text-uppercase text-light">
                                    farmer rating
                                </p>
                                <p className="m-0 text-larger fw-bold text-dark my-2">
                                    4.34
                                </p>
                                <p
                                    className="m-0 text-normal"
                                    style={{ color: "#16C538" }}
                                >
                                    23 votes
                                </p>
                            </div>
                        </div>
                        <div className="shadow-sm py-3 px-4 performance-card rounded ">
                            <div className="col-8 d-flex flex-column align-items-start justify-content-between">
                                <p className="m-0 text-normal text-uppercase text-light">
                                    order conversion
                                </p>
                                <p className="m-0 text-larger fw-bold text-dark my-2">
                                    93%
                                </p>
                                <p
                                    className="m-0 text-normal"
                                    style={{ color: "#16C538" }}
                                >
                                    2%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;

// let generateSalesData = () => {
//   const salesData = [
//     {
//       x: "2012-01",
//       y: 32,
//     },

//     {
//       x: "2012-02",
//       y: 61,
//     },
//     {
//       x: "2012-03",
//       y: 103,
//     },
//     {
//       x: "2012-04",
//       y: 151
//     },
//     {
//       x: "2012-05",
//       y: 178
//     },
//     {
//       x: "2012-06",
//       y: 143
//     },
//     {
//       x: "2012-07",
//       y: 121
//     },
//     {
//       x: "2012-08",
//       y: 145,
//     }
//   ];
//   return salesData
// }

// const salesPieData = [
// 	{
// 		x: 'Vegetables',
// 		y: 32,
// 	},
// 	{
// 		x: 'Fruits',
// 		y: 48,
// 	},
// 	{
// 		x: 'Diary',
// 		y: 20
// 	}
// ]

// const tableColumns = [
//   {
//     title: '',
//     width: 100,
//     dataIndex: 'picture',
//     key: 'picture',
//     fixed: 'left',
//     render: link => <img style={{ height: "80px", padding: "2px" }} src={link} />
//   },
//   {
//     title: 'Title',
//     width: 100,
//     dataIndex: 'title',
//     key: 'title',
//     fixed: 'left',
//   },
//   {
//     title: 'Categry',
//     dataIndex: 'category',
//     key: 'categry',
//     width: 150,
//   },
//   {
//     title: 'In Stock',
//     dataIndex: 'inStock',
//     key: 'quantityInStock',
//     width: 150,
//   },
//   {
//     title: '',
//     dataIndex: 'identifier',
//     key: 'identifier',
//     width: 150,
//     render: text => (
//       <Tag style={{ margin: "4px" }} color={text == "Low" ? "error" : "warning"}>
//         {text}
//       </Tag>)
//   },
// ];

// const tableData = [
//   {
//     key: 1,
//     picture: "https://www.plantorama.dk/-/media/Images/Guide/Have/Haveplanter/Spiselige-baer-og-planter/Krydderurter/Dyrkning-af-basilikum/basilikum-spot-1.png?width=200&height=200&mode=crop&quality=70",
//     title: 'Basil',
//     category: 'Food > Vegetables > R',
//     inStock: " 58 x 150 g(pack)",
//     identifier: "Low"

//   },
//   {
//     key: 3,
//     picture: "https://www.myswanlake.com/wp-content/uploads/2016/08/Hot-House-Tomatoes-On-The-Vine-200x200.jpg",
//     title: 'Cherry tomatoes',
//     category: 'Food > Vegetables > Tomatoes',
//     inStock: "248 kg",
//     identifier: "Low"

//   },
//   {
//     key: 4,
//     picture: "https://5.imimg.com/data5/IQ/NS/MY-11305339/whole-uncooked-raw-chicken-500x500.jpg",
//     title: 'Broiler',
//     category: 'Food > Poultry > Broiler',
//     inStock: " 28 x 1,5kg(pack)",
//     identifier: "Low"

//   },
//   {
//     key: 2,
//     picture: "https://gardenseedsmarket.com/images/thumbnails/320/320/detailed/61/rabarbar-victoria.jpg",
//     title: 'Summer Rhubarb',
//     category: 'Food > Vegetables > Rhubarbar',
//     inStock: "142 x 15 pcs(pack)",
//     identifier: "Medium"

//   },
// ];

// export default function DashBoardPage() {
//   return (
//     <div>
//       <PageHeader
//         className="site-page-header"
//         title="DashBoard"
//         avatar={{ icon: (<DotChartOutlined />) }}
//       />
//       <Divider className="site-devider after-header"></Divider>
//       <Row style={{}}>
//         <Col md={12}>
//         <Table columns={tableColumns} dataSource={tableData} scroll={{ y: 300 }} />
//         </Col>
//         <Col md={12}>
//           <ChartCard
//             title="Revenue"
//             total={() => <span dangerouslySetInnerHTML={{ __html: "87.512 Kr" }} />}
//             footer={<Field label={`(2020-09-01 - ${moment(Date.now()).format('YYYY-MM-DD')})`} />}
//             contentHeight={35}
//             avatar={
//               <img
//                 style={{ width: 56, height: 56 }}
//                 src="https://www.iconfinder.com/data/icons/personal-business-finance-set-2-1/64/b-75-512.png"
//                 alt="indicator"
//               />
//             }
//           >
//             <span>
//               <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
//                 -36%
//           </Trend>
//             </span>
//           </ChartCard>

//           <ChartCard
//             title="August"
//             total={() => <span dangerouslySetInnerHTML={{ __html: "124.571 Kr" }} />}
//             footer={<Field label={"(2020-08-01 - 2020-08-31)"} />}
//             contentHeight={35}
//           >
//             <span>
//               <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
//                 +25%
//           </Trend>
//             </span>
//           </ChartCard>
//           <ChartCard
//             title="July"
//             total={() => <span dangerouslySetInnerHTML={{ __html: "101.401 Kr" }} />}
//             footer={<Field label={"(2020-07-01 - 2020-07-30)"} />}
//             contentHeight={35}
//           >
//             <span>
//               <Trend flag="up" style={{ marginLeft: 8, color: 'rgba(0,0,0,.85)' }}>
//                 +5%
//           </Trend>
//             </span>
//           </ChartCard>

//         </Col>
//         <Col md={12}>
//         <ChartCard
//           title="Category Sales"
//           total={""}
//           contentHeight={300}
//         >
// 	   <Pie
// 	      hasLegend
// 	      title="Category orders"
// 	      subTitle=""
// 	      total={""}
// 	      data={salesPieData}
// 	      valueFormat={val => ""}
// 	      height={294}
// 	    />
// 	  </ChartCard>
// 	</Col>

//         <Col md={12}>
//           <ChartCard
//             title="Sales orders"
//             total={"Total: 934"}
//             contentHeight={300}
//           >
//             <Bar height={250} data={generateSalesData()} />,
//           </ChartCard>
// 	  </Col>
//       </Row>
//     </div>
//   )
// }
