import React, { Component } from 'react'
import { PageHeader, Divider, Button, Row, Col, AutoComplete, Input } from 'antd';
import { DropboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import SellerProductRow from './components/SellerProductRow'
import ProductFilter from '../../shared/products/ProductFilter';
import { modifyCategories } from './helpers/helper'


export default class ProductsPage extends Component {
  constructor(props) {
    super(props)
    this.state = { isFetching: false, categories: [], products: { data: [] } }
  }

  componentDidMount() {
    this.fetchInitialData()
  }

  async fetchInitialData() {
    let resp_products = await requestClient.get('/api/products?personal=true')
    let resp_categories = await requestClient.get('/api/categories')
    this.setState({ ...this.state, isFetching: false, products: resp_products.data, categories: resp_categories.data })
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