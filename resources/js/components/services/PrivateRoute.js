import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Auth from './Auth'

const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log("In private")
  return(
  <Route
    {...rest}
    render={props => Auth.getAuth() ? ( <Component {...props} />) : ( <Redirect to={{ pathname: "/login" }} />) }
  />
)};
export default PrivateRoute;