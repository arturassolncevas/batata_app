import React, { Component } from "react";
import {
    PageHeader,
    Divider,
    Button,
    Row,
    Col,
    Pagination,
    Select,
    Modal,
    InputNumber
} from "antd";
import {
    ShopOutlined,
    ExclamationCircleOutlined,
    DropboxOutlined,
    PlusOutlined,
    SortDescendingOutlined,
    SortAscendingOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import SellerProductRow from "../products/components/MarketProductRow";
import ProductFilter from "../../shared/products/ProductFilter";
import { modifyCategories } from "../products/helpers/helper";
import { withRouter } from "react-router-dom";
import { setCart } from "../../redux/actions/cartActions";
import { connect } from "react-redux";

import { injectIntl } from "react-intl";
import qs from "qs";
const { Option } = Select;
const { confirm } = Modal;

let parseQueryString = str => {
    return qs.parse(str.replace(/(%3F|\?)/g, ""), {
        charset: "iso-8859-1",
        interpretNumericEntities: true
    });
};

let formatPrice = (item, intl) => {
    let productFormatter = new ProductFormatter();
    productFormatter.setOptions({
        measurementUnitAlias: item.measurement_unit.alias,
        packed: item.packed,
        intl
    });
    return productFormatter.formattedPrice({
        price: currencyHelper.value(item.price).format(),
        quantity: item.quantity
    });
};

let setFrontImageThumbnailUrl = item => {
    return (item.files.find(e => e.type === "thumbnail") || {}).url;
};

class MarketPlacePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            products: {
                data: [],
                pagination: { total: 10, page: 1, size: 20 },
                sort: { sort_by: "price", direction: "asc" }
            },
            addToCartProduct: { product: { category: {} }, quantity: 1 },
            errors: {}
        };
    }

    componentDidMount() {
        this.setDataFromQuery(() => {
            this.fetchInitialData();
        });
    }

    setDataFromQuery(callback = () => {}) {
        let {
            page = 1,
            sort_by = "price",
            direction = "asc"
        } = parseQueryString(this.props.history.location.search);
        this.state.products.pagination.page = page;
        this.state.products.sort.sort_by = sort_by;
        this.state.products.sort.directio = direction;
        this.setState(this.state, callback);
    }

    async fetchInitialData() {
        await this.filterProductRequest(
            parseQueryString(this.props.history.location.search)
        );
        let resp_categories = await requestClient.get("/api/categories");
        this.setState({
            ...this.state,
            isFetching: false,
            categories: resp_categories.data
        });
    }

    async filterProductRequest(data) {
        if (this.props.history.location.pathname != "/marketplace") return;
        requestClient
            .post("/api/products/filter", {
                data: {
                    ...data,
                    ...this.state.products.sort,
                    page: this.state.products.pagination.page
                }
            })
            .then(async response => {
                switch (response.status) {
                    case 201:
                    case 200:
                    default:
                        this.setState({
                            ...this.state,
                            products: response.data
                        });
                        let queryData = parseQueryString(
                            this.props.history.location.search
                        );
                        queryData = {
                            ...queryData,
                            page: response.data.pagination.page,
                            ...this.state.products.sort
                        };
                        this.props.history.push(
                            `${
                                this.props.history.location.pathname
                            }?${qs.stringify(queryData)}`
                        );
                        break;
                }
            })
            .catch(error => {
                switch ((error.response || {}).status) {
                    default:
                        this.setErrors(error.response.data);
                        break;
                }
            });
    }

    async handlePaginationPageChange(page) {
        this.state.products.pagination.page = page;
        this.setState(this.state, () => {
            this.filterByQueryStringData();
        });
    }

    filterByQueryStringData() {
        let queryData = qs.parse(
            this.props.history.location.search.replace(/(%3F|\?)/g, ""),
            { charset: "iso-8859-1", interpretNumericEntities: true }
        );
        this.filterProductRequest(queryData);
    }

    handleOnSortDirectionClick() {
        if (this.state.products.sort.direction === "asc") {
            this.state.products.sort.direction = "desc";
        } else {
            this.state.products.sort.direction = "asc";
        }
        this.setState(this.state, () => {
            this.handlePaginationPageChange(1);
        });
    }

    handleOnSortChange(val) {
        this.state.products.sort.sort_by = val;
        this.setState(this.state, () => {
            this.handlePaginationPageChange(1);
        });
    }

    showDeleteModal(item) {
        this.state.deleteModalVisible = true;
        this.setState(this.state);
    }

    showDeleteConfirm(product) {
        confirm({
            title: `${this.props.intl.formatMessage({
                id: "crud.questions.want_to_delete_wqm"
            })}: ${product.category.name} ?`,
            icon: <ExclamationCircleOutlined />,
            okText: this.props.intl.formatMessage({ id: "crud.delete" }),
            okType: "danger",
            centered: true,
            cancelText: this.props.intl.formatMessage({ id: "general.cancel" }),
            onOk: () => {
                return this.deleteProductRequest(product.id);
            }
        });
    }

    async handleAddToCartClick(id) {
        this.state.addToCartVisible = true;
        let resp = await requestClient.get(`/api/carts/product/${id}`);
        let { product, quantity = 1 } = resp.data;
        this.state.addToCartProduct = { product, quantity };
        this.setState(this.state);
    }

    changeCartProductQuantity(val) {
        this.state.addToCartProduct.quantity = val;
        this.setState(this.state);
    }

    cancelAddToCart() {
        this.state.addToCartVisible = false;
        this.state.addToCartProduct = {
            product: { category: {} },
            quantity: 1
        };
        this.setState(this.state);
    }

    async addToCartOkClick() {
        let data = {
            quantity: this.state.addToCartProduct.quantity,
            product: {
                id: this.state.addToCartProduct.product.id
            }
        };
        requestClient
            .post(`/api/carts/add/${data.product_id}`, { cart_item: data })
            .then(async response => {
                switch (response.status) {
                    case 201:
                    case 200:
                        await this.props.setCart(response.data);
                        this.cancelAddToCart();
                    default:
                }
            })
            .catch(error => {
                switch ((error.response || {}).status) {
                    default:
                        this.state.errors = {
                            ...this.state.errors,
                            ...error.response.data.errors
                        };
                        this.setState(this.state);
                        break;
                }
            });
    }

    render() {
        return (
            <div>
                <PageHeader
                    className="site-page-header"
                    title="Marketplace"
                    avatar={{ icon: <ShopOutlined /> }}
                />
                <Divider className="site-devider after-header"></Divider>
                <Row justify="center">
                    <Col xl={20}>
                        <ProductFilter
                            categories={modifyCategories(
                                this.state.categories,
                                null,
                                true,
                                true
                            )}
                            history={this.props.history}
                            callback={data => {
                                this.filterProductRequest(data);
                            }}
                        />
                    </Col>
                </Row>
                <Divider className="site-devider after-header"></Divider>
                <Row justify="center">
                    <Col xl={20}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end"
                            }}
                        >
                            <Select
                                style={{ width: 200 }}
                                defaultActiveFirstOption={undefined}
                                placeholder={this.props.intl.formatMessage({
                                    id: "sort.placeholder"
                                })}
                                value={this.state.products.sort.sort_by}
                                onChange={val => {
                                    this.handleOnSortChange(val);
                                }}
                            >
                                <Option value={undefined}>
                                    {this.props.intl.formatMessage({
                                        id: "sort.placeholder"
                                    })}
                                </Option>
                                <Option value="price">
                                    {this.props.intl.formatMessage({
                                        id: "sort.price"
                                    })}
                                </Option>
                            </Select>
                            <Button
                                type="default"
                                icon={
                                    this.state.products.sort.direction ==
                                    "asc" ? (
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

                        <div className="product-card-wrapper">
                            {this.state.products.data.map((e, i) => (
                                <SellerProductRow
                                    categories={this.state.categories}
                                    key={i}
                                    item={e}
                                    history={this.props.history}
                                    onDeleteClickCallback={product => {
                                        this.showDeleteConfirm(product);
                                    }}
                                    addToCartCallback={id => {
                                        this.handleAddToCartClick(id);
                                    }}
                                />
                            ))}
                        </div>

                        <Pagination
                            style={{ textAlign: "right" }}
                            current={this.state.products.pagination.page}
                            pageSize={this.state.products.pagination.size}
                            total={this.state.products.pagination.total}
                            onChange={(page, pageSize) => {
                                this.handlePaginationPageChange(page, pageSize);
                            }}
                        />
                    </Col>
                </Row>
                {this.state.addToCartVisible && (
                    <Modal
                        title="Tilfoje til kurv"
                        centered
                        visible={true}
                        onOk={() => {
                            this.addToCartOkClick();
                        }}
                        onCancel={() => {
                            this.cancelAddToCart();
                        }}
                        cancelText={this.props.intl.formatMessage({
                            id: "general.back"
                        })}
                        okText={this.props.intl.formatMessage({
                            id: "general.save"
                        })}
                    >
                        <Row
                            style={{
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Col style={{ height: "120px", width: "120px" }}>
                                <img
                                    style={{ height: "100%" }}
                                    src={setFrontImageThumbnailUrl(
                                        this.state.addToCartProduct.product
                                    )}
                                />
                            </Col>
                            <div>
                                {`${
                                    this.state.addToCartProduct.product.category
                                        .name
                                } ${formatPrice(
                                    this.state.addToCartProduct.product,
                                    this.props.intl
                                )}`}
                            </div>
                            <div> x </div>
                            <InputNumber
                                defaultValue={
                                    this.state.addToCartProduct.quantity
                                }
                                min={1}
                                precision={0}
                                onChange={val => {
                                    this.changeCartProductQuantity(val);
                                }}
                                formatter={value => numberHelper.format(value)}
                                parser={value =>
                                    numberHelper.parse(value, {
                                        maxDecimalPoints: 0
                                    })
                                }
                            />
                        </Row>
                        <Row>
                            {(this.state.errors.cart_item || []).join(" ")}
                        </Row>
                        <Divider className="site-devider after-header"></Divider>
                        <Row style={{ justifyContent: "flex-end" }}>
                            <div>
                                Total Price:{" "}
                                {currencyHelper
                                    .value(
                                        this.state.addToCartProduct.quantity *
                                            this.state.addToCartProduct.product
                                                .price
                                    )
                                    .format()}{" "}
                            </div>
                        </Row>
                    </Modal>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { cartReducer } = state;
    return { cartReducer };
};

const mapDispatchToProps = dispatch => ({
    setCart: data => dispatch(setCart(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(injectIntl(MarketPlacePage)));
