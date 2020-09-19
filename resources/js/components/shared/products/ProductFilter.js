import React, { Component } from 'react'
import { Col, AutoComplete, Input, InputNumber, Cascader, Button, Row, Form } from 'antd';
import { SearchOutlined, CaretDownOutlined, CarerUpOutlined, CaretUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { injectIntl } from 'react-intl'
import { formatNumber } from '../../shared/helpers/priceFormatter'
import qs from 'query-string';
import { FormContext } from 'antd/lib/form/context';

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
    this.state = { advancedSearchOpened: true }

  }

  componentDidMount() {
    this.setQueryValues()
  }

  setQueryValues() {
    let queryObject = qs.parse(this.props.history.location.search)
    this.formRef.current.setFieldsValue(queryObject)
  }

  handleAdvancedSearchClick() {
    this.setState({ ...this.state, advancedSearchOpened: !this.state.advancedSearchOpened })
  }

  handleCategoryChange(value, options) {
    let category = options.pop()
    this.setState({ ...this.state, category: category || {} })
  }

  async handleSearch() {
    let formValues = this.formRef.current.getFieldsValue()
    let data = {
      ...formValues,
    }
    this.props.history.push(`/products?${qs.stringify(data)}`)
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
                placeholder="Search product"
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
          > Advanced search
            {this.state.advancedSearchOpened ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </Col>
        </Row>

        <Row style={{ display: !this.state.advancedSearchOpened && "none" }}>
          <Form.Item
            label={this.props.intl.formatMessage({ id: 'searchFilter.price.name' })}
            name="price_to"
          >
            <Input.Group compact>
              <Form.Item
                name="price_from"
              >
                <InputNumber
                  placeholder={this.props.intl.formatMessage({ id: 'searchFilter.price.min' })}
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
                  placeholder={this.props.intl.formatMessage({ id: 'searchFilter.price.max' })}
                  formatter={value => formatNumber.format(value)}
                  parser={value => formatNumber.parse(value)}
                  min={0}
                />
              </Form.Item>

            </Input.Group>
          </Form.Item>
        </Row>
      </Form>
    )
  }
}

export default injectIntl(ProductFilter)