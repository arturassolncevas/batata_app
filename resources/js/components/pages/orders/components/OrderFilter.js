import React, { Component } from 'react'
import { Col, Row, Form, Select, Input, DatePicker, Space, Button } from 'antd';
import { injectIntl } from 'react-intl'
const { Option } = Select

function filter(inputValue, path) {
  return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

class OrderFilter extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef();
  }

  render() {
    return (
      <Form
        ref={this.formRef}
        initialValues={this.props.initialData}
        onFinish={(e) => { }}
        {...layout}
      >
        <Row>
          <Col>
            <Form.Item
              name="start_date"
              label="From"
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name="end_date"
              label="To"
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col>

            <Form.Item
              name="status"
              label="Status"
            >
              <Select
                defaultActiveFirstOption={undefined}
              >
                <Option value={undefined}></Option>
                <Option value="pending">{this.props.intl.formatMessage({ id: 'sort.date' })}</Option>
                <Option value="processing">{this.props.intl.formatMessage({ id: 'sort.price' })}</Option>
                <Option value="completed">{this.props.intl.formatMessage({ id: 'sort.price' })}</Option>
                <Option value="cancelled">{this.props.intl.formatMessage({ id: 'sort.price' })}</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col style={{ display: "flex", alignItems: "flex-end" }}>
            <Form.Item
              name="search_phrase"
            >
              <Input
                placeholder={"search"}
              />
            </Form.Item>

          </Col>
          <Col style={{ display: "flex", alignItems: "flex-end" }}>
            <Form.Item>
              <Button type="primary">Filter</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default injectIntl(OrderFilter)