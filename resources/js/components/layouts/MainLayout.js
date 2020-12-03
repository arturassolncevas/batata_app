import React, { Component } from "react";
import { withRouter, useLocation } from "react-router-dom";
import { Layout, Input } from "antd";
import { logOut } from "../redux/actions/authActions";
import { triggerMenu } from "../redux/actions/menuActions";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import Header from "../shared/Header";
import Menu from "../shared/Menu";

const MainLayout = props => {
    const handleLogOut = async e => {
        e.preventDefault;
        await props.logOut();
        props.history.push("/");
    };

    // async handleMenuClick(e) {
    //   await this.props.triggerMenu()
    // }
    const { Content } = Layout;
    const { Search } = Input;

    const onSearch = value => console.log(value);

    let location = useLocation();
    let { pathname } = location;
    pathname = pathname.split("/")[1];

    return (
        <Layout style={{ height: "100vh" }}>
            <Header
                // handleMenuClick={(e) => { this.handleMenuClick(e) }}
                handleLogOut={e => {
                    this.handleLogOut(e);
                }}
                history={props.history}
            />
            <Layout className="main-wrapper">
                <Menu />
                <Layout>
                    <Content className="site-layout-background">
                        <div className="page-header">
                            <h3 className="page-title">{`User Dashboard - ${pathname}`}</h3>
                            <Search
                                placeholder="input search text"
                                allowClear
                                onSearch={onSearch}
                                style={{ width: 200, margin: "0 10px" }}
                            />
                        </div>
                        {props.children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

const mapStateToProps = state => {
    const { authReducer, menuReducer } = state;
    return { authReducer, menuReducer };
};

const mapDispatchToProps = dispatch => ({
    logOut: () => dispatch(logOut()),
    triggerMenu: () => dispatch(triggerMenu())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(withRouter(MainLayout)));
