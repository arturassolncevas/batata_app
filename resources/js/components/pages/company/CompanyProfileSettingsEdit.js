import React, { Component } from 'react'
import { Affix, Anchor, Form, Input, Button, Checkbox, Row, Col, Card, Select, PageHeader, Divider, Upload, Radio } from 'antd';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined, DropboxOutlined, LoadingOutlined } from '@ant-design/icons'
import { initialState } from './initialState'
import ReactCountryFlag from 'react-country-flag'
import { injectIntl } from 'react-intl'
import deepCopy from 'json-deep-copy'
import merge from 'deep-merge-js'
import { Editor } from '@tinymce/tinymce-react';
import resizeImage from 'resize-image'
const { Link } = Anchor;



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

class CompanyProfileSettingsEdit extends Component {

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
    let company_profile = await requestClient.get('/api/settings/company_profile').then(e => e.data)
    let countries = await requestClient.get('/api/countries').then(e => e.data)
    this.initialForm = deepCopy(company_profile)
    this.state.countries = countries
    this.state = {
      ...this.state,
      company_id: company_profile.id,
      form: { company_profile: company_profile },
      profileImageList: company_profile.profile_image ? [company_profile.profile_image].map((e, i) => ({ uid: e.id, group_id: e.group_id, group_priority: e.group_priority, status: "done", url: e.url })) : [],
      featureImageList: company_profile.feature_images ? company_profile.feature_images.map((e, i) => ({ uid: e.id, group_id: e.group_id, group_priority: e.group_priority, status: "done", url: e.url })) : []
    }
    this.setState(this.state, () => {
      this.formRef.current.resetFields()
    })
  }

  resetErrors() {
    this.setErrors()
  }

  setErrors(error = {}) {
    this.state.error = merge(deepCopy(this.initialState.error), error)
    this.setState({ ...this.state })
  }

  handleFormCancel() {
  }

  handleFormSubmit(values) {
    values.company_profile.description = ((values.company_profile.description || {}).level || {}).content || values.company_profile.description
    requestClient.patch('/api/settings/company_profile/primary_data', { ...values })
      .then(async (response) => {
        switch (response.status) {
          case 200:
            this.setState({ ...this.state, formEditEnabled: false, form: { company_profile: response.data } }, () => { this.props.history.push("/settings/profile") })
          default:
            break
        }
      })
      .catch((error) => {
        switch ((error.response || {}).status) {
          default:
            this.setErrors({
              errors: {
                form: error.response.data.errors
              }
            })
            break
        }
      })
  }

  async handleOnFeatureImagesChange({ file, fileList }) {
    console.log(this.state)
    if (file.status === "removed") {
      requestClient.delete(`/api/company_files/delete_feature_image/${file.uid}`).then(async (response) => {
        this.state.featureImageList = fileList
        this.setState(this.state)
      })
    }
  }

  async handleOnFeatureImageRemove(file) {
    requestClient.delete(`/api/company_files/delete_feature_image/${file.uid}`).then(async (response) => {
      const index = this.state.featureImageList.findIndex((e) => e.uid == file.uid)
      console.log(index)
      if (index > -1)
        this.state.featureImageList.splice(index, 1)
      this.setState(this.state)
    })
  }

  async handleOnRemove(file) {
    requestClient.delete(`/api/company_files/delete_profile_image/${file.uid}`).then(async (response) => {
      const index = this.state.profileImageList.indexOf(file)
      this.state.profileImageList.splice(index, 1)
      this.setState(this.state)
    })
  }


  async uploadFeatureImage(props) {
    this.setState({ ...this.state, imageLoading: true })
    let lastFile = this.state.featureImageList[this.state.featureImageList.length - 1] || {}
    let data = { base64: await getBase64(props.file), company_id: this.state.company_id, group_priority: (lastFile.group_priority || 0) + 1 }

    requestClient.post('/api/company_files/upload_feature_image', data)
      .then(async (response) => {
        switch (response.status) {
          case 201:
          case 200:
          default:
            let file = response.data
            this.state.featureImageList.push({ uid: file.id, status: "done", url: file.url })
            this.setState({ ...this.state, imageLoading: false }, () => { console.log(this.state) })
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

  async uploadProfileImage(props) {
    this.setState({ ...this.state, imageLoading: true })
    let lastFile = this.state.profileImageList[this.state.profileImageList.length - 1] || {}
    let data = { base64: await getBase64(props.file), }

    requestClient.post('/api/company_files/upload_profile_image', data)
      .then(async (response) => {
        switch (response.status) {
          case 201:
          case 200:
          default:
            let file = response.data
            this.state.profileImageList.push({ uid: file.id, status: "done", url: file.url })
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
          <Col xl={4} style={{ padding: "40px" }}>
            <Affix offsetTop={320}>
              <Anchor>
                <Link href="#basic-info" title={this.props.intl.formatMessage({ id: 'models.user.profile' })} />
                <Link href="#about-form" title={this.props.intl.formatMessage({ id: 'models.company.about_form' })} />
                <Link href="#business-info" title={this.props.intl.formatMessage({ id: 'models.company.business_info' })} />
                <Link href="#social-links" title={this.props.intl.formatMessage({ id: 'models.company.social_links' })} />
              </Anchor>
            </Affix>
          </Col>
          <Col xl={12} style={{ padding: "40px" }}>
            <Form
              ref={this.formRef}
              {...layout}
              name="basic" style={{ height: "100%" }}
              initialValues={this.state.form}
              onFinish={(e) => { this.handleFormSubmit(e) }}
            >
              <div id="basic-info" className=""data-scrollama-index="1">{this.props.intl.formatMessage({ id: 'models.user.profile' })}</div>
              <Card>
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.user.profile_image' })}
                  style={{ marginBottom: "0px" }}
                ></Form.Item>
                <ImgCrop rotate modalWidth={1000}>
                  <Upload
                    customRequest={(props) => { this.uploadProfileImage(props) }}
                    listType="picture-card"
                    fileList={this.state.profileImageList}
                    onRemove={(props) => { this.handleOnRemove(props) }}
                  >
                    {this.state.profileImageList.length >= 1 ? null : uploadButton}
                  </Upload>
                </ImgCrop>

                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.company.name' })}
                  name={["company_profile", "name"]}
                  required
                  validateStatus={this.state.error.errors.form.company_profile.name && "error"}
                  help={this.state.error.errors.form.company_profile.name && this.state.error.errors.form.company_profile.name.join(', ')}
                >
                  <Input
                  />
                </Form.Item>
              </Card>
              <div id="about-form" data-scrollama-index="2" style={{ marginTop: "30px" }}>{this.props.intl.formatMessage({ id: 'general.about' })}</div>
              <Card >
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.product.images' })}
                  style={{ marginBottom: "0px" }}
                ></Form.Item>
                <ImgCrop rotate modalWidth={1000}>
                  <Upload
                    //action={(file) => (this.uploadImage(file))}
                    customRequest={(props) => { this.uploadFeatureImage(props) }}
                    listType="picture-card"
                    fileList={this.state.featureImageList}
                    //onPreview={(file) => { this.handlePreview(file) }}
                    onRemove={(props) => { this.handleOnFeatureImageRemove(props) }}
                  >
                    {this.state.featureImageList.length >= 8 ? null : uploadButton}
                  </Upload>
                </ImgCrop>

                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'general.description' })}
                  name={["company_profile", "description"]}
                //getValueFromEvent={(e, a) => { console.log(e); return e.level.content; }}
                >
                  <Editor
                    apiKey="8bxnecm5zlwlq9uuisbtbm02h3evineipoekwyqpzxtyr045"
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

              </Card>
              <div id="business-info" data-scrollama-index="3" style={{ marginTop: "30px" }}>{this.props.intl.formatMessage({ id: 'models.company.business_info' })}</div>
              <Card>
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.company.type' })}
                  name={["company_profile", "type"]}
                  required
                  validateStatus={this.state.error.errors.form.company_profile.type && "error"}
                  help={this.state.error.errors.form.company_profile.type && this.state.error.errors.form.company_profile.type.join(', ')}
                >
                  <Radio.Group>
                    <Radio value={"seller"}>{this.props.intl.formatMessage({ id: 'pages.signup.company.types.seller' })}</Radio>
                    <Radio value={"buyer"}>{this.props.intl.formatMessage({ id: 'pages.signup.company.types.buyer' })}</Radio>
                    <Radio value={"seller_and_buyer"}>{this.props.intl.formatMessage({ id: 'pages.signup.company.types.seller_and_buyer' })}</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'pages.signup.company.local_code' })}
                  required
                  validateStatus={this.state.error.errors.form.company_profile.local_code && "error"}
                  help={this.state.error.errors.form.company_profile.local_code && this.state.error.errors.form.company_profile.local_code.join(', ')}
                >
                  <Input.Group compact>
                    <Form.Item
                      noStyle
                      name={["company_profile", "local_code"]}
                    >
                      <Input
                      />
                    </Form.Item>
                    {
                      //this.state.formEditEnabled && ( <Form.Item noStyle > <Button style={{ width: "20%" }} type="primary" onClick={() => { this.handleSearchLocalCodeClick() }} > {this.props.intl.formatMessage({ id: 'general.getData' })} </Button> </Form.Item>)
                    }

                  </Input.Group>
                </Form.Item>
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.address.phone' })}
                  required
                  validateStatus={this.state.error.errors.form.company_profile.address.phone && "error"}
                  help={this.state.error.errors.form.company_profile.address.phone && this.state.error.errors.form.company_profile.address.phone.join(', ')}
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
                      <Input style={{ width: "70%" }}
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>

                <Row gutter={20}>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.address.email' })}
                      name={["company_profile", "address", "email"]}
                      required
                      validateStatus={this.state.error.errors.form.company_profile.address.email && "error"}
                      help={this.state.error.errors.form.company_profile.address.email && this.state.error.errors.form.company_profile.address.email.join(', ')}
                    >
                      <Input
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.address.address' })}
                      name={["company_profile", "address", "address_1"]}
                      required
                      validateStatus={this.state.error.errors.form.company_profile.address.address_1 && "error"}
                      help={this.state.error.errors.form.company_profile.address.address_1 && this.state.error.errors.form.company_profile.address.address_1.join(', ')}
                    >
                      <Input
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.address.zipcode' })}
                      name={["company_profile", "address", "zipcode"]}
                      required
                      validateStatus={this.state.error.errors.form.company_profile.address.zipcode && "error"}
                      help={this.state.error.errors.form.company_profile.address.zipcode && this.state.error.errors.form.company_profile.address.zipcode.join(', ')}
                    >
                      <Input
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.address.city' })}
                      name={["company_profile", "address", "city"]}
                      required
                      validateStatus={this.state.error.errors.form.company_profile.address.city && "error"}
                      help={this.state.error.errors.form.company_profile.address.city && this.state.error.errors.form.company_profile.address.city.join(', ')}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <div id="social-links" data-scrollama-index="4" style={{ marginTop: "30px" }}>{this.props.intl.formatMessage({ id: 'models.company.social_links' })}</div>
              <Card>
                <Row gutter={20}>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.company.website_url' })}
                      name={["company_profile", "website_url"]}
                      validateStatus={this.state.error.errors.form.company_profile.website_url && "error"}
                      help={this.state.error.errors.form.company_profile.website_url && this.state.error.errors.form.company_profile.website_url.join(', ')}
                    >
                      <Input
                        placeholder={"http://"}
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.company.facebook_url' })}
                      name={["company_profile", "facebook_url"]}
                      validateStatus={this.state.error.errors.form.company_profile.facebook_url && "error"}
                      help={this.state.error.errors.form.company_profile.facebook_url && this.state.error.errors.form.company_profile.facebook_url.join(', ')}
                    >
                      <Input
                        placeholder={"http://"}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col lg={12}>
                    <Form.Item
                      label={this.props.intl.formatMessage({ id: 'models.company.instagram_url' })}
                      name={["company_profile", "instagram_url"]}
                      validateStatus={this.state.error.errors.form.company_profile.instagram_url && "error"}
                      help={this.state.error.errors.form.company_profile.instagram_url && this.state.error.errors.form.company_profile.instagram_url.join(', ')}
                    >
                      <Input
                        placeholder={"http://"}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Form.Item >
                <Row justify="end">
                  <Button
                    onClick={ () => { this.props.history.push("/settings/profile") } }
                  >
                    {this.props.intl.formatMessage({ id: 'crud.cancel' })}
                  </Button>
                  <Button type="primary" htmlType="submit">
                    {this.props.intl.formatMessage({ id: 'crud.save' })}
                  </Button>
                </Row>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div >
    )
  }
}

export default injectIntl(CompanyProfileSettingsEdit)