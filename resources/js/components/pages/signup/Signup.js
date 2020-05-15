import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { withRouter, Link, Redirect } from 'react-router-dom'
import { Form, Input, Button, Checkbox, Row, Col, Card, Select } from 'antd';
import { initialState } from './initialState'
import { injectIntl } from 'react-intl'
import ReactCountryFlag from "react-country-flag"
import countries from '../../locales/countries.json'
import merge from 'deep-merge-js'
import deepCopy from 'json-deep-copy'
import update from 'immutability-helper';


const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

class Signup extends Component {

  constructor(props) {
    super(props)
    this.initialState = initialState
    this.state = deepCopy(initialState) 
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.fetchInitialData()
  }

  async fetchInitialData() {
    let countries = await requestClient.get('/api/countries')
    this.state.countries = countries.data
    this.state.country = (countries[0] || {}).id || ""
    this.setState({ ...this.state, isFetching: false })
  }

  resetErrors() {
    this.setErrors()
  }

  setErrors(error = {}) {
    this.state.error = merge(deepCopy(this.initialState.error), error)
    this.setState({ ...this.state })
  }

  handleFormSubmit(values) {
    requestClient.post('/api/signup/requestor', {
      ...values,
    })
      .then(async (response) => {
        switch (response.status) {
          case 200:
            this.resetErrors()
            this.setState({ ...this.state, successfully_submitted: true })
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

  handleCountryChange(id) {
    let country = this.state.countries.find((country) => country.id === id)
    this.formRef.current.setFieldsValue({ phone_area_country_id: country.id })
  };

  render() {
    return (
      <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col lg={6} >
          <Card title={this.props.intl.formatMessage({ id: 'pages.signup.header' })}>
            { this.state.successfully_submitted && <div>{this.props.intl.formatMessage({ id: 'pages.signup.successfully_submitted' })}</div> }
            { !this.state.successfully_submitted && <Form
              ref={this.formRef}
              {...layout}
              name="basic"
              initialValues={this.state.initialForm}
              onFinish={(e) => { this.handleFormSubmit(e) }}
            >
              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.name' })}
                name="name"
                required
                validateStatus={this.state.error.errors.name && "error"}
                help={this.state.error.errors.name && this.state.error.errors.name.join(', ')}
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
                required
                validateStatus={this.state.error.errors.email && "error"}
                help={this.state.error.errors.email && this.state.error.errors.email.join(', ')}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.country' })}
                name="country_id"
                required
                validateStatus={this.state.error.errors.country_id && "error"}
                help={this.state.error.errors.country_id}
              >
                <Select
                  onChange={(value) => { this.handleCountryChange(value) }}>
                  {this.state.countries.map((country) => {
                    return (
                      <Select.Option key={country.id} value={country.id}>
                        <div><ReactCountryFlag countryCode={country.code.toUpperCase()} />
                          {this.props.intl.formatMessage({ id: `countries.${country.name}` })}
                        </div>
                      </Select.Option>)
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.phone' })}
                required
                validateStatus={this.state.error.errors.phone && "error"}
                help={this.state.error.errors.phone && this.state.error.errors.phone.join(', ')}
              >
                <Input.Group compact>
                  <Form.Item
                    noStyle
                    name="phone_area_country_id"
                  >
                    <Select
                      style={{ width: '30%' }}
                      name="phone_area_country_id"
                    >
                      {this.state.countries.map((country) => {
                        return (
                          <Select.Option key={country.area_code} value={country.id}>
                            <div><ReactCountryFlag countryCode={country.code.toUpperCase()} />
                              {country.area_code}
                            </div>
                          </Select.Option>)
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'general.phone' })}
                    noStyle
                    name="phone"
                  >
                    <Input style={{ width: "70%" }} />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
              <Form.Item
                name="accept_terms_and_conditions"
                required
                valuePropName="checked"
                validateStatus={this.state.error.errors.accept_terms_and_conditions && "error"}
                help={this.state.error.errors.accept_terms_and_conditions && this.state.error.errors.accept_terms_and_conditions.join(', ')}
              >
                <Checkbox>{this.props.intl.formatMessage({ id: 'pages.signup.accept_terms_and_conditions' })}</Checkbox>
              </Form.Item>
              <Form.Item >
                <Row justify="end">
                  <Button type="primary" htmlType="submit">
                    {this.props.intl.formatMessage({ id: 'general.submit' })}
                  </Button>
                </Row>
              </Form.Item>
            </Form> }
          </Card>
        </Col>
      </Row >
    )
  }
}

export default injectIntl(Signup)