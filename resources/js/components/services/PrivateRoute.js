import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Auth from './Auth'
import store from '../redux/store'

const PrivateRoute = ({ component: Component, ...rest }) => {
  let { isLogged } = store.getState().authReducer
    console.log("private route")
    console.log(isLogged)
  return(
  <Route
    {...rest}
    render={props => isLogged ? ( <Component {...props} />) : ( <Redirect to={{ pathname: "/login" }} />) }
  />
)};
export default PrivateRoute;