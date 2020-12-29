import React, { Component, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import store from "../redux/store";

const authorize = (user_roles = [], allowed_roles = []) => {
    if (allowed_roles.length === 0) return true;
    return user_roles.filter(role => allowed_roles.includes(role)).length > 0;
};

const PrivateRoute = ({
    component: Component,
    allowed_roles = [],
    ...rest
}) => {
    let {
        isLogged,
        user: { roles = [] }
    } = store.getState().authReducer;
    return (
        <Route
            {...rest}
            render={props =>
                isLogged ? (
                    authorize(roles, allowed_roles) ? (
                        <Suspense fallback={<div>Loading component</div>}>
                            <Component {...props} />
                        </Suspense>
                    ) : (
                        <Redirect to={{ pathname: "/unauthorized" }} />
                    )
                ) : (
                    <Redirect to={{ pathname: "/login" }} />
                )
            }
        />
    );
};
export default PrivateRoute;
