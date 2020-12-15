import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Row, Col, Card, Select, PageHeader, Link, Divider } from 'antd';
import { ExclamationCircleOutlined, DropboxOutlined, PlusOutlined, SortDescendingOutlined, SortAscendingOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { initialState } from './initialState'
import { injectIntl } from 'react-intl'
import ReactCountryFlag from 'react-country-flag'
import merge from 'deep-merge-js'
import deepCopy from 'json-deep-copy'
import ReCAPTCHA from 'react-google-recaptcha'


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
    this.recaptchaRef = React.createRef();

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

  async handleSearchLocalCodeClick() {
    let { company: { local_code: localCode } } = this.formRef.current.getFieldsValue(["company"])
    let resp = await requestClient.get(`/api/signup/local-code?value=${localCode}`)
    console.log(resp.data)
    this.formRef.current.setFieldsValue(resp.data)
  }

  handleFormSubmit(values) {
    let captcha_value = this.recaptchaRef.current.getValue()
    requestClient.post('/api/signup/requestor', {
      ...values, captcha_value
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
            this.recaptchaRef.current.reset()
            break
        }
      })
  }

  handleCountryChange(id) {
    let country = this.state.countries.find((country) => country.id === id)
    this.formRef.current.setFieldsValue({ phone_area_country_id: country.id })
  };

  handleCaptchaChange(value) {
    this.setState({ ...this.state, captchaValue: value })
  }

  render() {
    return (
      <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col lg={8} >
          <Card title={this.props.intl.formatMessage({ id: 'pages.signup.header' })}>
            <div></div>
            {this.state.successfully_submitted && <div>{this.props.intl.formatMessage({ id: 'pages.signup.successfully_submitted' })}</div>}
            {!this.state.successfully_submitted && <Form
              ref={this.formRef}
              {...layout}
              name="basic"
              initialValues={this.state.initialForm}
              onFinish={(e) => { this.handleFormSubmit(e) }}
            >
              <PageHeader
                className="site-page-header"
                title={this.props.intl.formatMessage({ id: 'models.user.profile' })}
                avatar={{ icon: (<UserOutlined className="header-icon" />) }}
              />
              <Divider className="site-devider after-header"></Divider>
              <Row>
                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'general.email' })}
                    name="email"
                    required
                    validateStatus={this.state.error.errors.email && "error"}
                    help={this.state.error.errors.email && this.state.error.errors.email.join(', ')}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'general.firstName' })}
                    name="first_name"
                    required
                    validateStatus={this.state.error.errors.name && "error"}
                    help={this.state.error.errors.name && this.state.error.errors.name.join(', ')}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'general.lastName' })}
                    name="last_name"
                    required
                    validateStatus={this.state.error.errors.email && "error"}
                    help={this.state.error.errors.email && this.state.error.errors.email.join(', ')}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <PageHeader
                className="site-page-header"
                title={this.props.intl.formatMessage({ id: 'models.company.company' })}
                avatar={{ icon: (<HomeOutlined className="header-icon" />) }}
              />
              <Divider className="site-devider after-header"></Divider>
              <Form.Item
                label={this.props.intl.formatMessage({ id: 'pages.signup.company.local_code' })}
                required
              >
                <Input.Group compact>
                  <Form.Item
                    noStyle
                    name={["company", "local_code"]}
                  >
                    <Input
                      style={{ width: "80%" }}
                    />
                  </Form.Item>
                  <Form.Item
                    noStyle
                  >
                    <Button
                      style={{ width: "20%" }}
                      type="primary"
                      onClick={() => { this.handleSearchLocalCodeClick() }}
                    >
                      {this.props.intl.formatMessage({ id: 'general.getData' })}
                    </Button>
                  </Form.Item>

                </Input.Group>
              </Form.Item>
              <Form.Item
                label={this.props.intl.formatMessage({ id: 'models.company.name' })}
                name={["company", "name"]}
                required
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={this.props.intl.formatMessage({ id: 'models.address.phone' })}
                required
                validateStatus={this.state.error.errors.phone && "error"}
                help={this.state.error.errors.phone && this.state.error.errors.phone.join(', ')}
              >
                <Input.Group compact>
                  <Form.Item
                    noStyle
                    name={["company", "address", "country", "id"]}
                  >
                    <Select
                      style={{ width: '30%' }}
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
                    name={["company", "address", "phone"]}
                  >
                    <Input style={{ width: "70%" }} />
                  </Form.Item>
                </Input.Group>
              </Form.Item>

              <Row gutter={20}>
                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'models.address.email' })}
                    name={["company", "address", "email"]}
                    required
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'models.address.address' })}
                    name={["company", "address", "address_1"]}
                    required
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'models.address.zipcode' })}
                    name={["company", "address", "zipcode"]}
                    required
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'models.address.city' })}
                    name={["company", "address", "city"]}
                    required
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="accept_terms_and_conditions"
                required
                valuePropName="checked"
                validateStatus={this.state.error.errors.accept_terms_and_conditions && "error"}
                help={this.state.error.errors.accept_terms_and_conditions && this.state.error.errors.accept_terms_and_conditions.join(', ')}
              >
                <Checkbox>{this.props.intl.formatMessage({ id: 'pages.signup.accept_terms_and_conditions' })}</Checkbox>
              </Form.Item>
              <Form.Item
                name="captcha_value"
                validateStatus={this.state.error.errors.captcha_value && "error"}
                help={this.state.error.errors.captcha_value && this.state.error.errors.captcha_value.join(', ')}
              >
                <ReCAPTCHA
                  ref={this.recaptchaRef}
                  sitekey="6LcDK_gUAAAAAGR5tFJpgtWERSVU5ppBhgZBPjRM"
                  onChange={(value) => { this.handleCaptchaChange(value) }}
                />
              </Form.Item>
              <Form.Item >
                <Row justify="end">
                  <Button type="primary" htmlType="submit">
                    {this.props.intl.formatMessage({ id: 'crud.create' })}
                  </Button>
                </Row>
              </Form.Item>
            </Form>}
          </Card>
        </Col>
      </Row >
    )
  }
}

export default injectIntl(Signup)