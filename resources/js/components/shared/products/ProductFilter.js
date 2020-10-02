import React, { Component } from 'react'
import { Col, AutoComplete, Input, InputNumber, Cascader, Button, Row, Form, Select } from 'antd';
import { SearchOutlined, CaretDownOutlined, CarerUpOutlined, CaretUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { injectIntl } from 'react-intl'
import { formatNumber } from '../../shared/helpers/priceFormatter'
import qs2 from 'query-string';
import qs from 'qs';

function filter(inputValue, path) {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

class ProductFilter extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef();
    this.state = { advancedSearchOpened: true, attributes: [] }
  }

  componentDidMount() {
    this.setQueryValues()
  }

  setQueryValues() {
    let queryObject = qs.parse(this.props.history.location.search.replace("?", ""))

    this.formRef.current.setFieldsValue(queryObject)
    if (queryObject.category_id) {
      let id = queryObject.category_id[queryObject.category_id.length - 1]
      this.fetchAttributes(id)
    }

  }

  handleAdvancedSearchClick() {
    this.setState({ ...this.state, advancedSearchOpened: !this.state.advancedSearchOpened })
  }

  async handleCategoryChange(value, options) {
    let category = options.pop()
    this.fetchAttributes(category.id)
  }

  async fetchAttributes(category_id) {
    let resp_attributes = await requestClient.get(`/api/attributes?category_id=${category_id}`)
    this.setState({ ...this.state, attributes: resp_attributes.data}) 
  }

  async handleSearch() {
    let formValues = this.formRef.current.getFieldsValue()
    let data = {
      ...formValues,
    }
    
    data.product_attributes = (data.product_attributes || [])
      .map((e, i) => ({
        attribute_id: this.state.attributes[i].id,
        option_id: e.option_id || null }))

    console.log(data)
    console.log(qs.stringify(data))
    this.props.history.push(`/products?${qs.stringify(data)}`)
    await this.props.callback(data)
  }


  render() {
    return (
      <Form
        ref={this.formRef}
        initialValues={this.state.forma}
        onFinish={(e) => { }}
        {...layout}
      >

        <Row >
          <Col xl={8} >
            <Form.Item
              name="category_id"
              valuePropName="value"
              style={{marginBottom: '0px'}}
            >
              <Cascader
                style={{ width: "100%" }}
                options={this.props.categories}
                onChange={(val, options) => { this.handleCategoryChange(val, options) }}
                placeholder={this.props.intl.formatMessage({ id: "shared.productFilter.searchCategory" })}
                showSearch={{ filter }}
                allowClear
                changeOnSelect
              >
              </Cascader>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              style={{marginBottom: '0px'}}
            >
              <Button type="primary" icon={<SearchOutlined />} style={{ padding: "4px 15px", width: "auto" }} onClick={() => { this.handleSearch() }} />
            </Form.Item>
          </Col>
          <Col
            className="primary-color"
            onClick={() => { this.handleAdvancedSearchClick() }}
            style={{
              display: 'flex',
              alignItems: "center",
              padding: "0 15px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          > 
            {this.props.intl.formatMessage({ id: 'shared.productFilter.advancedSearch' })}
            {this.state.advancedSearchOpened ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Col>
        </Row>

        <Row style={{ display: !this.state.advancedSearchOpened && "none" }}>
          <Col>
          <Form.Item
            label={this.props.intl.formatMessage({ id: 'shared.productFilter.price.name' })}
            name="price_to"
          >
            <Input.Group compact>
              <Form.Item
                name="price_from"
              >
                <InputNumber
                  placeholder={this.props.intl.formatMessage({ id: 'shared.productFilter.price.min' })}
                  formatter={value => formatNumber.format(value)}
                  parser={value => formatNumber.parse(value)}
                  min={0}
                />
              </Form.Item>
              &nbsp;
              -
              &nbsp;
              <Form.Item
                name="price_to"
              >
                <InputNumber
                  placeholder={this.props.intl.formatMessage({ id: 'shared.productFilter.price.max' })}
                  formatter={value => formatNumber.format(value)}
                  parser={value => formatNumber.parse(value)}
                  min={0}
                />
              </Form.Item>

            </Input.Group>
          </Form.Item>
              {this.state.attributes.map((e, index) => (
                <Form.Item 
                  required={!!e.required}
                  label={e.name} key={e.id}
                  name={["product_attributes", index, 'option_id']}
                  // validateStatus={this.props.error.errors.product_attributes[index] && "error"}
                  // help={this.props.error.errors.product_attributes[index] && this.props.error.errors.product_attributes[index].join(', ')}
               >
                  <Select key={e.id}> {e.options.map(e => (<Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>))} </Select>
                </Form.Item>
              ))}
          </Col>
        </Row>
      </Form>
    )
  }
}

export default injectIntl(ProductFilter)