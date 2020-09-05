import React, { Component } from 'react'
import { Row, Col, Card, Form, Input, InputNumber, Select, Switch, Button } from 'antd'
import qs from 'query-string';
import { withRouter } from 'react-router-dom'
import { getLastElement } from '../helpers/helper'
import { injectIntl } from 'react-intl'
import merge from 'deep-merge-js'
import { formatNumber } from '../../../shared/helpers/priceFormatter'

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

class WizardPage2 extends Component {
  constructor(props) {
    super(props)
    this.state = { measurementUnits: [], attributes: [], formattedPrice: null, formattedSalesLimits: null, formattedStockQuantity: null, error: {
      errors: { measurement_unit_id: null }
    } }
    this.formRef = React.createRef();
    this.props.setFormRef(this.formRef)
    this.selectedCategoryChain  = this.props.selectedCategoryChain
  }

  componentDidMount() {
    this.updateFormatted()
  }

  getCategoryChainPath(category) {
    let chain = category.parentschain || []
    let path = chain.map((e) => e.name).join(chain.length > 1 ? " > " : "")
    return path
  }

  updateFormatted() {
    this.handlePriceChange(() => this.handleLimitChange(this.setFormattedStockQuantity))
  }

  handlePriceChange(callback) {
    let formFields = this.formRef.current.getFieldsValue(["price", "measurement_unit_id", "quantity", "packed"])
    console.log(formFields)
    let price = new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(formFields.price)
    let quantity = new Intl.NumberFormat('da-DK').format(formFields.quantity)
    let unit = this.props.measurementUnits.find((e) => e.id === formFields.measurement_unit_id) || {}
    let formatted = `${price} / ${quantity}${unit.alias || ""}${formFields.packed ? " (pack)" : ""}`
    this.setState({ ...this.state, formattedPrice: formatted }, callback)
  }

  handleLimitChange(callback) {
    let formFields = this.formRef.current.getFieldsValue(["min_quantity", "max_quantity", "measurement_unit_id", "packed"])
    let unit = this.props.measurementUnits.find((e) => e.id === formFields.measurement_unit_id) || {}
    let min = `Min: ${formFields.min_quantity || "*"}${formFields.packed ? " (pack)" : (unit.alias || "")}`
    let max = `Max: ${formFields.max_quantity || "*"}${formFields.packed ? " (pack)" : (unit.alias || "")}`
    this.setState({ ...this.state, formattedSalesLimits: `${min} - ${max}` }, callback)
  }

  setFormattedStockQuantity() {
    let formFields = this.formRef.current.getFieldsValue(["measurement_unit_id", "packed", "quantity_in_stock"])
    let unit = this.props.measurementUnits.find((e) => e.id === formFields.measurement_unit_id) || {}
    let formatted = `${formFields.quantity_in_stock || 0}${formFields.packed ? " (packs)" : (unit.alias || "")}`
    this.setState({ ...this.state, formattedStockQuantity: formatted })
  }

  setErrors(error = {}) {
    this.props.setErrors(error)
  }

  resetErrors() {
    this.setErrors()
  }

