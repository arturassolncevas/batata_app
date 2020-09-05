import React, { Component } from 'react'
import { Col, AutoComplete, Input, InputNumber, Cascader, Button, Row, Form } from 'antd';
import { SearchOutlined, CaretDownOutlined, CarerUpOutlined, CaretUpOutlined } from '@ant-design/icons';
import { injectIntl } from 'react-intl'
import { formatNumber } from '../../shared/helpers/priceFormatter'

function onChange(value, selectedOptions) {
}

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

  handleAdvancedSearchClick() {
    this.setState({ ...this.state, advancedSearchOpened: !this.state.advancedSearchOpened })
  }

  render() {
    console.log(this.props)
    return (
      <Row style={{ flexDirection: "column" }}>
        <Row >
          <Col xl={8} >
            <Cascader
              style={{ width: "100%" }}
              options={this.props.categories}
              onChange={onChange}
              placeholder="Search product"
              showSearch={{ filter }}
              allowClear
              changeOnSelect
            >
            </Cascader>
          </Col>
          <Col>
            <Button type="primary" icon={<SearchOutlined />} style={{ padding: "4px 15px", width: "auto" }} />
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
          <Form
            ref={this.formRef}
            initialValues={{}}
            onFinish={(e) => {}}
            {...layout}
          >

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
          </Form>
        </Row>
      </Row>
    )
  }
}

export default injectIntl(ProductFilter)