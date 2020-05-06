import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import HomePage from './pages/Home'
import LoginPage from './pages/login/Login'
import 'antd/dist/antd.css'
import '../../styles/less/app.less'
import { injectIntl } from 'react-intl'

class Index extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
      </Switch>
    )
  }
}

export default injectIntl(Index) 
