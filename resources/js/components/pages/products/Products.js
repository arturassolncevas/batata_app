import React, { Component } from 'react'
import { PageHeader, Divider, Button, Row, Col, Pagination, Select } from 'antd';
import { DropboxOutlined, PlusOutlined, SortDescendingOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import SellerProductRow from './components/SellerProductRow'
import ProductFilter from '../../shared/products/ProductFilter';
import { modifyCategories } from './helpers/helper'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import qs from 'qs';
const { Option } = Select

class ProductsPage extends Component {
  constructor(props) {
    super(props)
    this.state = { isFetching: false, categories: [], products: { data: [], pagination: { total: 10, page: 1, size: 20 } }, sort: { direction: "asc" } }
  }

  componentDidMount() {
    this.setQueryData
    this.fetchInitialData()
  }

  async fetchInitialData() {
    await this.filterProductRequest(qs.parse(this.props.history.location.search.replace(/(%3F|\?)/g, ""), { charset: 'iso-8859-1', interpretNumericEntities: true, }))
    let resp_categories = await requestClient.get('/api/categories')
    this.setState({ ...this.state, isFetching: false, categories: resp_categories.data })
  }

  async filterProductRequest(data) {
    requestClient.post('/api/products/filter', { data: { personal: true, ...this.state.sort, page: this.state.products.pagination.page, ...data } })
      .then(async (response) => {
        switch (response.status) {
          case 201:
          case 200:
          default:
            console.log("here")
            console.log(this.state.products) 
            console.log(response.data)
            this.setState({ ...this.state, products: response.data }, () => { console.log(this.state) })
            let queryData = qs.parse(this.props.history.location.search.replace(/(%3F|\?)/g, ""), { charset: 'iso-8859-1', interpretNumericEntities: true, })
            queryData = { ...queryData, page: response.data.pagination.page, ...this.state.sort }
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
    this.state.products.pagination.page = page
    this.setState(this.state, () => { 
      let queryData =  qs.parse(this.props.history.location.search.replace(/(%3F|\?)/g, ""), { charset: 'iso-8859-1', interpretNumericEntities: true, })
      this.filterProductRequest({ ...queryData, page})
     })
  }

  handleOnSortDirectionClick() {
    if (this.state.sort.direction === "asc") {
      this.state.sort.direction = "desc"
    } else {
      this.state.sort.direction = "asc"
    } 
    this.setState(this.state, () => { this.handlePaginationPageChange(1) })
  }

  handleOnSortChange(val) {
    this.state.sort.sort_by = val
    this.setState(this.state, () => { this.handlePaginationPageChange(1) })
    
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
              callback={(data) => { this.filterProductRequest(data) }}
            />
          </Col>
        </Row>
        <Divider className="site-devider after-header"></Divider>

        <Row justify="center">
          <Col xl={20}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Select 
                style={{ width: 200 }}
                defaultActiveFirstOption={undefined}
                placeholder={this.props.intl.formatMessage({ id: 'sort.placeholder' })}
                value={this.state.sort.sort_by}
                onChange={(val) => { this.handleOnSortChange(val) }}
                >
                <Option value={undefined}>{this.props.intl.formatMessage({ id: 'sort.placeholder' })}</Option>
                <Option value="price">{this.props.intl.formatMessage({ id: 'sort.price' })}</Option>
              </Select>
              <Button 
                type="default"
                icon={ this.state.sort.direction == "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                onClick={() => { this.handleOnSortDirectionClick() }}
                />
            </div>
            {this.state.products.data.map((e, i) => (
              <SellerProductRow
                categories={this.state.categories}
                key={i}
                item={e}
                history={this.props.history}
              />
            ))}

            <Pagination
              style={{ textAlign: "right" }}
              current={this.state.products.pagination.page}
              pageSize={this.state.products.pagination.size}
              total={this.state.products.pagination.total}
              onChange={(page, pageSize) => { this.handlePaginationPageChange(page, pageSize) }}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default withRouter(injectIntl(ProductsPage))