import React from 'react'
import { Route, Switch } from 'react-router-dom'
import HomePage from './pages/home'
import 'antd/dist/antd.css'
import '../../styles/less/app.less'

export default function App() {
  return (
    <Switch>
      <Route exact patth="/" component={HomePage} />
    </Switch>
  )
}