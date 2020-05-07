import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from './services/PrivateRoute'
import HomePage from './pages/home/Home'
import LoginPage from './pages/login/Login'
import 'antd/dist/antd.css'
import '../../styles/less/app.less'
import { injectIntl } from 'react-intl'
import MainLayout from './layouts/MainLayout.js'

class Index extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <MainLayout>
          <PrivateRoute path="/" component={HomePage} />
        </MainLayout>
      </Switch>
    )
  }
}

export default injectIntl(Index) 
