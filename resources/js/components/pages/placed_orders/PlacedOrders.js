import React, { Component } from "react";
import OverviewTable from "./OverviewTable";
import {
    PageHeader,
    Divider,
    Button,
    Row,
    Col,
    Table,
    Avatar,
    Select,
    Tag,
    Space,
    Menu,
    Dropdown,
    Collapse
} from "antd";
import {
    DropboxOutlined,
    FileImageOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
    UserOutlined
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";
import moment from "moment";
import qs from "qs";

const { Column } = Table;
const { Option } = Select;

const { Panel } = Collapse;

let setFrontImageThumbnailUrl = item => {
    item = item || { files: [] };
    return (item.files.find(e => e.type === "thumbnail") || {}).url;
};

const menu = (
    <Menu>
        <Menu.Item className="dark">View Order</Menu.Item>
        <Menu.Item>Cancel Order</Menu.Item>
    </Menu>
);

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

let parseQueryString = str => {
    return qs.parse(str.replace(/(%3F|\?)/g, ""), {
        charset: "iso-8859-1",
        interpretNumericEntities: true
    });
};

class PlacedOrdersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            placed_orders: {
                data: [],
                pagination: { total: 10, page: 1, size: 20 },
                sort: { sort_by: "date", direction: "desc" }
            }
        };
    }

    componentDidMount() {
        this.setDataFromQuery(() => {
            this.fetchInitialData();
        });
    }

    async fetchInitialData() {
        await this.filterOrdersRequest(
            parseQueryString(this.props.history.location.search)
        );
        this.setState(this.state);
    }

    filterOrdersRequest(data) {
        if (this.props.history.location.pathname !== "/placed_orders") return;
        return requestClient
            .post(`/api/placed_orders/filter`, {
                data: {
                    ...data,
                    ...this.state.placed_orders.sort,
                    page: this.state.placed_orders.pagination.page
                }
            })
            .then(async response => {
                this.state.placed_orders = response.data;
                this.state.placed_orders.data.forEach(e => {
                    e.key = e.id;
                });
                this.setState(this.state);
                let queryData = parseQueryString(
                    this.props.history.location.search
                );
                queryData = {
                    ...queryData,
                    page: response.data.pagination.page,
                    ...this.state.placed_orders.sort
                };
                this.props.history.push(
                    `${this.props.history.location.pathname}?${qs.stringify(
                        queryData
                    )}`
                );
            })
            .catch(error => {
                console.log(error);
            });
    }

    setDataFromQuery(callback = () => {}) {
        let {
            page = 1,
            sort_by = "date",
            direction = "desc"
        } = parseQueryString(this.props.history.location.search);
        this.state.placed_orders.pagination.page = page;
        this.state.placed_orders.sort.sort_by = sort_by;
        this.state.placed_orders.sort.direction = direction;
        this.setState(this.state, callback);
    }

    handleOnSortDirectionClick() {
        if (this.state.placed_orders.sort.direction === "asc") {
            this.state.placed_orders.sort.direction = "desc";
        } else {
            this.state.placed_orders.sort.direction = "asc";
        }
        this.setState(this.state, () => {
            this.handlePaginationPageChange(1);
        });
    }

    handleOnSortChange(val) {
        this.state.placed_orders.sort.sort_by = val;
        this.setState(this.state, () => {
            this.handlePaginationPageChange(1);
        });
    }

    async handlePaginationPageChange(page) {
        this.state.placed_orders.pagination.page = page;
        this.setState(this.state, () => {
            this.filterByQueryStringData();
        });
    }

    filterByQueryStringData() {
        let queryData = qs.parse(
            this.props.history.location.search.replace(/(%3F|\?)/g, ""),
            { charset: "iso-8859-1", interpretNumericEntities: true }
        );
        this.filterOrdersRequest(queryData);
    }

    render() {
        return (
            <div id="placed-orders">
                <PageHeader
                    className="site-page-header"
                    title={this.props.intl.formatMessage({
                        id: "pages.placed_orders.header"
                    })}
                    avatar={{
                        icon: <DropboxOutlined className="header-icon" />
                    }}
                />
                <Divider className="site-devider after-header"></Divider>

                <Row justify="center">
                    <Col span={24}>
                        <div className="sorting-options">
                            <div>
                                <Select
                                    defaultActiveFirstOption={undefined}
                                    placeholder={this.props.intl.formatMessage({
                                        id: "sort.placeholder"
                                    })}
                                    value={
                                        this.state.placed_orders.sort.sort_by
                                    }
                                    onChange={val => {
                                        this.handleOnSortChange(val);
                                    }}
                                >
                                    <Option value={undefined}>
                                        {this.props.intl.formatMessage({
                                            id: "sort.placeholder"
                                        })}
                                    </Option>
                                    <Option value="date">
                                        {this.props.intl.formatMessage({
                                            id: "sort.date"
                                        })}
                                    </Option>
                                    <Option value="total">
                                        {this.props.intl.formatMessage({
                                            id: "sort.price"
                                        })}
                                    </Option>
                                </Select>
                                <Button
                                    type="default"
                                    icon={
                                        this.state.placed_orders.sort
                                            .direction == "asc" ? (
                                            <SortAscendingOutlined />
                                        ) : (
                                            <SortDescendingOutlined />
                                        )
                                    }
                                    onClick={() => {
                                        this.handleOnSortDirectionClick();
                                    }}
                                />
                            </div>
                        </div>
                        <Table
                            className="extended-table"
                            dataSource={this.state.placed_orders.data}
                            pagination={{
                                current: this.state.placed_orders.pagination
                                    .page,
                                pageSize: this.state.placed_orders.pagination
                                    .size,
                                total: this.state.placed_orders.pagination
                                    .total,
                                onChange: (page, pageSize) => {
                                    this.handlePaginationPageChange(
                                        page,
                                        pageSize
                                    );
                                }
                            }}
                        >
                            <Column
                                title="Buyer"
                                dataIndex="customer"
                                key="buyer"
                                render={customer => (
                                    <div className="company-details">
                                        <Space align="start">
                                            <Avatar
                                                size={40}
                                                icon={<UserOutlined />}
                                            />
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
                                                            {`${formatPrice(
                                                                obj,
                                                                this.props.intl
                                                            )}`}{" "}
                                                            &nbsp; x &nbsp;{" "}
                                                            {`${obj.quantity}`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Row>
                                        ));
                                    } else {
                                        let {
                                            product,
                                            quantity,
                                            name
                                        } = objects[0];

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
                                                    <span className="product-name">
                                                        {name}
                                                    </span>
                                                    <span className="product-desc">
                                                        {`${formatPrice(
                                                            objects[0],
                                                            this.props.intl
                                                        )}`}{" "}
                                                        &nbsp; x &nbsp;{" "}
                                                        {`${quantity}`}
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
                                                                {`${formatPrice(
                                                                    obj,
                                                                    this.props
                                                                        .intl
                                                                )}`}{" "}
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
                                render={object =>
                                    currencyHelper.value(object).format()
                                }
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
                                    <Dropdown
                                        overlay={menu}
                                        overlayClassName="action-dropdown"
                                    >
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

                        <OverviewTable
                            data={this.state.placed_orders.data}
                            pagination={{
                                current: this.state.placed_orders.pagination
                                    .page,
                                pageSize: this.state.placed_orders.pagination
                                    .size,
                                total: this.state.placed_orders.pagination
                                    .total,
                                onChange: (page, pageSize) => {
                                    this.handlePaginationPageChange(
                                        page,
                                        pageSize
                                    );
                                }
                            }}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(injectIntl(PlacedOrdersPage));
