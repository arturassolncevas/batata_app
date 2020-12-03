import React from "react";
import {
    PageHeader,
    Divider,
    Row,
    Table,
    Tag,
    Col,
    Avatar,
    Menu,
    Dropdown,
    Collapse
} from "antd";
import Man1 from "../../../../images/Man1.jpg";
import Woman1 from "../../../../images/woman1.jpg";
import Woman2 from "../../../../images/woman2.jpg";

export default function OrdersPage() {
    const menu = (
        <Menu>
            <Menu.Item className="dark">View Order</Menu.Item>
            <Menu.Item>Cancel Order</Menu.Item>
        </Menu>
    );

    const { Panel } = Collapse;

    const columns = [
        {
            title: "",
            dataIndex: "image",
            key: "image",
            width: "5%"
        },
        {
            title: "Buyer",
            dataIndex: "buyer",
            key: "name",
            render: buyer =>
                buyer && (
                    <>
                        <span className="buyer-name">{buyer.name}</span> <br />
                        <span className="buyer-id">{`ID: ${buyer.id}`}</span>
                    </>
                )
        },
        {
            title: (
                <div className="product-title">
                    <span className="product-info">Product</span>
                    <span className="product-amount">Amount</span>
                </div>
            ),
            dataIndex: "product",
            width: "30%",
            key: "product",
            render: products => {
                if (Array.isArray(products) === true) {
                    let { title, quantity, measure, price } = products[0];
                    // let others = `+ ${products.length - 1} others`;
                    let desc = <span>{`${quantity} of ${measure}`}</span>;
                    let header = (
                        <div className="collapsible-header">
                            <div className="product-info">
                                <span>{title} </span>
                                <br />
                                <span>{desc}</span>
                            </div>
                            <span className="product-amount">{price}</span>
                        </div>
                    );
                    let hidden = products
                        .map((product, idx) => {
                            let { title, quantity, measure, price } = product;

                            return (
                                <div key={idx} className="product-cell">
                                    <div className="product-info">
                                        <span>{title}</span> <br />
                                        <span>{`${quantity} of ${measure}`}</span>
                                    </div>

                                    <span className="product-amount">
                                        {price}
                                    </span>
                                </div>
                            );
                        })
                        .splice(1);

                    return (
                        <Collapse
                            id="product-collapsible"
                            expandIconPosition="right"
                            ghost
                        >
                            <Panel header={header} key="1">
                                {hidden}
                            </Panel>
                        </Collapse>
                    );
                } else {
                    let { title, quantity, measure, price } = products;
                    let others = <span>{`${quantity} of ${measure}`}</span>;
                    return (
                        <div className="product-cell">
                            <div className="product-info">
                                <span>{title} </span>
                                <br />
                                <span>{others}</span>
                            </div>

                            <span className="product-amount">{price}</span>
                        </div>
                    );
                }
            }
        },
        // {
        //     title: "Amount",
        //     dataIndex: "amount",
        //     key: "amount",
        //     render: amounts => {
        //         if (Array.isArray(amounts) === true) {
        //             let header = amounts[0];
        //             let hidden = amounts
        //                 .map((amount, idx) => (
        //                     <div key={idx}>
        //                         <span>{amount}</span> <br />
        //                     </div>
        //                 ))
        //                 .splice(1);

        //             return (
        //                 <Collapse
        //                     id="amount-collapsible"
        //                     expandIconPosition="right"
        //                     ghost
        //                 >
        //                     <Panel header={header} key="1">
        //                         {hidden}
        //                     </Panel>
        //                 </Collapse>
        //             );
        //         } else {
        //             return <span>{amounts}</span>;
        //         }
        //     }
        // },
        {
            title: "Delivery Date",
            dataIndex: "delivery",
            key: "delivery",
            render: delivery =>
                delivery && (
                    <>
                        <span className="delivery-date">{delivery.date} </span>{" "}
                        <br />
                        <span className="delivery-type">{delivery.type} </span>
                    </>
                )
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: status => {
                let color = "";
                switch (status) {
                    case "Pending":
                        color = "#f4d167";
                        break;
                    case "Payment received":
                        color = "#82cbf4";
                        break;
                    case "Delivered":
                        color = "#84e296";
                        break;
                    case "Cancelled":
                        color = "#f08989";
                        break;
                }
                return (
                    <Tag className="status" color={color}>
                        {status}
                    </Tag>
                );
            }
        },
        {
            title: "Action",
            dataIndex: "",
            key: "x",
            render: () => (
                <Dropdown overlay={menu}>
                    <span className="ant-dropdown-link">...</span>
                </Dropdown>
            )
        }
    ];

    const data = [
        {
            key: 1,
            buyer: {
                name: "John Brown sr.",
                id: "42552"
            },
            product: [
                {
                    quantity: 25,
                    title: "Tomatoes",
                    measure: "1kg",
                    price: "DKK 15.00"
                },
                {
                    quantity: 40,
                    title: "red apples",
                    measure: "1kg",
                    price: "DKK 35.00"
                },
                {
                    quantity: 25,
                    title: "Rhubarb",
                    measure: "15pcs (pack)",
                    price: "DKK 10.00"
                }
            ],
            amount: ["DKK 15.00", "DKK 35.00", "DKK 10.00"],
            delivery: {
                date: "20/10/2020",
                type: "pick up"
            },
            status: "Delivered",
            image: <Avatar src={Man1} shape="circle" />
        },
        {
            key: 2,
            buyer: {
                name: "John Brown sr.",
                id: "42552"
            },
            product: [
                {
                    quantity: 40,
                    title: "red apples",
                    measure: "1kg",
                    price: "DKK 35.00"
                },
                {
                    quantity: 25,
                    title: "Rhubarb",
                    measure: "15pcs (pack)",
                    price: "DKK 10.00"
                },
                {
                    quantity: 25,
                    title: "Tomatoes",
                    measure: "1kg",
                    price: "DKK 15.00"
                },
                {
                    quantity: 25,
                    title: "Rhubarb",
                    measure: "15pcs (pack)",
                    price: "DKK 10.00"
                }
            ],
            amount: ["DKK 15.00", "DKK 35.00", "DKK 10.00"],
            delivery: {
                date: "Due in 3 days",
                type: "pick up"
            },
            status: "Payment received",
            image: <Avatar src={Woman1} shape="circle" />
        },
        {
            key: 3,
            buyer: {
                name: "Dianne Russell",
                id: "33445"
            },
            product: {
                quantity: 5,
                title: "Pineapple",
                measure: "1kg",
                price: "DKK 15.00"
            },
            amount: "DKK 15.00",
            delivery: {
                date: "20/10/2020",
                type: "pick up"
            },
            status: "Pending",
            image: <Avatar src={Woman2} shape="circle" />
        }
    ];

    return (
        <div id="order-table">
            <PageHeader className="site-page-header" title="Orders" />
            <Row style={{}}>
                <Col md={24}>
                    <Table columns={columns} dataSource={data} />
                </Col>
            </Row>
        </div>
    );
}
