import React, { Component } from 'react'
import { Row, Col, Card, Form, Input, InputNumber, Select, Switch, Button, PageHeader, Divider } from 'antd'
import { withRouter } from 'react-router-dom'
import { initialState } from './initialStates/editProductInitialState'
import { DropboxOutlined, QqSquareFilled } from '@ant-design/icons';
import { injectIntl } from 'react-intl'
import deepCopy from 'json-deep-copy'
import qs from 'query-string';
import merge from 'deep-merge-js'

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

class ProductFormatter {
  constructor() {
    this.options = {
      priceFormat: "",
      quantityFormat: "",
      currencySymbol: ""
    }
  }

  formattedPrice({ price, quantity }) {
    let str = this.options.priceFormat;
    [
      ["<<price>>", price],
      ["<<quantity>>", quantity]
    ].forEach((e) => {
      str = str.replace(RegExp(e[0]), e[1])
    })
    return str
  }

  formattedQuantity({ quantity }) {
    let str = this.options.currencyFormat
    [
      ["<<quantity>>", quantity]
    ].forEach((e) => { str = str.replace(RegExp(e[0]), e[1]) })
    return str
  }

  setOptions({ currencySymbol, measurementUnitAlias, packed, intl }) {
    this.options = merge(this.options, { currencySymbol, measurementUnitAlias, packed })
    this.options.priceFormat = `<<price>> ${this.options.currencySymbol || ""}/ <<quantity>> ${this.options.measurementUnitAlias}`
    this.options.priceFormat += packed ? ` (${intl.formatMessage({ id: "general.pack" })})` : ""
    this.options.stockQuantityFormat = "<<quantity>> " + thi.options.packed ? `(${intl.formatMessage({ id: "general.packs" })})` : this.options.measurementUnitAlias
  }
}

class EditProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.initialState = initialState
    this.state = deepCopy(initialState)
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.fetchInitialData()
  }

  async fetchInitialData() {
    let id = this.props.match.params.id
    let resp_product = await requestClient.get(`/api/products/${id}`)
    let { category_id, measurement_unit, packed } = resp_product.data
    let resp_measurements = await requestClient.get(`/api/measurements?category_id=${category_id}`)
    this.productFormatter = new ProductFormatter()
    this.productFormatter.setOptions({ measurementUnitAlias: measurement_unit.alias, packed, intl: this.props.intl })
    this.initialState.initialForm = merge(this.initialState.initialForm, resp_product.data)
    this.setState({
      ...this.state,
      isFetching: false,
      initialForm: { ...this.initialState.initialForm },
      measurementUnits: resp_measurements.data,
      selectedMeasurementUnit: measurement_unit
    }, () => { this.formRef.current.resetFields() })
  }

  handlePriceChange(callback) {
    let formFields = this.formRef.current.getFieldsValue(["price", "quantity"])
    let formatted = this.productFormatter.formattedPrice({ price: currencyHelper.value(formFields.price).format(), quantity: formFields.quantity })
    this.state.formattedPrice = formatted
    this.setState({ ...this.state }, callback)
  }

  handleMeasurementUnitChange(value) {
    let selectedMeasurementUnit = this.state.measurementUnits.find(e => e.id === value)
    this.setState({ ...this.state, selectedMeasurementUnit }, () => { this.updateFormatted()})
  }

  updateFormatted() {
    let formFields = this.formRef.current.getFieldsValue(["quantity", "min_quantity", "max_quantity", "quantity_in_stock"])
    let formValues = Object.keys(formFields).map(e => {
      return formFields[e] ? { name: e, value: this.setParser(formFields[e].toString(), { checkIfPacked: e !== "quantity" }) } : null
    })
    var filtered = formValues.filter( el => el != null );
    this.formRef.current.setFields(filtered)
    this.handlePriceChange(() => this.handleLimitChange(this.setFormattedStockQuantity))
  }

  setParser(value, options = {}) {
    let decimalPoints = this.state.selectedMeasurementUnit.max_decimal_points
    if (options.checkIfPacked)
      decimalPoints = this.formRef.current.getFieldsValue(["packed"]).packed ? 0 : decimalPoints
    return numberHelper.parse(value, { maxDecimalPoints: decimalPoints || 0 })
  }

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title={this.props.intl.formatMessage({ id: 'pages.editProduct.header' })}
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
        />
        <Divider className="site-devider after-header"></Divider>

        <Row type="flex" justify="center" style={{ ...this.props.style }}  >
          <Col lg={14} >
            <Card>
              <Form
                ref={this.formRef}
                {...layout}
                name="basic"
                initialValues={this.state.initialForm}
                onFinish={() => { }}
              >

                {/* Is packed ? (Switch) */}

                <Form.Item
                  label={this.props.intl.formatMessage({ id: `pages.newProduct.pricePerPackQuestion` })}
                  valuePropName="checked"
                  name="packed"
                >
                  <Switch
                    checkedChildren={this.props.intl.formatMessage({ id: "general.yes" })}
                    unCheckedChildren={this.props.intl.formatMessage({ id: "general.no" })}
                    size={"large"}
                    onChange={() => { }}
                  />
                </Form.Item>

                {/* Price per units */}

                <Form.Item
                  required
                  label={`${this.props.intl.formatMessage({ id: `general.price` })} ${this.state.formattedPrice}`}
                >
                  <Row>
                    <Col lg={8} >
                      <Form.Item
                        name="price"
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          formatter={value => numberHelper.format(value, currencyHelper.options.symbol)}
                          parser={value => numberHelper.parse(value, { maxDecimalPoints: 2 })}
                          onChange={() => { this.handlePriceChange() }}
                        />
                      </Form.Item>
                    </Col>

                    <Col lg={8} >
                      <Form.Item
                        name="quantity"
                        validateStatus={this.state.error.errors.quantity && "error"}
                        help={this.state.error.errors.quantity && this.state.error.errors.quantity.join(', ')}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          placeholder="Antal"
                          formatter={value => numberHelper.format(value)}
                          parser={value => this.setParser(value)}
                          onChange={() => { this.handlePriceChange() }}
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={8} >
                      <Form.Item
                        name="measurement_unit_id"
                        validateStatus={this.state.error.errors.measurement_unit_id && "error"}
                        help={this.state.error.errors.measurement_unit_id && this.state.error.errors.measurement_unit_id.join(', ')}
                      >
                        <Select onChange={(val) => {  }} >
                          {this.state.measurementUnits.map(e => (<Select.Option key={e.id} value={e.id}>{e.alias}</Select.Option>))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
export default injectIntl(withRouter(EditProduct))