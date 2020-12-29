import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Row, Col, Card, Select, PageHeader, Divider, Upload, Radio } from 'antd';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined, DropboxOutlined, LoadingOutlined } from '@ant-design/icons'
import { initialState } from './initialState'
import ReactCountryFlag from 'react-country-flag'
import { injectIntl } from 'react-intl'
import deepCopy from 'json-deep-copy'
import merge from 'deep-merge-js'
import { Editor } from '@tinymce/tinymce-react';


const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

class CompanyProfileSettings extends Component {

  constructor(props) {
    super(props)
    this.initialState = initialState
    this.state = deepCopy(initialState)
    this.form1Ref = React.createRef();
    this.form2Ref = React.createRef();
  }

  componentDidMount() {
    this.fetchInitialData()
  }

  async fetchInitialData() {
    let company_profile = await requestClient.get('/api/settings/company_profile').then(e => e.data)
    let countries = await requestClient.get('/api/countries').then(e => e.data)
    this.initialForm1 = deepCopy(company_profile)
    this.initialForm2 = deepCopy(company_profile)
    this.state.countries = countries
    this.state = {
      ...this.state,
      form1: { company_profile: company_profile },
      form2: { company_profile: company_profile }
    }
    this.setState(this.state, () => { 
      this.form1Ref.current.resetFields()
      this.form2Ref.current.resetFields()
    })
  }

  resetErrors() {
    this.setErrors()
  }

  setErrors(error = {}) {
    this.state.error = merge(deepCopy(this.initialState.error), error)
    this.setState({ ...this.state })
  }

  handleFormSubmit(values) {
    console.log(values)
  }

  handleForm2Submit(values) {
    requestClient.patch('/api/settings/company_profile', { ...values })
      .then(async (response) => {
        switch (response.status) {
          case 200:
            this.resetErrors()
            this.setState({ ...this.state, successfully_submitted: true, editEnabled: false })
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

  async handleOnImagesChange({ file, fileList }) {
  }

  async handleOnRemove(file) {
  }

  async uploadImage(props) {
  }

  render() {

    const uploadButton = (
      <div>
        {this.state.imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title={this.props.intl.formatMessage({ id: 'pages.companyProfileSettings.header' })}
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
        />
        <Divider className="site-devider after-header"></Divider>

        <Row>
          <Col xl={12} style={{ padding: "40px" }}>
            <Form
              ref={this.form1Ref}
              {...layout}
              name="basic"
              initialValues={this.state.form1}
              onFinish={(e) => { this.handleFormSubmit(e) }}
              className={`no-animation label-bold ${!this.state.editEnabled && "input-no-left-padding select-no-left-padding"}`}
            >
              <Card bordered={true}>
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.user.profile_image' })}
                  style={{ marginBottom: "0px" }}
                ></Form.Item>
                <ImgCrop rotate modalWidth={1000}>
                  <Upload
                    customRequest={(props) => { this.uploadImage(props) }}
                    listType="picture-card"
                    fileList={this.state.fileList}
                    onRemove={(props) => { this.handleOnRemove(props) }}
                  >
                    {this.state.fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                </ImgCrop>
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.address.zipcode' })}
                  name={["company", "description"]}
                  //getValueFromEvent={(e, a) => { console.log(e); return e.level.content; }}
                  required
                >
                  <Editor
                    apiKey="8bxnecm5zlwlq9uuisbtbm02h3evineipoekwyqpzxtyr045"
                    init={{
                      forced_root_block : "",
                      height: 300,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help'
                    }}
                  />
                </Form.Item>
              </Card>
            </Form>
          </Col>
          <Col xl={12} style={{ padding: "40px" }}>
            <Card bordered={true}>
              <Form
                ref={this.form2Ref}
                {...layout}
                name="basic"
                initialValues={this.state.form2}
                onFinish={(e) => { this.handleForm2Submit(e) }}
                className={`no-animation label-bold ${!this.state.editEnabled && "input-no-left-padding select-no-left-padding"}`}
              >
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.company.type' })}
                  name={["company_profile", "type"]}
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
                      name={["company_profile", "local_code"]}
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
                  name={["company_profile", "name"]}
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
                      name={["company_profile", "address", "country", "id"]}
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
                      name={["company_profile", "address", "phone"]}
                    >
                      <Input style={{ width: "70%" }} />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>

                <Row gutter={20}>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.address.email' })}
                      name={["company_profile", "address", "email"]}
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
                      name={["company_profile", "address", "address_1"]}
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
                      name={["company_profile", "address", "zipcode"]}
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
                      name={["company_profile", "address", "city"]}
                      required
                      validateStatus={this.state.error.errors.company.address.city && "error"}
                      help={this.state.error.errors.company.address.city && this.state.error.errors.company.address.city.join(', ')}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item >
                  <Row justify="end">
                    <Button type="primary" htmlType="submit">
                      {this.props.intl.formatMessage({ id: 'crud.create' })}
                    </Button>
                  </Row>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
        <Button onClick={() => { this.formRef.current.resetFields() }}>ss</Button>
      </div >
    )
  }
}

export default injectIntl(CompanyProfileSettings)