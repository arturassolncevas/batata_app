import React from 'react'
import { Route, Switch } from 'react-router-dom'
import HomePage from './pages/Home'
import LoginPage from './pages/Login'
import 'antd/dist/antd.css'
import '../../styles/less/app.less'

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/login" component={LoginPage} />
    </Switch>
  )
}