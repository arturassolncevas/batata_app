import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Formik } from 'formik'
import { Form, Input, Button, Checkbox, Row, Col, Card } from 'antd';


const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

export default class LoginForm extends Component {

  constructor(props) {
    super(props)
    this.state = { formDefault: { email: 'email', password: 'password' }, errors: { name: { message: null, status: "success" } } }
    this.formRef = React.createRef();
  }

  handleFormSubmit(values) {
    let newState = { ...this.state }
    newState.errors.name = { status: "error", message: "Wrong username" }
    this.setState({ ...this.state, })
  }

  handleFormSubmitFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  };

  render() {
    return (
      <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col lg={6} >
          <Card title="Login">
            <Form
              ref={this.formRef}
              {...layout}
              name="basic"
              initialValues={this.state.formDefault}
              onFinish={(e) => { this.handleFormSubmit(e) }}
              onFinishFailed={this.handleFormSubmitFailed}
            >
              <Form.Item
                label="Email"
                name="email"
                validateStatus={this.state.errors.name.status}
                help={this.state.errors.name.message}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item
              >
                <Row justify="end">
                  <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                </Row>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    )
  }
}