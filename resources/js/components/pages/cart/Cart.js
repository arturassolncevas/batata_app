import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { refreshCart, setCart } from '../../redux/actions/cartActions'
import { Row, Col, Card, Form, Input, InputNumber, Select, Switch, Button, PageHeader, Divider } from 'antd'
import { LoadingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'


let setFrontImageThumbnailUrl = (product = {}) => {
  return ((product.files || []).find(e => e.type === "thumbnail") || {}).url
}
let formatPrice = (item, intl) => {
  let productFormatter = new ProductFormatter()
  productFormatter.setOptions({ measurementUnitAlias: item.measurement_unit.alias, packed: item.packed, intl })
  return productFormatter.formattedPrice({ price: currencyHelper.value(item.price).format(), quantity: item.quantity })
}

const CartRow = (props) => {
  let { cartItem, intl } = props
  return (
    <Row style={{ margin: "15px 0px", padding: "10px", border: "1px solid #eaeaea", justifyContent: "space-between", alignItems: "center" }}>
      <Col style={{ height: "120px", width: "120px" }}>
        <img style={{ height: "100%" }} src={setFrontImageThumbnailUrl(cartItem.product)} />
      </Col>
      <div>
        {`${cartItem.product.category.name} ${formatPrice(cartItem.product, props.intl)}`}
      </div>
      <div> x{props.error} </div>
      <div style={{ position: "relative" }}>
        <LoadingOutlined style={{
          position: "absolute",
          zIndex: "10",
          bottom: "0px",
          left: "0px",
          right: "0px",
          top: "0px",
          background: "#fffffff7",
          display: cartItem.loading ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
        }} />
        <InputNumber min={1} precision={0} value={cartItem.quantity} onChange={(val) => { props.onProductQuantityChangeCallback(cartItem, val) }} value={cartItem.quantity} onStep={(val, info) => { }} formatter={value => numberHelper.format(value)} parser={value => numberHelper.parse(value, { maxDecimalPoints: 0 })}>
        </InputNumber>
        <Button type="primary" danger shape="circle" onClick={() => { props.onRemoveProductCallback(cartItem)}} icon={<ShoppingCartOutlined />} />
      </div>

    </Row>
  )
}

class CartPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cart_user_id: props.match.params.id,
      cart: [],
      errors: []
    }
  }

  async componentDidMount() {
    let cart = await this.props.refreshCart()
    this.state.cart = cart
    this.setState(this.state)
  }

  setErrors(errors = []) {
    this.state.errors = errors
    this.setState({ ...this.state })
  }

  handleOnSaveClick() {
    return requestClient.post(`/api/carts/update`, { cart: this.state.cart } )
      .then(async (response) => {
        this.state.cart = response.data
        this.setErrors([])
        this.setState(this.state)
        this.props.setCart(this.state.cart)
        return { success: true }
      })
      .catch((error) => {
        switch ((error.response || {}).status) {
          default:
            this.setErrors(error.response.data.errors.cart)
            return { success: false }
        }
      })
  }

  createOrderRequest() {
    return requestClient.post(`/api/orders`, { cart: this.state.cart } )
      .then(async (response) => {
        return response.data
      })
      .catch((error) => {
        switch ((error.response || {}).status) {
          default:
        }
      })
  }

  async handleOnPayClick() {
    let resp = await this.handleOnSaveClick()
    if (!resp.success)
      return false
    resp = await this.createOrderRequest() 
    this.props.refreshCart()
    this.props.history.push("/payments/status")
  }

  productQuantityChange(cartItem, quantity) {
    let item = this.state.cart.find((e) => { return e.unique_id === cartItem.unique_id })
    item.quantity = quantity
    this.setState(this.state)
  }

  handleProductRemove(cartItem) {
    requestClient.delete(`/api/carts/destroy_item/${cartItem.unique_id}`)
      .then(async (response) => {
        switch (response.status) {
          case 201:
          case 200:
          default:
           this.state.cart = this.state.cart.filter(e => e.unique_id !== cartItem.unique_id)
           this.setState(this.state)
           this.props.setCart(this.state.cart)
           break
        }
      })
  }

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title={this.props.intl.formatMessage({ id: 'pages.cart.header' })}
          avatar={{ icon: (<ShoppingCartOutlined className="header-icon" />) }}
        />
        <Divider className="site-devider after-header"></Divider>
        <Row type="flex" justify="center" style={{ ...this.props.style }}  >
          <Col xl={20} >
            {this.state.cart.map((e, i) => (
              <CartRow
                key={i}
                cartItem={e}
                onProductQuantityChangeCallback={(cartItem, quantity) => { this.productQuantityChange(cartItem, quantity) }}
                handleChangeCallback={(cartItem, val) => { this.handleCartItemChange(cartItem, val) }}
                addToCartCallback={(id) => { this.handleAddToCartClick(id) }}
                onRemoveProductCallback={(cartItem) => { this.handleProductRemove(cartItem) }}
                onBlurCallback={(cartItem) => this.handleCartItemBlur(cartItem)}
                intl={this.props.intl}
                error={(this.state.errors[i] || [])}
              />
            ))}
            <Divider className="site-devider after-header"></Divider>
            <Row style={{ justifyContent: "flex-end" }}>
              <div>Total Price: {currencyHelper.value(this.state.cart.map((e) => e.quantity * e.product.price).reduce((sum, x) => sum + x, 0)).format()} </div>
            </Row>
            <Row style={{justifyContent: "flex-end", marginTop: "15px"}}>
              <Button onClick={() => { this.props.history.push('/') }} >{this.props.intl.formatMessage({ id: 'general.back' })}</Button>
              <Button type={"primary"} onClick={() => { this.handleOnSaveClick() }} style={{ margin: "0 8px" }}>{this.props.intl.formatMessage({ id: 'general.save' })}</Button>
              <Button type={"primary"} onClick={() => { this.handleOnPayClick() }} >{this.props.intl.formatMessage({ id: 'pages.cart.checkout' })}</Button>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  refreshCart: () => dispatch(refreshCart()),
  setCart: (data) => dispatch(setCart(data))
})

export default connect((state) => ({}), mapDispatchToProps)(withRouter(injectIntl(CartPage)))