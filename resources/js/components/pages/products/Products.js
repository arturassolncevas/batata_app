import React, { Component } from 'react'
import { PageHeader, Divider, Button, Row, Col, AutoComplete, Input } from 'antd';
import { DropboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import SellerProductRow from './components/SellerProductRow'
import ProductFilter from '../../shared/products/ProductFilter';
import { modifyCategories } from './helpers/helper'
import { withRouter } from 'react-router-dom'
import qs from 'query-string';


class ProductsPage extends Component {
  constructor(props) {
    super(props)
    this.state = { isFetching: false, categories: [], products: { data: [] } }
  }

  componentDidMount() {
    this.fetchInitialData()
  }

  async fetchInitialData() {
    let resp_products = await requestClient.post('/api/products/filter?personal=true')
    let resp_categories = await requestClient.get('/api/categories')
    this.setState({ ...this.state, isFetching: false, products: resp_products.data, categories: resp_categories.data })
  }

  async filterProductRequest(data) {
    requestClient.post('/api/products/filter', { data: data })
      .then(async (response) => {
        switch (response.status) {
          case 201:
          case 200:
          default:
            this.setState({ ...this.state, products: response.data })

            break
        }
      })
      .catch((error) => {
        switch ((error.response || {}).status) {
          default:
            this.setErrors(error.response.data)
            break
        }
      })
  }

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="Products"
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
          extra={[(
            <Link key="1" to="/products/new">
              <Button className="site-button soft" type="primary" shape="circle" icon={<PlusOutlined />} size={"large"} />
            </Link>)]}
        />
        <Divider className="site-devider after-header"></Divider>
        <Row justify="center">
          <Col xl={20}>
            <ProductFilter
              categories={modifyCategories(this.state.categories, null, true, true)}
              history={this.props.history}
              callback={(data) => { this.filterProductRequest(data) }}
            />
          </Col>
        </Row>
        <Divider className="site-devider after-header"></Divider>
        <Row justify="center">
          <Col xl={20}>
            {this.state.products.data.map((e, i) => ( 
              <SellerProductRow
                categories={this.state.categories}
                key={i}
                item={e}
              />
             ))}
          </Col>
        </Row>
      </div>
    )
  }
}

export default withRouter(ProductsPage)