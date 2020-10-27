import React, { Component, Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from './services/PrivateRoute'
import HomePage from './pages/home/Home'

const ProductsPage = React.lazy(() => import('./pages/products/Products'));
const NewProductPage = React.lazy(() => import('./pages/products/NewProduct'));
const EditProductPage = React.lazy(() => import('./pages/products/EditProduct'));
const MarketPlacePage = React.lazy(() => import('./pages/marketplace/Marketplace'));

import DashBoardPage from './pages/dashboard/Dashboard'
import OrdersPage from './pages/orders/Orders'
import LoginPage from './pages/login/Login'
import SignupPage from './pages/signup/Signup'
import { Result, Button } from 'antd';
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
          <Route exact path='/not-found'>
            <Result
              status="404"
              title="404"
              subTitle="Sorry, the page you visited does not exist."
              extra={<Button type="primary">Back Home</Button>}
            />
          </Route>
          <Route exact path='/unauthorized'>
            <Result
              status="403"
              title="403"
              subTitle="You dont have rights to access current page"
              extra={<Button type="primary">Back Home</Button>}
            />
          </Route>
          <Route exact path="/sign-up" component={SignupPage} />
          <Route exact path="/login" component={LoginPage} />
          <MainLayout>
            <Switch>
              <PrivateRoute exact path="/" component={DashBoardPage} />
              <PrivateRoute path="/dashboard" component={DashBoardPage} />
              <PrivateRoute path="/orders" component={OrdersPage} />

              <PrivateRoute exact path="/products" component={ProductsPage} allowed_roles={[]} />
              <PrivateRoute exact path="/products/new" component={NewProductPage} />
              <PrivateRoute exact path="/products/:id/edit" component={EditProductPage} />

              <PrivateRoute path="/marketplace" component={MarketPlacePage} />
              <Route><Redirect to={{ pathname: "/not-found" }} /></Route>
            </Switch>
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