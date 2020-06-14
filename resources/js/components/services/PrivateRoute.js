import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import store from '../redux/store'

const PrivateRoute = ({ component: Component, ...rest }) => {
  let { isLogged } = store.getState().authReducer
  return(
  <Route
    {...rest}
    render={props => isLogged ? ( <Component {...props} />) : ( <Redirect to={{ pathname: "/login" }} />) }
  />
)};
export default PrivateRoute;