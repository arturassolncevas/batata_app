import React, { Component } from "react";
import PlacedOrdersTable from "../../shared/PlacedOrdersTable";
import OverviewTable from "./OverviewTable";
import { PageHeader, Divider, Button, Row, Col, Select } from "antd";
import {
    DropboxOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";
import qs from "qs";

const { Option } = Select;

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

                        <PlacedOrdersTable
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
                            formatPrice={formatPrice}
                            intl={this.props.intl}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withRouter(injectIntl(PlacedOrdersPage));
