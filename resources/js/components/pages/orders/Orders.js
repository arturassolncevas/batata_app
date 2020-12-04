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
import Man2 from "../../../../images/Man2.jpg";
import Woman1 from "../../../../images/woman1.jpg";
import Woman2 from "../../../../images/woman2.jpg";

export default function OrdersPage() {
    const menu = (
        <Menu>
            <Menu.Item className="dark">View Order</Menu.Item>
            <Menu.Item>Cancel Order</Menu.Item>
        </Menu>
    );

    const sorter = (
        <Menu>
            <Menu.Item>Price</Menu.Item>
            <Menu.Item>Delivery Date</Menu.Item>
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
                        <span className="buyer-id">
                            ID: <span>{`${buyer.id}`}</span>
                        </span>
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
            width: "35%",
            key: "product",
            render: products => {
                if (Array.isArray(products) === true) {
                    let { title, quantity, measure, price } = products[0];
                    // let others = `+ ${products.length - 1} others`;
                    let desc = <span>{`${quantity} of ${measure}`}</span>;
                    let header = (
                        <div className="collapsible-header">
                            <div className="product-info">
                                <span className="product-name">{title} </span>
                                <br />
                                <span className="product-desc">{desc}</span>
                            </div>
                            <span className="product-amount">
                                DKK
                                <span>{price.split("DKK ")[1]}</span>
                            </span>
                        </div>
                    );
                    let totalAmount = 0;
                    let hidden = products
                        .map((product, idx) => {
                            let { title, quantity, measure, price } = product;
                            totalAmount += parseFloat(price.split("DKK ")[1]);
                            return (
                                <div key={idx} className="product-cell">
                                    <div className="product-info">
                                        <span className="product-name">
                                            {title}
                                        </span>{" "}
                                        <br />
                                        <span className="product-desc">{`${quantity} of ${measure}`}</span>
                                    </div>

                                    <span className="product-amount">
                                        DKK
                                        <span>{price.split("DKK ")[1]}</span>
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
                                <Divider />
                                <p className="total-amount">
                                    Total :
                                    <span>
                                        DKK
                                        <span>{`${parseFloat(
                                            totalAmount.toFixed(2)
                                        )}`}</span>
                                    </span>
                                </p>
                            </Panel>
                        </Collapse>
                    );
                } else {
                    let { title, quantity, measure, price } = products;
                    let others = <span>{`${quantity} of ${measure}`}</span>;
                    return (
                        <div className="product-cell">
                            <div className="product-info">
                                <span className="product-name">{title} </span>
                                <br />
                                <span className="product-desc">{others}</span>
                            </div>

                            <span className="product-amount">
                                DKK
                                <span>{price.split("DKK ")[1]}</span>
                            </span>
                        </div>
                    );
                }
            }
        },

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
                    case "pending":
                        color = "#f4d167";
                        break;
                    case "payment received":
                        color = "#82cbf4";
                        break;
                    case "delivered":
                        color = "#84e296";
                        break;
                    case "cancelled":
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
                <Dropdown overlay={menu} overlayClassName="action-dropdown">
                    <span
                        className="ant-dropdown-link"
                        style={{ fontSize: "2rem", fontWeight: "700" }}
                    >
                        ...
                    </span>
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
                    price: "DKK 15.60"
                },
                {
                    quantity: 40,
                    title: "red apples",
                    measure: "1kg",
                    price: "DKK 35.89"
                },
                {
                    quantity: 25,
                    title: "Rhubarb",
                    measure: "15pcs (pack)",
                    price: "DKK 10.00"
                }
            ],
            delivery: {
                date: "20/10/2020",
                type: "pick up"
            },
            status: "delivered",
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
                    price: "DKK 35.50"
                },
                {
                    quantity: 25,
                    title: "Rhubarb",
                    measure: "15pcs (pack)",
                    price: "DKK 10.99"
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
            delivery: {
                date: "Due in 3 days",
                type: "pick up"
            },
            status: "payment received",
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
            status: "pending",
            image: <Avatar src={Woman2} shape="circle" />
        },
        {
            key: 4,
            buyer: {
                name: "Leslie Alexander",
                id: "42322"
            },
            product: [
                {
                    quantity: 40,
                    title: "mutton",
                    measure: "1kg",
                    price: "DKK 102.50"
                },
                {
                    quantity: 25,
                    title: "pork",
                    measure: "1kg",
                    price: "DKK 99.99"
                },
                {
                    quantity: 25,
                    title: "beef",
                    measure: "1kg",
                    price: "DKK 59.99"
                }
            ],
            delivery: {
                date: "Due tomorrow",
                type: "pick up"
            },
            status: "cancelled",
            image: <Avatar src={Man2} shape="circle" />
        }
    ];

    return (
        <div id="order-table">
            <div className="site-page-header">
                <p className="table-header">Orders</p>
                <Dropdown
                    overlay={sorter}
                    trigger={["click"]}
                    placement="topLeft"
                    overlayClassName="sorter-dropdown"
                >
                    <span className="ant-dropdown-link">
                        <svg
                            width="10"
                            height="11"
                            viewBox="0 0 10 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3.25 1.45H10M3.25 4.15H7.3M3.25 6.85H10M3.25 9.55H7.3M1 1H1.9V1.9H1V1ZM1 3.7H1.9V4.6H1V3.7ZM1 6.4H1.9V7.3H1V6.4ZM1 9.1H1.9V10H1V9.1Z"
                                stroke="#666666"
                            />
                        </svg>
                        Sort by
                    </span>
                </Dropdown>
            </div>
            <Row>
                <Col md={24}>
                    <Table columns={columns} dataSource={data} />
                </Col>
            </Row>
        </div>
    );
}
