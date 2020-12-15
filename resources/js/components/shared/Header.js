import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Layout, Menu, Dropdown, Row, Col, Button, Badge, Avatar } from "antd";
import {
    MenuFoldOutlined,
    MenufoldOutlined,
    ShoppingCartOutlined
} from "@ant-design/icons";
import logoImage from "../../../images/batata-logo.svg";
import profileImage from "../../../images/profile.jpg";
import { connect } from "react-redux";
const { Header } = Layout;

const menu = handleLogout => {
    return (
        <Menu>
            <Menu.Item key="0">
              <a href to={"/profile/settings"}></a>
                Profile settings
            </Menu.Item>
            <Menu.Item key="1">
                <a href="#">Messages</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3">
                <a onClick={handleLogout}>Logout</a>
            </Menu.Item>
        </Menu>
    );
};

const HeaderComponent = props => {
    const { handleMenuClick, handleLogOut } = props;
    let userDetails = JSON.parse(localStorage.getItem("details") || "{}");
    return (
        <Header className="header">
            <Row justify="space-between" className="content-wrapper">
                <Col className="logo-wrapper">
                    {/* <Button
                        className="l1-width l1-height"
                        type="primary"
                        icon={<MenuFoldOutlined style={{ fontSize: "24px" }} />}
                        onClick={handleMenuClick}
                    /> */}
                    <div>
                        <img src={logoImage} alt="brand logo" />
                    </div>
                </Col>
                <Col className="header-content">
                    <Badge
                        onClick={() => {
                            props.history.push("/cart");
                        }}
                        count={(props.cartReducer.cart || []).length}
                        offset={[-18, 20]}
                        style={{
                            backgroundColor: "#f67d09",
                            cursor: "pointer"
                        }}
                        size="defaukt"
                    >
                        <Avatar
                            style={{
                                color: "#f8af17",
                                background: "#031429",
                                fontSize: "25px",
                                height: "64px",
                                cursor: "ponter",
                                width: "64px"
                            }}
                        >
                            <ShoppingCartOutlined
                                style={{ cursor: "pointer" }}
                            />
                        </Avatar>
                    </Badge>
                    <div className="profile-picture">
                        <Badge
                            count={3}
                            style={{ backgroundColor: "#001427", width: "20%" }}
                        >
                            <Avatar shape="circle" src={profileImage} />
                        </Badge>
                    </div>
                    <div>
                        <p className="user-email text-small text-light">
                            {userDetails.email}
                        </p>
                        <p className="user-name text-normal text-dark">
                            {userDetails.name}
                        </p>
                    </div>
                    <div>
                        <Dropdown
                            overlay={menu(handleLogOut)}
                            trigger={["click"]}
                        >
                            <a
                                className="ant-dropdown-link"
                                onClick={e => e.preventDefault()}
                            >
                                <svg
                                    className="dropdown-toggler"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    focusable="false"
                                    width="1em"
                                    height="1em"
                                    preserveAspectRatio="xMidYMid meet"
                                    viewBox="0 0 16 16"
                                >
                                    <g fill="#4F4F4F">
                                        <path
                                            fillRule="evenodd"
                                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                        />
                                    </g>
                                </svg>
                            </a>
                        </Dropdown>
                    </div>
                </Col>
            </Row>
        </Header>
    );
};

const mapStateToProps = state => {
    const { cartReducer } = state;
    return { cartReducer };
};

const mapDispatchToProps = dispatch => ({
    setCart: data => dispatch(setCart(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
