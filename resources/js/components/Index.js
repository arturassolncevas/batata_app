import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from './services/PrivateRoute'
import HomePage from './pages/home/Home'
import LoginPage from './pages/login/Login'
import 'antd/dist/antd.css'
import '../../styles/less/app.less'
import { injectIntl } from 'react-intl'
import MainLayout from './layouts/MainLayout.js'
import { signIn } from './redux/actions/authActions'
import { connect } from 'react-redux'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = { initialLoadStatus: "loading" }
  }

  async componentDidMount() {
    await this.props.signIn()
    this.state.initialLoadStatus = "finished"
    this.setState({ ...this.state })
  }

  render() {
    if (this.state.initialLoadStatus == "finished") {
      return (
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <MainLayout>
            <PrivateRoute path="/" component={HomePage} />
          </MainLayout>
        </Switch>
      )
    } else { 
      return (<div>Loading</div>)
     }
  }
}

  const mapStateToProps = state => {
    const { authReducer } = state
    return { authReducer }
  }

  const mapDispatchToProps = dispatch => ({
    signIn: () => dispatch(signIn())
  })

  export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Index))