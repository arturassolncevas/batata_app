import React from "react";
import { Button, Row, Col, Tooltip } from "antd";
import {
    EditFilled,
    ShoppingCartOutlined,
    ShoppingOutlined,
    createFromIconfontCN
} from "@ant-design/icons";
import { injectIntl } from "react-intl";

const IconFont = createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js"
});

let unitsFormat = (item, value, intl, options = {}) => {
    let productFormatter = new ProductFormatter();
    productFormatter.setOptions({
        measurementUnitAlias: item.measurement_unit.alias,
        packed: item.packed,
        intl
    });
    return productFormatter.formattedQuantity({ quantity: value });
};

let setFrontImageThumbnailUrl = item => {
    return (item.files.find(e => e.type === "thumbnail") || {}).url;
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

const sellerProductRow = props => (
    <Row
        className="product-card"
        style={{
            margin: "15px 0px",
            padding: "10px",
            border: "1px solid #eaeaea"
        }}
    >
        <Col style={{ height: "120px", width: "120px" }}>
            <img
                style={{ height: "100%" }}
                src={setFrontImageThumbnailUrl(props.item)}
            />
        </Col>
        <Col style={{ flexGrow: "1", padding: "0px 15px" }}>
            <Row style={{ flexDirection: "column", height: "100%" }}>
                <Col>
                    <Row>
                        <strong style={{ fontSize: "17px" }}>
                            {props.item.category.name}
                        </strong>
                    </Row>
                </Col>
                <Col style={{ flexGrow: "1" }}>
                    {props.item.attributes.map((e, i) => {
                        return (
                            <div key={i}>{`${e.attribute.name}: ${
                                (e.option || {}).name
                            }`}</div>
                        );
                    })}
                </Col>
                <Row>
                    <Col style={{ marginRight: "15px" }}>
                        {props.intl.formatMessage({
                            id: "models.product.minQuantity"
                        })}
                        :{" "}
                        <strong>
                            {unitsFormat(
                                props.item,
                                props.item.min_quantity,
                                props.intl
                            )}
                        </strong>
                    </Col>
                    <Col style={{ marginRight: "15px" }}>
                        {props.intl.formatMessage({
                            id: "models.product.maxQuantity"
                        })}
                        :{" "}
                        <strong>
                            {unitsFormat(
                                props.item,
                                props.item.max_quantity,
                                props.intl
                            )}
                        </strong>
                    </Col>
                </Row>
            </Row>
        </Col>
        <Col
            style={{
                display: "flex",
                alignItems: "center",
                fontSize: "17px",
                fontWeight: "bold",
                margin: "15px"
            }}
        >
            {formatPrice(props.item, props.intl)}
        </Col>
        <Col>
            <Row
                style={{
                    flexDirection: "row",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Col>
                    <Tooltip
                        title={props.intl.formatMessage({
                            id: "general.add_to_cart"
                        })}
                    >
                        <Button
                            type={"text"}
                            size="large"
                            style={{ margin: "4px" }}
                            shape="circle"
                            icon={<IconFont type="icon-shoppingcart" />}
                            onClick={() => {
                                props.addToCartCallback(props.item.id);
                            }}
                        />
                    </Tooltip>
                </Col>
            </Row>
        </Col>
    </Row>
);

export default injectIntl(sellerProductRow);
