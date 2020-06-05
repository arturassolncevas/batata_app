import React, { Component } from 'react'
import { Row, Col, Card, Form, Input, InputNumber, Select, Switch, Button } from 'antd'
import ImgCrop from 'antd-img-crop';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file instanceof File ? file : file.originFileObj);
    reader.onload = () => {
      let img = new Image();
      img.onload = function () {
        resolve({
          base64: reader.result,
          size: { width: this.width, height: this.height }
        })
      }
      img.src = reader.result
    }
    reader.onerror = error => reject(error);
  });
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

class WizardPage3 extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef();
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: [],
      editorState: BraftEditor.createEditorState("")
    }
  }

  async handleChange({ file, fileList }) {
    fileList = fileList.slice(-4);
    let file_data = await getBase64(file)
    let file_in_list = fileList.find(e => e.uid === file.uid)
    file_in_list.url = file_data.base64
    file_in_list.status = "done"
    this.state.fileList = [...fileList]
    this.setState({ ...this.state })
  }

  async beforeCrop(file) {
    let img_data = await getBase64(file)
    this.setCropAspect(img_data.size.width / img_data.size.height)
    return true
  }

  setCropAspect(aspect) {
    this.state.cropAspect = aspect
    this.setState(this.state)
  }

  handleCancel() {
    this.setState({ previewVisible: false });
  }

  async handlePreview(file) {
    if (!file.url && !file.preview) {
      file.preview = file.url;
    }
    this.setState({
      ...this.state,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  }

  handleEditorChange(editorState) {
    this.setState({ ...this.state, editorState })
  }

  handleFormSubmit(values) {
    console.log(values.description.toHTML())
  }

  render() {
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    )

    return (
      <Row type="flex" justify="center" style={{ ...this.props.style }}>
        <Col lg={14} >
          {/*
          <Card>
            <Row style={{ height: "150px" }}>
              <Col style={{ height: "100%" }}>
                <img style={{ height: "100%" }} src={this.state.fileList[0] && this.state.fileList[0].url} />
              </Col>
              <Col>
                <div> data </div>
              </Col>
            </Row>
          </Card>
          */}
          <Card>
            <Form
              ref={this.formRef}
              name="basic"
              {...layout}
              onFinish={(e) => { this.handleFormSubmit(e) }}
            >
              <Form.Item
                label="Images"
                style={{ marginBottom: "0px" }}
              ></Form.Item>
              <ImgCrop rotate beforeCrop={(props) => this.beforeCrop(props)} modalWidth={1000}>
                <Upload
                  customRequest={(props) => { return props }}
                  listType="picture-card"
                  fileList={this.state.fileList}
                  onPreview={(file) => { this.handlePreview(file) }}
                  onChange={(val) => { this.handleChange(val) }}
                >
                  {this.state.fileList.length >= 8 ? null : uploadButton}
                </Upload>
              </ImgCrop>

              <Modal
                visible={this.state.previewVisible}
                title={this.state.previewTitle}
                footer={null}
                onCancel={() => { this.handleCancel() }}
              >
                <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
              </Modal>

              <Form.Item
                label="Title"
                name="title"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
              >
                <BraftEditor
                  language="en"
                  value={this.state.editorState}
                  onChange={(val) => { this.handleEditorChange(val) }}
                  onSave={this.submitContent}
                  title={"title1"}
                />
              </Form.Item>

              <Row justify="end">
                <Button type="primary" htmlType="submit">
                  Next
                </Button>
              </Row>

            </Form>
          </Card>
        </Col>
      </Row>)
  }
}

export default WizardPage3
