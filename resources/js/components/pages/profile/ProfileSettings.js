import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Row, Col, Card, Select, PageHeader, Divider, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { PlusOutlined, DropboxOutlined, LoadingOutlined } from '@ant-design/icons'
import { initialState } from './initialState'
import ReactCountryFlag from 'react-country-flag'
import { injectIntl } from 'react-intl'
import deepCopy from 'json-deep-copy'
import merge from 'deep-merge-js'


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

class ProfileSettings extends Component {

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

    let profile = await requestClient.get('/api/settings/profile').then(e => e.data)
    let languages = await requestClient.get('/api/languages').then(e => e.data)
    let countries = await requestClient.get('/api/countries').then(e => e.data)
    this.initialForm = deepCopy(profile)
    this.state.countries = countries
    this.state.languages = languages
    this.state.initialForm = { profile: { ...profile, area_code: profile.area_code || "+45" } }
    //TODO
    //description:
    //Pretty much reused image code from products. Rewrite to a single file instead of an array.
    this.state.fileList = profile.profile_image ? [profile.profile_image].map((e, i) => ({ uid: e.id, group_id: e.group_id, group_priority: e.group_priority, status: "done", url: e.url })) : []
    this.setState(this.state, () => { this.formRef.current.resetFields() })
  }

  resetErrors() {
    this.setErrors()
  }

  setErrors(error = {}) {
    this.state.error = merge(deepCopy(this.initialState.error), error)
    this.setState({ ...this.state })
  }

  handleFormSubmit(values) {
    requestClient.patch('/api/settings/profile', {
      ...values
    })
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
    console.log("here")
    requestClient.delete(`/api/user_files/delete_profile_image/${file.uid}`).then(async (response) => {
      const index = this.state.fileList.indexOf(file)
      this.state.fileList.splice(index, 1)
      this.setState(this.state)
    })

  }

  async uploadImage(props) {
    this.setState({ ...this.state, imageLoading: true })
    let lastFile = this.state.fileList[this.state.fileList.length - 1] || {}
    let data = { base64: await getBase64(props.file), }

    requestClient.post('/api/user_files/upload_profile_image', data)
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
                initialValues={this.state.initialForm}
                onFinish={(e) => { this.handleFormSubmit(e) }}
                className={`no-animation label-bold ${!this.state.editEnabled && "input-no-left-padding select-no-left-padding"}`}
              >
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.user.profile_image' })}
                  style={{ marginBottom: "0px" }}
                ></Form.Item>
                <ImgCrop rotate modalWidth={1000}>
                  <Upload
                    //action={(file) => (this.uploadImage(file))}
                    customRequest={(props) => { this.uploadImage(props) }}
                    listType="picture-card"
                    fileList={this.state.fileList}
                    //onPreview={(file) => { this.handlePreview(file) }}
                    onRemove={(props) => { this.handleOnRemove(props) }}
                  >
                    {this.state.fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                </ImgCrop>
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'general.name' })}
                  required={this.state.editEnabled}
                  name={["profile", "name"]}
                  validateStatus={this.state.error.errors.profile.name && "error"}
                  help={this.state.error.errors.profile.name && this.state.error.errors.profile.name.join(', ')}
                >
                  <Input bordered={this.state.editEnabled} disabled={!this.state.editEnabled} />
                </Form.Item>
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'general.email' })}
                  required={this.state.editEnabled}
                  name={["profile", "email"]}
                  validateStatus={this.state.error.errors.profile.email && "error"}
                  help={this.state.error.errors.profile.email && this.state.error.errors.profile.email.join(', ')}
                >
                  <Input bordered={this.state.editEnabled} disabled={!this.state.editEnabled} />
                </Form.Item>
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.address.phone' })}
                  validateStatus={this.state.error.errors.profile.phone && "error"}
                  help={this.state.error.errors.profile.phone && this.state.error.errors.profile.phone.join(', ')}
                >
                  <Input.Group compact>
                    <Form.Item
                      noStyle
                      name={["profile", "area_code"]}
                    >
                      <Select
                        style={{ width: '30%' }}
                        bordered={this.state.editEnabled}
                        disabled={!this.state.editEnabled}
                      >
                        {this.state.countries.map((country) => {
                          return (
                            <Select.Option key={country.area_code} value={country.area_code}>
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
                      name={["profile", "phone"]}
                    >
                      <Input style={{ width: "70%" }} bordered={this.state.editEnabled} disabled={!this.state.editEnabled} />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>

                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'general.language' })}
                  name={["profile", "language", "id"]}
                >
                  <Select
                    bordered={this.state.editEnabled}
                    disabled={!this.state.editEnabled}
                  >
                    {this.state.languages.map((language) => {
                      return (
                        <Select.Option key={language.id} value={language.id}>
                          <div>
                            <ReactCountryFlag countryCode={language.code.toUpperCase()} style={{ marginRight: "10px" }} />
                            {language.name}
                          </div>
                        </Select.Option>)
                    })}
                  </Select>
                </Form.Item>


                <Row justify="end">
                  {
                    this.state.editEnabled ?
                      (<div><Button style={{ marginRight: "10px" }} onClick={() => { this.setState({ ...this.state, editEnabled: false }) }} >
                        {this.props.intl.formatMessage({ id: 'crud.cancel' })}
                      </Button>
                      <Button type="primary" htmlType="submit">
                        {this.props.intl.formatMessage({ id: 'crud.save' })}
                      </Button></div>) :
                      <Button style={{ marginRight: "10px" }} onClick={() => { this.setState({ ...this.state, editEnabled: true }) }} >
                        {this.props.intl.formatMessage({ id: 'crud.edit' })}
                      </Button>
                  }
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