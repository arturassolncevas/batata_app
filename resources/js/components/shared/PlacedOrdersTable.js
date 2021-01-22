import React from "react";
import { Table, Space, Avatar, Row, Collapse, Menu, Dropdown, Tag } from "antd";
import { FileImageOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";

const PlacedOrdersTable = ({ data, pagination, intl }) => {
    const { Column } = Table;

    const { Panel } = Collapse;

    const menu = (
        <Menu>
            <Menu.Item className="dark">View Order</Menu.Item>
            <Menu.Item>Cancel Order</Menu.Item>
        </Menu>
    );

    let setFrontImageThumbnailUrl = item => {
        item = item || { files: [] };
        return (item.files.find(e => e.type === "thumbnail") || {}).url;
    };

    let formatPrice = (lineItem, intl) => {
        let productFormatter = new ProductFormatter();
        productFormatter.setOptions({
            measurementUnitAlias: lineItem.measurement_unit.alias,
            packed: lineItem.packed,
            intl
        });
        return productFormatter.formattedPrice({
            price: currencyHelper.value(lineItem.price).format(),
            quantity: lineItem.product_quantity
        });
    };

    return (
        <Table
            className="extended-table"
            dataSource={data}
            pagination={pagination ? pagination : false}
        >
            <Column
                title="Buyer"
                dataIndex="customer"
                key="buyer"
                render={customer => (
                    <div className="company-details">
                        <Space align="start">
                            <Avatar size={40} icon={<UserOutlined />} />
                            <span>
                                <span className="company-name">
                                    company name
                                </span>
                                <br />
                                <span className="company-id">
                                    ID:{" "}
                                    {/* <span>{`${customer.company_id}`}</span> */}
                                    <span>12345</span>
                                </span>
                            </span>
                        </Space>
                    </div>
                )}
            />
            <Column
                title="Products"
                dataIndex="line_items"
                key="line_items"
                width="25%"
                render={(objects = []) => {
                    if (objects.length === 1) {
                        return objects.map(obj => (
                            <Row key={obj.id}>
                                <div className="product-wrapper">
                                    <div className="product-image">
                                        {obj.product ? (
                                            <img
                                                src={setFrontImageThumbnailUrl(
                                                    obj.product
                                                )}
                                            />
                                        ) : (
                                            <Avatar className="image-placeholder">
                                                <FileImageOutlined />
                                            </Avatar>
                                        )}
                                    </div>

                                    <div className="product-details">
                                        <span className="product-name">
                                            {obj.name}
                                        </span>
                                        <span className="product-desc">
                                            {`${formatPrice(obj, intl)}`} &nbsp;
                                            x &nbsp; {`${obj.quantity}`}
                                        </span>
                                    </div>
                                </div>
                            </Row>
                        ));
                    } else {
                        let { product, quantity, name } = objects[0];

                        let header = (
                            <div className="product-wrapper">
                                <div className="product-image">
                                    {product ? (
                                        <img
                                            src={setFrontImageThumbnailUrl(
                                                product
                                            )}
                                        />
                                    ) : (
                                        <Avatar className="image-placeholder">
                                            <FileImageOutlined />
                                        </Avatar>
                                    )}
                                </div>

                                <div className="product-details">
                                    <span className="product-name">{name}</span>
                                    <span className="product-desc">
                                        {`${formatPrice(objects[0], intl)}`}{" "}
                                        &nbsp; x &nbsp; {`${quantity}`}
                                    </span>
                                </div>
                            </div>
                        );
                        let hidden = objects
                            .map((obj, index) => (
                                <Row key={obj.id}>
                                    <div className="product-wrapper">
                                        <div className="product-image">
                                            {obj.product ? (
                                                <img
                                                    src={setFrontImageThumbnailUrl(
                                                        obj.product
                                                    )}
                                                />
                                            ) : (
                                                <Avatar className="image-placeholder">
                                                    <FileImageOutlined />
                                                </Avatar>
                                            )}
                                        </div>

                                        <div className="product-details">
                                            <span className="product-name">
                                                {obj.name}
                                            </span>
                                            <span className="product-desc">
                                                {`${formatPrice(obj, intl)}`}{" "}
                                                &nbsp; x &nbsp;{" "}
                                                {`${obj.quantity}`}
                                            </span>
                                        </div>
                                    </div>
                                </Row>
                            ))
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
                    }
                }}
            />
            <Column
                title="Amount"
                dataIndex="total"
                key="total"
                render={object => currencyHelper.value(object).format()}
            />
            {/* <Column title="ID" dataIndex="id" key="id" /> */}
            <Column
                title="Time"
                dataIndex="created_at"
                key="created_at"
                render={dateTime => {
                    return moment
                        .utc(dateTime)
                        .local()
                        .format("MM-DD-YYYY hh:mm");
                }}
            />
            <Column
                title="Status"
                dataIndex="status"
                key="status"
                render={status => {
                    let color = "";
                    switch (status) {
                        case "pending":
                            color = "#f4d167";
                            break;
                        case "processing":
                            color = "#82cbf4";
                            break;
                        case "completed":
                            color = "84e296";
                            break;
                        case "cancelled":
                            color = "grey";
                            break;
                        case "failed":
                            color = "#f08989";
                        default:
                            color = "grey";
                    }
                    return (
                        <Tag className="status" color={color}>
                            {status}
                        </Tag>
                    );
                }}
            />
            <Column
                title="Action"
                key="action"
                render={() => (
                    <Dropdown overlay={menu} overlayClassName="action-dropdown">
                        <span
                            className="ant-dropdown-link"
                            style={{
                                fontSize: "2rem",
                                fontWeight: "700"
                            }}
                        >
                            ...
                        </span>
                    </Dropdown>
                )}
            />
        </Table>
    );
};

export default withRouter(injectIntl(PlacedOrdersTable));
