import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Row, Col, Card, Select, PageHeader, Divider, Radio } from 'antd';
import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import { initialState } from './initialState'
import { injectIntl } from 'react-intl'
import ReactCountryFlag from 'react-country-flag'
import merge from 'deep-merge-js'
import deepCopy from 'json-deep-copy'
import ReCAPTCHA from 'react-google-recaptcha'
import { NavLink } from 'react-router-dom'


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
    this.setState({ ...this.state, isFetching: false }, () => {
      this.formRef.current.setFieldsValue({ company: { address: { country: { id: this.state.countries[0].id } } } })
    })
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
          case 422:
            this.setErrors(error.response.data)
            this.recaptchaRef.current.reset()
            break
          default:
            break;
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
            {
              this.state.successfully_submitted &&
              <div style={{ textAlign: "center" }}>
                <div>{this.props.intl.formatMessage({ id: 'pages.signup.successfully_submitted' })}</div>
                <div>
                  <NavLink to={"/login"} >
                    <Button
                      style={{ width: "20%", marginTop: "2rem" }}
                      type="primary"
                    >
                      {this.props.intl.formatMessage({ id: 'general.continue' })}
                    </Button>

                  </NavLink>
                </div>
              </div>

            }
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

              <Row gutter={20}>
                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'general.email' })}
                    name={["user", "email"]}
                    required
                    validateStatus={this.state.error.errors.user.email && "error"}
                    help={this.state.error.errors.user.email && this.state.error.errors.user.email.join(', ')}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'general.name' })}
                    name={["user", "name"]}
                    required
                    validateStatus={this.state.error.errors.user.name && "error"}
                    help={this.state.error.errors.user.name && this.state.error.errors.user.name.join(', ')}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col lg={12}>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'general.password' })}
                    name={["user", "password"]}
                    required
                    validateStatus={this.state.error.errors.user.password && "error"}
                    help={this.state.error.errors.user.password && this.state.error.errors.user.password.join(', ')}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>

                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'general.repeat_password' })}
                    name={["user", "repeat_password"]}
                    required
                    validateStatus={this.state.error.errors.user.repeat_password && "error"}
                    help={this.state.error.errors.user.repeat_password && this.state.error.errors.user.repeat_password.join(', ')}
                  >
                    <Input.Password />
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
                label={this.props.intl.formatMessage({ id: 'models.company.type' })}
                name={["company", "type"]}
                required
                validateStatus={this.state.error.errors.company.type && "error"}
                help={this.state.error.errors.company.type && this.state.error.errors.company.type.join(', ')}
              >
                <Radio.Group >
                  <Radio value={"seller"}>{this.props.intl.formatMessage({ id: 'pages.signup.company.types.seller' })}</Radio>
                  <Radio value={"buyer"}>{this.props.intl.formatMessage({ id: 'pages.signup.company.types.buyer' })}</Radio>
                  <Radio value={"seller_and_buyer"}>{this.props.intl.formatMessage({ id: 'pages.signup.company.types.seller_and_buyer' })}</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label={this.props.intl.formatMessage({ id: 'pages.signup.company.local_code' })}
                required
                validateStatus={this.state.error.errors.company.local_code && "error"}
                help={this.state.error.errors.company.local_code && this.state.error.errors.company.local_code.join(', ')}
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
                validateStatus={this.state.error.errors.company.name && "error"}
                help={this.state.error.errors.company.name && this.state.error.errors.company.name.join(', ')}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={this.props.intl.formatMessage({ id: 'models.address.phone' })}
                required
                validateStatus={this.state.error.errors.company.address.phone && "error"}
                help={this.state.error.errors.company.address.phone && this.state.error.errors.company.address.phone.join(', ')}
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
                    name={["company", "email"]}
                    required
                    validateStatus={this.state.error.errors.company.email && "error"}
                    help={this.state.error.errors.company.email && this.state.error.errors.company.email.join(', ')}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'models.address.address' })}
                    name={["company", "address", "address_1"]}
                    required
                    validateStatus={this.state.error.errors.company.address.address_1 && "error"}
                    help={this.state.error.errors.company.address.address_1 && this.state.error.errors.company.address.address_1.join(', ')}
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
                    validateStatus={this.state.error.errors.company.address.zipcode && "error"}
                    help={this.state.error.errors.company.address.zipcode && this.state.error.errors.company.address.zipcode.join(', ')}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col lg={12}>
                  <Form.Item
                    label={this.props.intl.formatMessage({ id: 'models.address.city' })}
                    name={["company", "address", "city"]}
                    required
                    validateStatus={this.state.error.errors.company.address.city && "error"}
                    help={this.state.error.errors.company.address.city && this.state.error.errors.company.address.city.join(', ')}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="accept_terms_and_conditions"
                valuePropName="checked"
                validateStatus={this.state.error.errors.accept_terms_and_conditions && "error"}
                help={this.state.error.errors.accept_terms_and_conditions && this.state.error.errors.accept_terms_and_conditions.join(', ')}
              >
                <Checkbox>{this.props.intl.formatMessage({ id: 'pages.signup.accept_terms_and_conditions' })}</Checkbox>
              </Form.Item>
              <Form.Item
                style={{ marginTop: "2rem" }}
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