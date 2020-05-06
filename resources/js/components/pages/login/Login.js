import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {withRouter} from 'react-router-dom'
import { Formik } from 'formik'
import { Form, Input, Button, Checkbox, Row, Col, Card } from 'antd';
import { initialState } from './initialState'


const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

export default class LoginForm extends Component {

  constructor(props) {
    super(props)
    this.state = { ...initialState }
    this.formRef = React.createRef();
  }

  handleFormSubmit(values) {
    axios.post('/api/login', {
      ...values
    })
    .then(function (response) {
      switch(error.response.status) {
        case 200:
          this.props.history.push("/home")
        default:
          break
      }
    })
    .catch((error) => {
      switch(error.response.status) {
        case 401:
          this.state.errors.general.message = "Wrong username or password"
          this.setState({ ...this.state })
          this.props.history.push("/home")
        default:
          break
      }
    })
  }

  handleFormSubmitFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to = {{ pathname: "/home" }} />;
    }
    return (
      <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col lg={6} >
          <Card title="Login">
            <div style={{color: "red"}}>{ this.state.errors.general.message }</div>
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