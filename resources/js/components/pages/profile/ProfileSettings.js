import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Row, Col, Card, Select, PageHeader, Divider } from 'antd';
import { MenuFoldOutlined, MenufoldOutlined, ShoppingCartOutlined, DropboxOutlined, EditOutlined } from '@ant-design/icons'
import ReactCountryFlag from 'react-country-flag'
import { injectIntl } from 'react-intl'
import deepCopy from 'json-deep-copy'


const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

class ProfileSettings extends Component {

  constructor(props) {
    super(props)
    this.state = { countries: [], profileData: {}, deliveryAddress: {}, billingAddress: {}  }
  }

  componentDidMount() {
    this.fetchInitialData()
  }

  async fetchInitialData() {

    let countries = await requestClient.get('/api/languages')
    this.state.countries = countries.data
    this.setState(this.state)
    // let profileSettings = await requestClient.get('/profile/settings').data
    // this.state.profileSettings = profileSettings
    // this.setState(this.state)
  }

  resetErrors() {
    this.setErrors()
  }

  setErrors(error = {}) {
    // this.state.error = merge(deepCopy(this.initialState.error), error)
    // this.setState({ ...this.state })
  }

  handleFormSubmit(values) {
    // let captcha_value = this.recaptchaRef.current.getValue()
    // requestClient.post('/api/signup/requestor', {
    //   ...values, captcha_value
    // })
    //   .then(async (response) => {
    //     switch (response.status) {
    //       case 200:
    //         this.resetErrors()
    //         this.setState({ ...this.state, successfully_submitted: true })
    //       default:
    //         break
    //     }
    //   })
    //   .catch((error) => {
    //     switch ((error.response || {}).status) {
    //       default:
    //         this.setErrors(error.response.data)
    //         this.recaptchaRef.current.reset()
    //         break
    //     }
    //   })
  }

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title={this.props.intl.formatMessage({ id: 'pages.profileSettings.header' })}
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
        />
        <Divider className="site-devider after-header"></Divider>
        <Row>
          <Col xl={8} style={{ padding: "40px" }}>
          <Card bordered={true}>
          <Form
              ref={this.formRef}
              {...layout}
              name="basic"
              onFinish={(e) => { this.handleFormSubmit(e) }}
            >
              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.firstName' })}
                name="first_name"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.lastName' })}
                name="last_name"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.email' })}
                name="email"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.phone' })}
                name="phone"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.language' })}
                name="language"
              >
                <Select>
                  {this.state.countries.map((country) => {
                    return (
                      <Select.Option key={country.id} value={country.id}>
                        <div>
                          <ReactCountryFlag countryCode={country.code.toUpperCase()} style={{ marginRight: "10px" }}/>
                          {country.name}
                        </div>
                      </Select.Option>)
                  })}
                </Select>
              </Form.Item>
              <Row justify="end">
                <Button
                    style={{ marginRight: "10px" }}
                >
                  {this.props.intl.formatMessage({ id: 'crud.edit' })}
                </Button>
                <Button type="primary" htmlType="submit">
                  {this.props.intl.formatMessage({ id: 'crud.save' })}
                </Button>
              </Row>
            </Form>
            </Card>
          </Col>
        </Row>
      </div >
    )
  }
}

export default injectIntl(ProfileSettings)