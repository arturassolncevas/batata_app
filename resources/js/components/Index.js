import React, { Component, Suspense } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from './services/PrivateRoute'
import HomePage from './pages/home/Home'

const ProductsPage = React.lazy(() => import('./pages/products/Products'));
const NewProductPage = React.lazy(() => import('./pages/products/NewProduct'));
const EditProductPage = React.lazy(() => import('./pages/products/EditProduct'));
const MarketPlacePage = React.lazy(() => import('./pages/marketplace/Marketplace'));
const CartPage = React.lazy(() => import('./pages/cart/Cart'));
const ProfileSettingsPage = React.lazy(() => import('./pages/profile/ProfileSettings.js'));
const CompanyProfileSettings = React.lazy(() => import('./pages/company/CompanyProfileSettings.js'));

import DashBoardPage from './pages/dashboard/Dashboard'
import PaymentsPage from './pages/payments/Payments'
import OrdersPage from './pages/orders/Orders'
import PlacedOrdersPage from './pages/placed_orders/PlacedOrders'
import LoginPage from './pages/login/Login'
import SignupPage from './pages/signup/Signup'
import { Result, Button } from 'antd';
import '../../styles/less/app.less'
import { injectIntl } from 'react-intl'
import MainLayout from './layouts/MainLayout.js'
import { signIn } from './redux/actions/authActions'
import { refreshCart } from './redux/actions/cartActions';
import { connect } from 'react-redux'

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = { initialLoadStatus: "loading" }
  }

  async componentDidMount() {
    let signed = await this.props.signIn()
    await this.props.refreshCart()
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
              <PrivateRoute path="/placed_orders" component={PlacedOrdersPage} />
              <PrivateRoute path="/settings/profile" component={ProfileSettingsPage} />
              <PrivateRoute path="/settings/company" component={CompanyProfileSettings} />
              <PrivateRoute path="/payments/status" component={PaymentsPage} />
              <PrivateRoute exact path="/products" component={ProductsPage} allowed_roles={[]} />
              <PrivateRoute exact path="/products/new" component={NewProductPage} />
              <PrivateRoute exact path="/products/:id/edit" component={EditProductPage} />

              <PrivateRoute path="/marketplace" component={MarketPlacePage} />
              <PrivateRoute path="/cart" component={CartPage} />

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
  signIn: () => dispatch(signIn()),
  refreshCart: () => dispatch(refreshCart())
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Index))