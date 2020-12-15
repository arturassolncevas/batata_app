import React from "react";
import { Layout, Menu } from "antd";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withRouter, NavLink } from "react-router-dom";
import {
    DotChartOutlined,
    CarryOutOutlined,
    ShopOutlined,
    DropboxOutlined
} from "@ant-design/icons";

const menuKeys = {
    "1": {
        location: "/dashboard",
        regex: [new RegExp("^/$"), new RegExp("^/dashboard")]
    },
    "2": { location: "/placed_orders", regex: [new RegExp("^/placed_orders")] },
    "3": { location: "/orders", regex: [new RegExp("^/orders")] },
    "4": { location: "/products", regex: [new RegExp("^/products")] },
    "5": { location: "/marketplace", regex: [new RegExp("^/marketplace")] }
};

const selectMenuKeys = locationString => {
    let result = [];
    for (let property in menuKeys) {
        for (let regex of menuKeys[property].regex) {
            if (locationString.match(regex)) {
                result.push(property);
                break;
            }
        }
    }
    return result;
};

const MobileMenu = props => {
    return (
        <nav id="mobile-nav">
            <Menu
                mode="inline"
                selectedKeys={selectMenuKeys(props.history.location.pathname)}
            >
                <Menu.Item key="1">
                    <NavLink to={menuKeys["1"].location}>
                        <DotChartOutlined />
                        {props.intl.formatMessage({ id: "menu.dashboard" })}
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="3">
                    <NavLink to={menuKeys["3"].location}>
                        <CarryOutOutlined />
                        {props.intl.formatMessage({ id: "menu.orders" })}
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="5">
                    <NavLink to={menuKeys["5"].location}>
                        <ShopOutlined />
                        {props.intl.formatMessage({ id: "menu.marketplace" })}
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="4">
                    <NavLink to={menuKeys["4"].location}>
                        <DropboxOutlined />
                        {props.intl.formatMessage({ id: "menu.products" })}
                    </NavLink>
                </Menu.Item>
                <Menu.Item key="2">
                    <NavLink to={menuKeys["2"].location}>
                        <DotChartOutlined />
                        {props.intl.formatMessage({ id: "menu.placed_orders" })}
                    </NavLink>
                </Menu.Item>
            </Menu>
        </nav>
    );
};

const mapStateToProps = state => {
    const { authReducer, menuReducer } = state;
    return { authReducer, menuReducer };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(withRouter(MobileMenu)));
