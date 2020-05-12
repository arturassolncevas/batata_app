import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { withRouter, Link, Redirect } from 'react-router-dom'
import { Form, Input, Button, Checkbox, Row, Col, Card, Select } from 'antd';
import { initialState } from './initialState'
import { injectIntl } from 'react-intl'
import ReactCountryFlag from "react-country-flag"
import countries from '../../locales/countries.json'

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

class Signup extends Component {

  constructor(props) {
    super(props)
    this.state = { ...initialState }
    this.formRef = React.createRef();
  }

  handleFormSubmit(values) {
    console.log(values)
    requestClient.post('/api/login', {
      ...values
    })
      .then(async (response) => {
        switch (response.status) {
          case 200:
            let { success: { token = "" } } = response.data
            localStorage.setItem("token", token)
            await this.props.signIn()
            this.props.history.push("/")
          default:
            break
        }
      })
      .catch((error) => {
        switch ((error.response || {}).status) {
          case 401:
            this.state.errors.general.message = this.props.intl.formatMessage({ id: 'pages.login.errors.wrong_credentials' })
            this.setState({ ...this.state })
            break;
          default:
            console.log(error)
            break
        }
      })
  }

  handleFormSubmitFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  };

  handleCountryChange(value) {
    this.state.formInitial.country = value
    this.setState({...this.state})
    console.log(value)
  };

  render() {
    return (
      <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col lg={6} >
          <Card title={this.props.intl.formatMessage({ id: 'pages.signup.header' })}>
            <div style={{ color: "red" }}>{this.state.errors.general.message}</div>
            <Form
              ref={this.formRef}
              {...layout}
              name="basic"
              initialValues={this.state.formInitial}
              onFinish={(e) => { this.handleFormSubmit(e) }}
              onFinishFailed={this.handleFormSubmitFailed}
            >
              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.name' })}
                name="name"
                validateStatus={this.state.errors.name.status}
                help={this.state.errors.name.message}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={this.props.intl.formatMessage({ id: 'pages.signup.company_name' })}
                name="company_name"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.email' })}
                name="email"
              >
                <Input value={"awdwa"}/>
              </Form.Item>

              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.country' })}
                name="country"
              >
                <Select onChange={(value) => { this.handleCountryChange(value) }}>
                  {countries.map((country, index) => {
                    return (
                      <Select.Option key={index} value={country.alias}>
                        <div><ReactCountryFlag countryCode={country.alias.toUpperCase()} />
                          {this.props.intl.formatMessage({ id: `countries.${country.name}` })}
                        </div>
                      </Select.Option>)
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.phone' })}
                name="phone"
              >
                <Input.Group compact>
                  <Input style={{ width: '30%' }} value={this.state.formInitial.country} disabled={false}/>
                  <Input style={{ width: "70%" }} />
                </Input.Group>
              </Form.Item>

              <Form.Item >
                <Row justify="end">
                  <Button type="primary" htmlType="submit">
                    {this.props.intl.formatMessage({ id: 'general.submit' })}
                  </Button>
                </Row>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row >
    )
  }
}

export default injectIntl(Signup)