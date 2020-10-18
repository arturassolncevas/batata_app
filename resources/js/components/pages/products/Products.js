import React, { Component } from 'react'
import { PageHeader, Divider, Button, Row, Col, Pagination } from 'antd';
import { DropboxOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import SellerProductRow from './components/SellerProductRow'
import ProductFilter from '../../shared/products/ProductFilter';
import { modifyCategories } from './helpers/helper'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import qs from 'qs';



class ProductsPage extends Component {
  constructor(props) {
    super(props)
    this.state = { isFetching: false, categories: [], products: { data: [], pagination: { total: 10, page: 1, size: 20 } } }
  }

  componentDidMount() {
    this.setQueryData
    this.fetchInitialData()
  }

  async fetchInitialData() {
    await this.filterProductRequest(qs.parse(this.props.history.location.search))
    let resp_categories = await requestClient.get('/api/categories')
    this.setState({ ...this.state, isFetching: false, categories: resp_categories.data })
  }

  async filterProductRequest(data) {
    requestClient.post('/api/products/filter', { data: { ...data,  personal: true } })
      .then(async (response) => {
        switch (response.status) {
          case 201:
          case 200:
          default:
            this.setState({ ...this.state, products: response.data })
            let queryData = qs.parse(this.props.history.location.search.replace(/(%3F|\?)/g, ""), { charset: 'iso-8859-1', interpretNumericEntities: true, })
            queryData = { ...queryData, page: response.data.pagination.page } 
            this.props.history.push(`/products?${qs.stringify(queryData)}`)
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

  async handlePaginationPageChange(page, pageSize) {
   let queryData = { ...qs.parse(this.props.history.location.search), page } 
   await this.filterProductRequest(queryData)
  }

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title={this.props.intl.formatMessage({ id: 'pages.products.index.header' })}
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
              callback={(data) => { this.filterProductRequest({ ...data, page: 1 }) }}
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
                history={this.props.history}
              />
             ))}

          <Pagination
            style={{textAlign: "right"}}
            current={this.state.products.pagination.page}
            pageSize={this.state.products.pagination.size}
            total={this.state.products.pagination.total}
            onChange={(page, pageSize) => { this.handlePaginationPageChange(page, pageSize) } }
          />
          </Col>
        </Row>
      </div>
    )
  }
}

export default withRouter(injectIntl(ProductsPage))