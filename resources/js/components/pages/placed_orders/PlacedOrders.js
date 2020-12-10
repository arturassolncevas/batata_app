import React, { Component } from 'react'
import { PageHeader, Divider, Button, Row, Col, Table, Avatar, Select, Tag } from 'antd';
import { DropboxOutlined, FileImageOutlined, SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import moment from 'moment';
import qs from 'qs';
const { Column } = Table;
const { Option } = Select

let setFrontImageThumbnailUrl = (item) => {
  item = item || { files: [] }
  return (item.files.find(e => e.type === "thumbnail") || {}).url
}

let formatPrice = (lineItem, intl) => {
  let productFormatter = new ProductFormatter()
  productFormatter.setOptions({ measurementUnitAlias: lineItem.measurement_unit.alias, packed: lineItem.packed, intl })
  return productFormatter.formattedPrice({ price: currencyHelper.value(lineItem.price).format(), quantity: lineItem.product_quantity })
}

let parseQueryString = (str) => {
  return qs.parse(str.replace(/(%3F|\?)/g, ""), { charset: 'iso-8859-1', interpretNumericEntities: true, })
}

class PlacedOrdersPage extends Component {
  constructor(props) {
    super(props)
    this.state = { placed_orders: { data: [], pagination: { total: 10, page: 1, size: 20 }, sort: { sort_by: "date", direction: "desc" } } }
  }

  componentDidMount() {
    this.setDataFromQuery(() => { this.fetchInitialData() })
  }

  async fetchInitialData() {
    await this.filterOrdersRequest(parseQueryString(this.props.history.location.search))
    this.setState(this.state)
  }

  filterOrdersRequest(data) {
    if (this.props.history.location.pathname !== "/placed_orders")
      return
    return requestClient.post(`/api/placed_orders/filter`, { data: { ...data, ...this.state.placed_orders.sort, page: this.state.placed_orders.pagination.page } })
      .then(async (response) => {
        this.state.placed_orders = response.data
        this.state.placed_orders.data.forEach(e => { e.key = e.id })
        this.setState(this.state)
        let queryData = parseQueryString(this.props.history.location.search)
        queryData = { ...queryData, page: response.data.pagination.page, ...this.state.placed_orders.sort }
        this.props.history.push(`${this.props.history.location.pathname}?${qs.stringify(queryData)}`)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  setDataFromQuery(callback = () => {}) {
   let { page = 1, sort_by = "date", direction = "desc" } =  parseQueryString(this.props.history.location.search)
   this.state.placed_orders.pagination.page = page
   this.state.placed_orders.sort.sort_by = sort_by
   this.state.placed_orders.sort.direction = direction
   this.setState(this.state, callback)
  }

  handleOnSortDirectionClick() {
    if (this.state.placed_orders.sort.direction === "asc") {
      this.state.placed_orders.sort.direction = "desc"
    } else {
      this.state.placed_orders.sort.direction = "asc"
    } 
    this.setState(this.state, () => { this.handlePaginationPageChange(1) })
  }

  handleOnSortChange(val) {
    this.state.placed_orders.sort.sort_by = val
    this.setState(this.state, () => { this.handlePaginationPageChange(1) })
  }

  async handlePaginationPageChange(page) {
    this.state.placed_orders.pagination.page = page
    this.setState(this.state, () => { this.filterByQueryStringData() })
  }

  filterByQueryStringData() {
    let queryData = qs.parse(this.props.history.location.search.replace(/(%3F|\?)/g, ""), { charset: 'iso-8859-1', interpretNumericEntities: true, })
    this.filterOrdersRequest(queryData)
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div>
                <Select
                  style={{ width: 200, textAlign: "left" }}
                  defaultActiveFirstOption={undefined}
                  placeholder={this.props.intl.formatMessage({ id: 'sort.placeholder' })}
                  value={this.state.placed_orders.sort.sort_by}
                  onChange={(val) => { this.handleOnSortChange(val) }}
                >
                  <Option value={undefined}>{this.props.intl.formatMessage({ id: 'sort.placeholder' })}</Option>
                  <Option value="date">{this.props.intl.formatMessage({ id: 'sort.date' })}</Option>
                  <Option value="total">{this.props.intl.formatMessage({ id: 'sort.price' })}</Option>
                </Select>
                <Button
                  type="default"
                  icon={this.state.placed_orders.sort.direction == "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                  onClick={() => { this.handleOnSortDirectionClick() }}
                />
              </div>
            </div>
            <Table
              dataSource={this.state.placed_orders.data}
              pagination={{
                current: this.state.placed_orders.pagination.page ,
                pageSize: this.state.placed_orders.pagination.size,
                total: this.state.placed_orders.pagination.total,
                onChange: (page, pageSize) => { this.handlePaginationPageChange(page, pageSize)}} }
              >
              <Column title="ID" dataIndex="id" key="id" />
              <Column title="Time" dataIndex="created_at" key="created_at"
              render={(dateTime) => {
                return moment.utc(dateTime).local().format("MM-DD-YYYY hh:mm")
              }}
               />
              <Column title="Status" dataIndex="status" key="status"
                render={(status) => {
                  let color = ""
                  switch (status) {
                    case "pending":
                      color = "purple"
                      break
                    case "processing":
                      color = "blue"
                      break
                    case "completed":
                      color = "green"
                      break
                    case "cancelled":
                      color = "grey"
                      break
                    case "failed":
                      color = "red"
                    default:
                      color = "grey"
                  }
                  return <Tag style={{ margin: "4px" }}
                    color={color}>
                    {status}
                  </Tag>
                }
                }
               />
              <Column
                title="Products"
                dataIndex="line_items"
                key="line_items"
                render= { (objects = []) => { 
                  return objects.map((obj, index) => (
                    <Row key={obj.id} >
                      { obj.product ?
                      <img style={{ height: "30px", padding: "1px", marginRight: "15px" }} src={setFrontImageThumbnailUrl(obj.product)}/> :
                      <Avatar style={{
                        background: "white",
                        color: "grey",
                        fontSize: "25px",
                        height: "30px",
                        width: "30px",
                        marginRight: "15px"
                      }}>
                        <FileImageOutlined />
                      </Avatar>}
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