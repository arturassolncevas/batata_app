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

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file instanceof File || file instanceof Blob ? file : file.originFileObj);
    reader.onload = () => {
      let img = new Image();
      img.onload = function () {
        resolve({
          base64: this.width > 1000 ? resizeImage.resize(img, 1000, 1000) : reader.result,
          size: { width: this.width, height: this.height }
        })
      }
      img.src = reader.result
    }
    reader.onerror = error => reject(error);
  });
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
      form2: { company_profile: company_profile },
      fileList: company_profile.profile_image ? [company_profile.profile_image].map((e, i) => ({ uid: e.id, group_id: e.group_id, group_priority: e.group_priority, status: "done", url: e.url })) : []
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

  handleForm1Submit(values) {
    let data = values
    data.company_profile.description = ((values.company_profile.description || {}).level || {}).content || values.company_profile.description
    requestClient.patch('/api/settings/company_profile/secondary_data', data).then(async (response) => {
        switch (response.status) {
          case 200:
            this.setState({ ...this.state, form1EditEnabled: false, form1: { company_profile: response.data } }, () => { this.form1Ref.current.resetFields() })
            this.setErrors({ errors: { form2: this.state.error.errors.form2 } })
          default:
            break
        }
      })
      .catch((error) => {
        console.log(error)
        switch ((error.response || {}).status) {
          default:
            this.setErrors({
              errors: {
                form1: error.response.data.errors,
                form2: this.state.error.errors.form2,
              }
            })
            break
        }
      })
  }

  handleForm2Cancel() {
    this.state = { ...this.state, form2EditEnabled: false}
    this.setState(this.state)
    this.setErrors({ errors: { form1: this.state.error.errors.form1 }})
    this.form2Ref.current.resetFields()
  }

  handleForm1Cancel() {
    this.state = { ...this.state, form1EditEnabled: false}
    this.setState(this.state)
    this.setErrors({ errors: { form2: this.state.error.errors.form2 }})
    this.form1Ref.current.resetFields()
  }

  handleForm2Submit(values) {
    requestClient.patch('/api/settings/company_profile/primary_data', { ...values })
      .then(async (response) => {
        switch (response.status) {
          case 200:
            this.setState({ ...this.state, form2EditEnabled: false, form2: { company_profile: response.data } }, () => { this.form2Ref.current.resetFields() })
            this.setErrors({ errors: { form1: this.state.error.errors.form1 } })
          default:
            break
        }
      })
      .catch((error) => {
        switch ((error.response || {}).status) {
          default:
            this.setErrors({
              errors: {
                form1: this.state.error.errors.form1,
                form2: error.response.data.errors
              }
            })
            break
        }
      })
  }

  async handleOnImagesChange({ file, fileList }) {
  }

  async handleOnRemove(file) {
    requestClient.delete(`/api/company_files/delete_profile_image/${file.uid}`).then(async (response) => {
      const index = this.state.fileList.indexOf(file)
      this.state.fileList.splice(index, 1)
      this.setState(this.state)
    })
  }

  async uploadImage(props) {
    this.setState({ ...this.state, imageLoading: true })
    let lastFile = this.state.fileList[this.state.fileList.length - 1] || {}
    let data = { base64: await getBase64(props.file), }

    requestClient.post('/api/company_files/upload_profile_image', data)
      .then(async (response) => {
        switch (response.status) {
          case 201:
          case 200:
          default:
            let file = response.data
            this.state.fileList.push({ uid: file.id, status: "done", url: file.url })
            this.setState({ ...this.state, imageLoading: false })
            break
        }
      })
      .catch((error) => {
        switch ((error.response || {}).status) {
          case 422:
            this.setErrors(error.response.data)
            break
          default:
            break;
        }
      })
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
              name="basic"style={{height: "100%"}}
              initialValues={this.state.form1}
              onFinish={(e) => { this.handleForm1Submit(e) }}
              className={`no-animation label-bold ${!this.state.form1EditEnabled && "input-no-left-padding select-no-left-padding"}`}
            >
              <Card bordered={true} style={{height: "100%"}}>
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

                <Row gutter={20}>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.company.website_url' })}
                      name={["company_profile", "website_url"]}
                      validateStatus={this.state.error.errors.form1.company_profile.website_url && "error"}
                      help={this.state.error.errors.form1.company_profile.website_url && this.state.error.errors.form1.company_profile.website_url.join(', ')}
                    >
                      <Input
                        bordered={this.state.form1EditEnabled}
                        disabled={!this.state.form1EditEnabled}
                        placeholder={"http://"}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.company.facebook_url' })}
                      name={["company_profile", "facebook_url"]}
                      validateStatus={this.state.error.errors.form1.company_profile.facebook_url && "error"}
                      help={this.state.error.errors.form1.company_profile.facebook_url && this.state.error.errors.form1.company_profile.facebook_url.join(', ')}
                    >
                      <Input
                        bordered={this.state.form1EditEnabled}
                        disabled={!this.state.form1EditEnabled}
                        placeholder={"http://"}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.address.zipcode' })}
                  name={["company_profile", "description"]}
                  //getValueFromEvent={(e, a) => { console.log(e); return e.level.content; }}
                >
                  <Editor
                    apiKey="8bxnecm5zlwlq9uuisbtbm02h3evineipoekwyqpzxtyr045"
                    disabled={!this.state.form1EditEnabled}
                    init={{
                      forced_root_block: "",
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
                <Form.Item >
                  <Row justify="end">
                    {
                      this.state.form1EditEnabled ?
                        (<div><Button style={{ marginRight: "10px" }} onClick={() => this.handleForm1Cancel() }>
                          {this.props.intl.formatMessage({ id: 'crud.cancel' })}
                        </Button>
                          <Button type="primary" htmlType="submit">
                            {this.props.intl.formatMessage({ id: 'crud.save' })}
                          </Button></div>) :
                        <Button style={{ marginRight: "10px" }} onClick={() => { this.setState({ ...this.state, form1EditEnabled: true }) }} >
                          {this.props.intl.formatMessage({ id: 'crud.edit' })}
                        </Button>
                    }
                  </Row>
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
                className={`no-animation label-bold ${!this.state.form2EditEnabled && "input-no-left-padding select-no-left-padding"}`}
              >
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.company.type' })}
                  name={["company_profile", "type"]}
                  required={this.state.form2EditEnabled}
                  validateStatus={this.state.error.errors.form2.company_profile.type && "error"}
                  help={this.state.error.errors.form2.company_profile.type && this.state.error.errors.form2.company_profile.type.join(', ')}
                >
                  <Radio.Group disabled={!this.state.form2EditEnabled}>
                    <Radio value={"seller"}>{this.props.intl.formatMessage({ id: 'pages.signup.company.types.seller' })}</Radio>
                    <Radio value={"buyer"}>{this.props.intl.formatMessage({ id: 'pages.signup.company.types.buyer' })}</Radio>
                    <Radio value={"seller_and_buyer"}>{this.props.intl.formatMessage({ id: 'pages.signup.company.types.seller_and_buyer' })}</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'pages.signup.company.local_code' })}
                  required={this.state.form2EditEnabled}
                  validateStatus={this.state.error.errors.form2.company_profile.local_code && "error"}
                  help={this.state.error.errors.form2.company_profile.local_code && this.state.error.errors.form2.company_profile.local_code.join(', ')}
                >
                  <Input.Group compact>
                    <Form.Item
                      noStyle
                      name={["company_profile", "local_code"]}
                    >
                      <Input
                        bordered={this.state.form2EditEnabled}
                        disabled={!this.state.form2EditEnabled}
                      />
                    </Form.Item>
                    {
                    //this.state.form2EditEnabled && ( <Form.Item noStyle > <Button style={{ width: "20%" }} type="primary" onClick={() => { this.handleSearchLocalCodeClick() }} > {this.props.intl.formatMessage({ id: 'general.getData' })} </Button> </Form.Item>)
                    }

                  </Input.Group>
                </Form.Item>
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.company.name' })}
                  name={["company_profile", "name"]}
                  required={this.state.form2EditEnabled}
                  validateStatus={this.state.error.errors.form2.company_profile.name && "error"}
                  help={this.state.error.errors.form2.company_profile.name && this.state.error.errors.form2.company_profile.name.join(', ')}
                >
                  <Input
                    bordered={this.state.form2EditEnabled}
                    disabled={!this.state.form2EditEnabled}
                  />
                </Form.Item>
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.address.phone' })}
                  required={this.state.form2EditEnabled}
                  validateStatus={this.state.error.errors.form2.company_profile.address.phone && "error"}
                  help={this.state.error.errors.form2.company_profile.address.phone && this.state.error.errors.form2.company_profile.address.phone.join(', ')}
                >
                  <Input.Group compact>
                    <Form.Item
                      noStyle
                      name={["company_profile", "address", "country", "id"]}
                    >
                      <Select
                        style={{ width: '30%' }}
                        bordered={this.state.form2EditEnabled}
                        disabled={!this.state.form2EditEnabled}
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
                      <Input style={{ width: "70%" }}
                        bordered={this.state.form2EditEnabled}
                        disabled={!this.state.form2EditEnabled}
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>

                <Row gutter={20}>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.address.email' })}
                      name={["company_profile", "address", "email"]}
                      required={this.state.form2EditEnabled}
                      validateStatus={this.state.error.errors.form2.company_profile.address.email && "error"}
                      help={this.state.error.errors.form2.company_profile.address.email && this.state.error.errors.form2.company_profile.address.email.join(', ')}
                    >
                      <Input
                        bordered={this.state.form2EditEnabled}
                        disabled={!this.state.form2EditEnabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.address.address' })}
                      name={["company_profile", "address", "address_1"]}
                      required={this.state.form2EditEnabled}
                      validateStatus={this.state.error.errors.form2.company_profile.address.address_1 && "error"}
                      help={this.state.error.errors.form2.company_profile.address.address_1 && this.state.error.errors.form2.company_profile.address.address_1.join(', ')}
                    >
                      <Input
                        bordered={this.state.form2EditEnabled}
                        disabled={!this.state.form2EditEnabled}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.address.zipcode' })}
                      name={["company_profile", "address", "zipcode"]}
                      required={this.state.form2EditEnabled}
                      validateStatus={this.state.error.errors.form2.company_profile.address.zipcode && "error"}
                      help={this.state.error.errors.form2.company_profile.address.zipcode && this.state.error.errors.form2.company_profile.address.zipcode.join(', ')}
                    >
                      <Input
                        bordered={this.state.form2EditEnabled}
                        disabled={!this.state.form2EditEnabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.address.city' })}
                      name={["company_profile", "address", "city"]}
                      required={this.state.form2EditEnabled}
                      validateStatus={this.state.error.errors.form2.company_profile.address.city && "error"}
                      help={this.state.error.errors.form2.company_profile.address.city && this.state.error.errors.form2.company_profile.address.city.join(', ')}
                    >
                      <Input
                        bordered={this.state.form2EditEnabled}
                        disabled={!this.state.form2EditEnabled}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item >
                  <Row justify="end">
                    {
                      this.state.form2EditEnabled ?
                        (<div><Button style={{ marginRight: "10px" }} onClick={() => this.handleForm2Cancel() }>
                          {this.props.intl.formatMessage({ id: 'crud.cancel' })}
                        </Button>
                          <Button type="primary" htmlType="submit">
                            {this.props.intl.formatMessage({ id: 'crud.save' })}
                          </Button></div>) :
                        <Button style={{ marginRight: "10px" }} onClick={() => { this.setState({ ...this.state, form2EditEnabled: true }) }} >
                          {this.props.intl.formatMessage({ id: 'crud.edit' })}
                        </Button>
                    }
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