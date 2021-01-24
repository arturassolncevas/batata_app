import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Select } from "antd";
import PlacedOrdersTable from "../../shared/PlacedOrdersTable";
import { ProductChart, LineChart } from "./Charts";
import AuthorImg from "../../../../images/man1.jpg";
import NewsCard from "./NewsCard";
// import { PageHeader, Divider, Row, Col, Table, Tag } from 'antd';
// import { DotChartOutlined } from '@ant-design/icons';
// import Trend from 'ant-design-pro/lib/Trend';
// import { Bar, ChartCard, Field, Pie } from 'ant-design-pro/lib/Charts';
// import 'ant-design-pro/dist/ant-design-pro.css';
// import numeral from 'numeral';
// import moment from 'moment'

const newsAndUpdates = [];
for (var i = 0; i < 4; i++) {
    newsAndUpdates.push({
        tag: "blog",
        topic: "Hacking productivity and Increasing Sales Revenue",
        authorName: "Ezra Samuels",
        jobDesc: "agro investor",
        authorImg: AuthorImg,
        time: "2 hours ago"
    });
}

const Dashboard = () => {
    const [recentOrders, setRecentOrders] = useState(null);
    const [lineChartData, setLineChartData] = useState([
        11239,
        16087,
        14375,
        22439,
        8848,
        23471,
        15036,
        25000,
        15417,
        9838,
        11239,
        13728
    ]);

    const history = useHistory();

    const fetchRecentOrders = () => {
        const pagination = { total: 5, page: 1, size: 20 };
        const sort = { sort_by: "date", direction: "desc" };

        return requestClient
            .post(`/api/placed_orders/filter`, {
                data: {
                    sort,
                    page: pagination.page
                }
            })
            .then(async response => {
                let data = response.data;
                data.data.forEach(item => (item.key = item.id));

                window.localStorage.setItem(
                    "recentOrders",
                    JSON.stringify(data)
                );

                setRecentOrders(
                    JSON.parse(window.localStorage.getItem("recentOrders")) ||
                        {}
                );
            })
            .catch(error => {
                console.log(error);
            });
    };

    const displayNewsAndUpdates = newsAndUpdates.map((item, idx) => {
        const { tag, topic, authorName, jobDesc, authorImg, time } = item;

        return (
            <NewsCard
                key={idx}
                tag={tag}
                topic={topic}
                authorName={authorName}
                jobDesc={jobDesc}
                authorImg={authorImg}
                time={time}
            />
        );
    });

    const recentActivity = [
        // {
        //     date: "14 Dec, 2020",
        //     time: "04:56 pm",
        //     desc: {
        //         activity: "new order created (pending payment)",
        //         addedInfo: "ID: 4556"
        //     }
        // },
        // {
        //     date: "15 Dec, 2020",
        //     time: "04:56 pm",
        //     desc: {
        //         activity: "product added to marketplace",
        //         addedInfo: "carrot: 2300 units"
        //     }
        // }
    ];

    const sumOfLineChartData = lineChartData.reduce((a, b) => a + b, 0);

    const { Option } = Select;

    const ShowActivites =
        recentActivity.length === 0 ? (
            <p
                className="mx-3 py-5 w-100 text-caption text-grey text-center"
                style={{ backgroundColor: "#fafbfc" }}
            >
                no activity
            </p>
        ) : (
            recentActivity.map((item, idx) => {
                let { date, time, desc } = item;

                return (
                    <div
                        key={idx}
                        className="row align-items-baseline activity-card"
                    >
                        <div className="col-3">
                            <span className="d-flex flex-column align-items-start text-end justify-content-center">
                                <time
                                    dateTime="2020-12-14"
                                    className="text-caption-small text-dark mb-2"
                                >
                                    {date}
                                </time>
                                <time
                                    dateTime="16:56"
                                    className="text-caption-small text-grey"
                                >
                                    {time}
                                </time>
                            </span>
                        </div>
                        <div className="col-8">
                            <span className="d-flex flex-column align-items-start justify-content-center">
                                <h6 className="text-normal text-dark mb-2">
                                    {desc.activity}
                                </h6>
                                <p className="m-0 text-caption-small text-grey">
                                    {desc.addedInfo}
                                </p>
                            </span>
                        </div>
                    </div>
                );
            })
        );

    useState(fetchRecentOrders, []);

    return (
        <div id="dashboard">
            <section className="performance-overview my-5">
                <div>
                    <h3 className="text-capitalize mb-5">
                        performance overview
                    </h3>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="row align-items-center shadow-sm py-3 px-4 performance-card rounded">
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
                            <div className="col-4 h-100 d-flex align-items-center">
                                <svg
                                    width="64"
                                    height="64"
                                    viewBox="0 0 64 64"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="32"
                                        fill="#DAE8F5"
                                    />
                                    <g opacity="0.8">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M23.3893 19H17V21.6667H21.2907L24.984 38.5707H25V39H42.3333V38.6693L45.2573 25.788L45.708 24.3333H24.54L23.78 20.852L23.3893 19ZM42.316 27H25.1227L27.1613 36.3333H40.1973L42.316 27Z"
                                            fill="#001427"
                                        />
                                        <path
                                            d="M28.9999 45.6667C29.7072 45.6667 30.3854 45.3857 30.8855 44.8856C31.3856 44.3855 31.6666 43.7073 31.6666 43C31.6666 42.2928 31.3856 41.6145 30.8855 41.1144C30.3854 40.6143 29.7072 40.3333 28.9999 40.3333C28.2927 40.3333 27.6144 40.6143 27.1143 41.1144C26.6142 41.6145 26.3333 42.2928 26.3333 43C26.3333 43.7073 26.6142 44.3855 27.1143 44.8856C27.6144 45.3857 28.2927 45.6667 28.9999 45.6667Z"
                                            fill="#001427"
                                        />
                                        <path
                                            d="M41.0001 43C41.0001 43.7073 40.7191 44.3855 40.219 44.8856C39.7189 45.3857 39.0407 45.6667 38.3334 45.6667C37.6262 45.6667 36.9479 45.3857 36.4478 44.8856C35.9477 44.3855 35.6667 43.7073 35.6667 43C35.6667 42.2928 35.9477 41.6145 36.4478 41.1144C36.9479 40.6143 37.6262 40.3333 38.3334 40.3333C39.0407 40.3333 39.7189 40.6143 40.219 41.1144C40.7191 41.6145 41.0001 42.2928 41.0001 43Z"
                                            fill="#001427"
                                        />
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div className="row align-items-center shadow-sm py-3 px-4 performance-card rounded ">
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
                            <div className="col-4 h-100 d-flex align-items-center">
                                <svg
                                    width="64"
                                    height="64"
                                    viewBox="0 0 64 64"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="32"
                                        fill="#DAE8F5"
                                    />
                                    <path
                                        opacity="0.8"
                                        d="M43.04 22.16H38V20.24C38 20.108 37.892 20 37.76 20H36.08C35.948 20 35.84 20.108 35.84 20.24V22.16H28.16V20.24C28.16 20.108 28.052 20 27.92 20H26.24C26.108 20 26 20.108 26 20.24V22.16H20.96C20.429 22.16 20 22.589 20 23.12V43.04C20 43.571 20.429 44 20.96 44H43.04C43.571 44 44 43.571 44 43.04V23.12C44 22.589 43.571 22.16 43.04 22.16ZM41.84 41.84H22.16V30.44H41.84V41.84ZM22.16 28.4V24.32H26V25.76C26 25.892 26.108 26 26.24 26H27.92C28.052 26 28.16 25.892 28.16 25.76V24.32H35.84V25.76C35.84 25.892 35.948 26 36.08 26H37.76C37.892 26 38 25.892 38 25.76V24.32H41.84V28.4H22.16Z"
                                        fill="#001427"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="row align-items-center shadow-sm py-3 px-4 performance-card rounded ">
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
                            <div className="col-4 h-100 d-flex align-items-center">
                                <svg
                                    width="65"
                                    height="64"
                                    viewBox="0 0 65 64"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <ellipse
                                        cx="32.8175"
                                        cy="32"
                                        rx="32.1217"
                                        ry="32"
                                        fill="#DAE8F5"
                                    />
                                    <path
                                        opacity="0.8"
                                        d="M33 20L35.6942 28.2918H44.4127L37.3593 33.4164L40.0534 41.7082L33 36.5836L25.9466 41.7082L28.6407 33.4164L21.5873 28.2918H30.3058L33 20Z"
                                        stroke="#001427"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="row align-items-center shadow-sm py-3 px-4 performance-card rounded ">
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
                            <div className="col-4 h-100 d-flex align-items-center">
                                <svg
                                    width="65"
                                    height="64"
                                    viewBox="0 0 65 64"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <ellipse
                                        cx="32.8175"
                                        cy="32"
                                        rx="32.1217"
                                        ry="32"
                                        fill="#DAE8F5"
                                    />
                                    <path
                                        opacity="0.8"
                                        d="M46.884 23.9296C46.7369 23.5632 46.4555 23.2721 46.1013 23.1199C45.927 23.0431 45.7398 23.0024 45.5504 23H38.3025C37.9181 23 37.5494 23.158 37.2775 23.4391C37.0057 23.7203 36.8529 24.1016 36.8529 24.4993C36.8529 24.8969 37.0057 25.2783 37.2775 25.5594C37.5494 25.8406 37.9181 25.9986 38.3025 25.9986H42.0569L33.9538 34.3795L29.1847 29.4319C29.0499 29.2914 28.8896 29.1798 28.7129 29.1037C28.5363 29.0276 28.3468 28.9884 28.1555 28.9884C27.9641 28.9884 27.7746 29.0276 27.598 29.1037C27.4213 29.1798 27.261 29.2914 27.1263 29.4319L18.4288 38.4275C18.2929 38.5669 18.1851 38.7327 18.1115 38.9154C18.0379 39.0981 18 39.2941 18 39.492C18 39.69 18.0379 39.8859 18.1115 40.0686C18.1851 40.2513 18.2929 40.4171 18.4288 40.5565C18.5635 40.697 18.7239 40.8086 18.9005 40.8847C19.0772 40.9608 19.2666 41 19.458 41C19.6493 41 19.8388 40.9608 20.0155 40.8847C20.1921 40.8086 20.3524 40.697 20.4872 40.5565L28.1555 32.6104L32.9246 37.558C33.0593 37.6985 33.2197 37.81 33.3963 37.8861C33.573 37.9623 33.7624 38.0014 33.9538 38.0014C34.1451 38.0014 34.3346 37.9623 34.5113 37.8861C34.6879 37.81 34.8482 37.6985 34.983 37.558L44.1008 28.1125V31.9957C44.1008 32.3933 44.2536 32.7746 44.5254 33.0558C44.7973 33.337 45.166 33.4949 45.5504 33.4949C45.9349 33.4949 46.3036 33.337 46.5754 33.0558C46.8473 32.7746 47 32.3933 47 31.9957V24.4993C46.9977 24.3034 46.9583 24.1098 46.884 23.9296Z"
                                        fill="#001427"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="analytics my-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h3 className="text-capitalize text-large text-black m-0">
                        analytics
                    </h3>

                    <button className="btn btn-dark text-capitalize">
                        view analytics
                    </button>
                </div>

                <div className="chart-wrapper bg-white shadow-sm rounded p-5">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="action-btn">
                            <button className="btn btn-link text-normal text-dark">
                                Sales
                            </button>
                            <button className="btn btn-link text-normal text-dark">
                                Orders
                            </button>
                        </div>
                        <div className="filter">
                            <Select
                                defaultValue="Monthly"
                                style={{ width: 120 }}
                                onChange={value =>
                                    console.log(`selected ${value}`)
                                }
                            >
                                <Option value="Monthly">Monthly</Option>
                                <Option value="Quarterly">Quartely</Option>

                                <Option value="Yearly">Yearly</Option>
                            </Select>
                        </div>
                    </div>
                    <div className="chart-info my-5 py-4">
                        <p className="m-0 text-normal text-uppercase text-light">
                            total sales
                        </p>
                        <p className="m-0 text-larger fw-bold text-dark my-2">
                            {sumOfLineChartData}{" "}
                            <span className="text-normal fw-normal text-light">
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
                    <LineChart data={lineChartData} />
                </div>
            </section>

            <section className="recent-orders my-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h3 className="text-capitalize text-large text-black m-0">
                        recent orders
                    </h3>

                    <button
                        className="btn btn-dark text-capitalize"
                        onClick={() => history.push("/placed_orders")}
                    >
                        view all orders
                    </button>
                </div>

                {recentOrders && (
                    <PlacedOrdersTable
                        data={recentOrders.data}
                        pagination={false}
                    />
                )}
            </section>

            <section className="product-summary my-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h3 className="text-capitalize text-large text-black m-0">
                        product summary
                    </h3>

                    <button
                        className="btn btn-dark text-capitalize"
                        onClick={() => history.push("/products")}
                    >
                        view products
                    </button>
                </div>

                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div className="shadow-sm chart-card py-4 px-4">
                        <h3 className="text-capitalize mb-4">green apples</h3>
                        <ProductChart data={[4284, 1235, 123]} />
                    </div>
                    <div className="shadow-sm chart-card py-4 px-4">
                        <h3 className="text-capitalize mb-4">cucumber</h3>
                        <ProductChart data={[4284, 1235, 123]} />
                    </div>
                    <div className="shadow-sm chart-card py-4 px-4">
                        <h3 className="text-capitalize mb-4">brown eggs</h3>
                        <ProductChart data={[4284, 1235, 123]} />
                    </div>
                    <div className="shadow-sm chart-card py-4 px-4">
                        <h3 className="text-capitalize mb-4">soya bean</h3>
                        <ProductChart data={[4284, 1235, 123]} />
                    </div>
                    <div className="shadow-sm chart-card py-4 px-4">
                        <h3 className="text-capitalize mb-4">salat</h3>
                        <ProductChart data={[4284, 1235, 123]} />
                    </div>
                    <div className="shadow-sm chart-card py-4 px-4">
                        <h3 className="text-capitalize mb-4">avocado</h3>
                        <ProductChart data={[4284, 1235, 123]} />
                    </div>
                </div>
            </section>

            <section className="my-5 info-section">
                <div className="row">
                    <div className="col">
                        <h3 className="text-dark text-large text-capitalize mb-5">
                            account activity
                        </h3>

                        <div className="activity bg-white shadow-sm p-5 overflow-auto same-height">
                            {ShowActivites}
                        </div>
                    </div>
                    <div className="col">
                        <h3 className="text-dark text-large text-capitalize mb-5">
                            news, updates and blog
                        </h3>
                        <div className="bg-white shadow-sm p-4 overflow-auto same-height">
                            {displayNewsAndUpdates}
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