  handleFormSubmit(values) {
    values.category_id = this.props.category.id
    values.product_attributes = (values.product_attributes || [])
      .map((e, i) => ({
        attribute_id: this.props.initialForm.product_attributes[i].attribute_id,
        option_id: e.option_id || null }))

    requestClient.post('/api/products/step_2', values)
      .then(async (response) => {
        switch (response.status) {
          case 200:
            this.resetErrors()
            this.props.handleWizardNext(3)
          default:
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
      <Row type="flex" justify="center" style={{ ...this.props.style }}  >
        <Col lg={14} >
          <Card>
            <Form
              ref={this.formRef}
              {...layout}
              name="basic"
              initialValues={this.props.initialForm}
              onFinish={(e) => { this.handleFormSubmit(e) }}
            >
              {/* Breadcrumbs category chain*/}

              {this.getCategoryChainPath(this.props.category)}

              {/* Custom attributes */}

              {this.props.attributes.map((e, index) => (
                <Form.Item 
                  required={!!e.required}
                  label={this.props.intl.formatMessage({ id: `general.attribute_names.${e.name}` })} key={e.id}
                  name={["product_attributes", index, 'option_id']}
                  validateStatus={this.props.error.errors.product_attributes[index] && "error"}
                  help={this.props.error.errors.product_attributes[index] && this.props.error.errors.product_attributes[index].join(', ')}
               >
                  <Select key={e.id}> {e.options.map(e => (<Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>))} </Select>
                </Form.Item>
              ))}

              {/* Is packed ? (Switch) */}

              <Form.Item
                label={this.props.intl.formatMessage({ id: `pages.new_product.price_per_pack_question` })}
                valuePropName="checked"
                name="packed"
              >
                <Switch
                  checkedChildren={"Yes"}
                  unCheckedChildren={"No"}
                  size={"large"}
                  onChange={() => { this.updateFormatted() }}
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
                    validateStatus={this.props.error.errors.price && "error"}
                    help={this.props.error.errors.price && this.props.error.errors.price.join(', ')}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={value => formatNumber.format(value, "kr")}
                      parser={value => formatNumber.parse(value)}
                      onChange={() => { this.handlePriceChange() }}
                    />
                  </Form.Item>
                  </Col>

                  <Col lg={8} >
                  <Form.Item
                    name="quantity"
                    validateStatus={this.props.error.errors.quantity && "error"}
                    help={this.props.error.errors.quantity && this.props.error.errors.quantity.join(', ')}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="Antal"
                      formatter={value => formatNumber.format(value)}
                      parser={value => formatNumber.parse(value, { int: true })}
                      onChange={() => { this.handlePriceChange() }}
                    />
                  </Form.Item>
                  </Col>

                  <Col lg={8} >
                    <Form.Item
                      name="measurement_unit_id"
                      validateStatus={this.props.error.errors.measurement_unit_id && "error"}
                      help={this.props.error.errors.measurement_unit_id && this.props.error.errors.measurement_unit_id.join(', ')}
                    >
                      <Select onChange={() => { this.updateFormatted() }} >
                        {this.props.measurementUnits.map(e => (<Select.Option key={e.id} value={e.id}>{e.alias}</Select.Option>))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              {/* Min Max Sales quantity */}
              <Form.Item
                label={`${this.props.intl.formatMessage({ id: `products.sales_limit` })} ${this.state.formattedSalesLimits}`}
              >
                <Row>
                  <Col lg={8} >
                    <Form.Item
                      name="min_quantity"
                      validateStatus={this.props.error.errors.min_quantity && "error"}
                      help={this.props.error.errors.min_quantity && this.props.error.errors.min_quantity.join(', ')}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Min"
                        onChange={() => { this.handleLimitChange() }}
                        parser={ value => formatNumber.parse(value, { int: true })}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={8} >
                    <Form.Item
                      name="max_quantity"
                      validateStatus={this.props.error.errors.max_quantity && "error"}
                      help={this.props.error.errors.max_quantity && this.props.error.errors.max_quantity.join(', ')}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Max"
                        onChange={() => { this.handleLimitChange() }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              {/* Currently in stock */}

                <Row>
                  <Col lg={8} >
                    <Form.Item
                      name="quantity_in_stock"
                      label={`${this.props.intl.formatMessage({ id: `products.quantity_in_stock` })} ${this.state.formattedStockQuantity}`}

                      validateStatus={this.props.error.errors.quantity_in_stock && "error"}
                      help={this.props.error.errors.quantity_in_stock && this.props.error.errors.quantity_in_stock.join(', ')}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        parser={ value => formatNumber.parse(value, { int: true })}
                        onChange={() => { this.setFormattedStockQuantity() }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              <Row justify="end">
                <Button type="primary" htmlType="submit">
                  {this.props.intl.formatMessage({ id: 'general.next' })}
                </Button>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    )
  }
}
export default injectIntl(withRouter(WizardPage2))