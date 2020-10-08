import React, { Component } from 'react'
import { Row, Col, Card, Form, Input, InputNumber, Select, Switch, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

class WizardPage2 extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedMeasurementUnit: {},  attributes: [], formattedPrice: null, formattedSalesLimits: null, formattedStockQuantity: null, error: {
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

  handleMeasurementUnitChange(value) {
    let selectedMeasurementUnit = this.props.measurementUnits.find(e => e.id === value)
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

  handlePriceChange(callback) {
    let formFields = this.formRef.current.getFieldsValue(["price", "measurement_unit_id", "quantity", "packed"])
    let price = currencyHelper.value(formFields.price).format()
    let quantity = formFields.quantity
    let unit = this.props.measurementUnits.find((e) => e.id === formFields.measurement_unit_id) || {}
    let formatted = `${price} / ${quantity}${unit.alias || ""}`
    formatted += formFields.packed ? ` (${this.props.intl.formatMessage({ id: "general.pack" })})` : ""
    this.setState({ ...this.state, formattedPrice: formatted }, callback)
  }

  handleLimitChange(callback) {
    let formFields = this.formRef.current.getFieldsValue(["min_quantity", "max_quantity", "measurement_unit_id", "packed"])
    let unit = this.props.measurementUnits.find((e) => e.id === formFields.measurement_unit_id) || {}
    let min = `${this.props.intl.formatMessage({ id: "general.min" })}: ${formFields.min_quantity || "*"}${formFields.packed ? " ("+this.props.intl.formatMessage({ id: "general.packs" })+")" : (unit.alias || "")}`
    let max = `${this.props.intl.formatMessage({ id: "general.max" })}: ${formFields.max_quantity || "*"}${formFields.packed ? " ("+this.props.intl.formatMessage({ id: "general.packs" })+")" : (unit.alias || "")}`
    this.setState({ ...this.state, formattedSalesLimits: `${min} - ${max}` }, callback)
  }

  setFormattedStockQuantity() {
    let formFields = this.formRef.current.getFieldsValue(["measurement_unit_id", "packed", "quantity_in_stock"])
    let unit = this.props.measurementUnits.find((e) => e.id === formFields.measurement_unit_id) || {}
    let formatted = `${formFields.quantity_in_stock || 0}${formFields.packed ? " ("+this.props.intl.formatMessage({ id: "general.packs" })+")" : (unit.alias || "")}`
    this.setState({ ...this.state, formattedStockQuantity: formatted })
  }

  setErrors(error = {}) {
    this.props.setErrors(error)
  }

  setParser(value, options = {}) {
    let decimalPoints = this.state.selectedMeasurementUnit.max_decimal_points
    if (options.checkIfPacked)
      decimalPoints = this.formRef.current.getFieldsValue(["packed"]).packed ? 0 : decimalPoints
    return numberHelper.parse(value, { maxDecimalPoints: decimalPoints || 0 })
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
                  label={e.name}
                  key={e.id}
                  name={["product_attributes", index, 'option_id']}
                  validateStatus={this.props.error.errors.product_attributes[index] && "error"}
                  help={this.props.error.errors.product_attributes[index] && this.props.error.errors.product_attributes[index].join(', ')}
               >
                  <Select key={e.id}> {e.options.map(e => (<Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>))} </Select>
                </Form.Item>
              ))}

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
                      formatter={value => numberHelper.format(value, currencyHelper.options.symbol)}
                      parser={value => numberHelper.parse(value, { maxDecimalPoints: 2 })}
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
                      formatter={value => numberHelper.format(value)}
                      parser={value => this.setParser(value)}
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
                      <Select onChange={(val) => { this.handleMeasurementUnitChange(val) }} >
                        {this.props.measurementUnits.map(e => (<Select.Option key={e.id} value={e.id}>{e.alias}</Select.Option>))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              {/* Min Max Sales quantity */}
              <Form.Item
                label={`${this.props.intl.formatMessage({ id: `models.product.salesLimit` })} ${this.state.formattedSalesLimits}`}
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
                        formatter={value => numberHelper.format(value)}
                        parser={value => this.setParser(value, { checkIfPacked: true })}
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
                        formatter={value => numberHelper.format(value)}
                        parser={value => this.setParser(value, { checkIfPacked: true })}
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
                      label={`${this.props.intl.formatMessage({ id: `models.product.quantityInStock` })} ${this.state.formattedStockQuantity}`}

                      validateStatus={this.props.error.errors.quantity_in_stock && "error"}
                      help={this.props.error.errors.quantity_in_stock && this.props.error.errors.quantity_in_stock.join(', ')}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        parser={ value => numberHelper.parse(value, { int: true })}
                        onChange={() => { this.setFormattedStockQuantity() }}
                        formatter={value => numberHelper.format(value)}
                        parser={value => this.setParser(value, { checkIfPacked: true })}
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