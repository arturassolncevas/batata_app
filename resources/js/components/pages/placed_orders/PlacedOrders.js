import React, { Component } from 'react'
import { PageHeader, Divider, Button, Row, Col, Table } from 'antd';
import { DropboxOutlined, PlusOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
const { Column } = Table;

let setFrontImageThumbnailUrl = (item) => {
  return (item.files.find(e => e.type === "thumbnail") || {}).url
}

let formatPrice = (lineItem, intl) => {
  let productFormatter = new ProductFormatter()
  productFormatter.setOptions({ measurementUnitAlias: lineItem.measurement_unit.alias, packed: lineItem.packed, intl })
  return productFormatter.formattedPrice({ price: currencyHelper.value(lineItem.price).format(), quantity: lineItem.product_quantity })
}

class PlacedOrdersPage extends Component {
  constructor(props) {
    super(props)
    this.state = { placed_orders: [] }
  }

  async componentDidMount() {
    this.filterOrders()
  }

  filterOrders() {
    return requestClient.get(`/api/orders/placed_orders`)
      .then(async (response) => {
        this.state.placed_orders = response.data
        this.state.placed_orders.forEach(e => { e.key = e.id })
        console.log(this.state)
        this.setState(this.state)
      })
      .catch((error) => {
        switch ((error.response || {}).status) {
        //  default:
        //    this.setErrors(error.response.data.errors.cart)
        //    return { success: false }
        }
      })
  }

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title={this.props.intl.formatMessage({ id: 'pages.placed_orders.header' })}
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
        />
        <Divider className="site-devider after-header"></Divider>

        <Row justify="center">
          <Col xl={24} style={{ textAlign: "center", padding: "40px" }}>
            <Table dataSource={this.state.placed_orders}>
              <Column title="ID" dataIndex="id" key="id" />
              <Column
                title="Products"
                dataIndex="line_items"
                key="line_items"
                render= { (objects = []) => { 
                  return objects.map((obj, index) => (
                    <Row key={obj.id} >
                      <img style={{ height: "30px", padding: "1px", marginRight: "15px" }} src={setFrontImageThumbnailUrl(obj.product)}/>
                      <div>{`${obj.name} ${formatPrice(obj, this.props.intl)}`}</div>
                      <div>&nbsp; x &nbsp;</div>
                      <div>{`${obj.quantity}`}</div>
                    </Row>
                  ))
                }}
                />
              <Column
                title="TOTAL"
                dataIndex="total"
                key="total"
                render = { (object) => currencyHelper.value(object).format()}
              />
            </Table>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withRouter(injectIntl(PlacedOrdersPage))