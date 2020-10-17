import React, { Component } from 'react'
import { Row, Col, Card, Form, Input, InputNumber, Select, Switch, Button, PageHeader, Divider } from 'antd'
import { withRouter } from 'react-router-dom'
import { initialState } from './initialStates/editProductInitialState'
import { DropboxOutlined, QqSquareFilled, PlusOutlined, LoadingOutlined } from '@ant-design/icons';

import BraftEditor from 'braft-editor'

import ImgCrop from 'antd-img-crop';
import { Upload, Modal } from 'antd';
import { injectIntl } from 'react-intl'
import deepCopy from 'json-deep-copy'
import qs from 'query-string';
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

class ProductFormatter {
  constructor() {
    this.options = {
      priceFormat: "",
      quantityFormat: "",
      currencySymbol: "",
      salesLimitFormat: ""
    }
  }

  formattedPrice({ price, quantity }) {
    let str = this.options.priceFormat;
    [
      ["<<price>>", price || ""],
      ["<<quantity>>", quantity || ""]
    ].forEach((e) => {
      str = str.replace(RegExp(e[0]), e[1])
    })
    return str
  }

  formattedQuantity({ quantity }) {
    let str = this.options.salesLimitFormat;
    [
      ["<<quantity>>", quantity || "*"]
    ].forEach((e) => { str = str.replace(RegExp(e[0]), e[1]) })
    return str
  }

  setOptions({ currencySymbol, measurementUnitAlias, packed, intl }) {
    this.options = merge(this.options, { currencySymbol, measurementUnitAlias, packed })
    this.options.priceFormat = `<<price>> ${this.options.currencySymbol || ""}/ <<quantity>> ${this.options.measurementUnitAlias}`
    this.options.priceFormat += packed ? ` (${intl.formatMessage({ id: "general.pack" })})` : ""
    this.options.salesLimitFormat = "<<quantity>> "
    this.options.salesLimitFormat += this.options.packed ? `(${intl.formatMessage({ id: "general.packs" })})` : this.options.measurementUnitAlias
  }
}

class EditProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.initialState = initialState
    this.state = deepCopy(initialState)
    this.formRef = React.createRef();
    this.initialForm = null
  }

  componentDidMount() {
    this.fetchInitialData()
  }

  async fetchInitialData() {
    let id = this.props.match.params.id
    let resp_product = await requestClient.get(`/api/products/${id}`)
    let { category_id, measurement_unit, packed, attributes, files, description } = resp_product.data
    let resp_measurements = await requestClient.get(`/api/measurements?category_id=${category_id}`)

    this.productFormatter = new ProductFormatter()
    this.productFormatter.setOptions({ measurementUnitAlias: measurement_unit.alias, packed, intl: this.props.intl })

    this.initialForm = merge(this.state.initialForm, { ...resp_product.data, description: BraftEditor.createEditorState(description) })
    this.fetchAttributes(category_id)

    this.setState({
      ...this.state,
      product: resp_product.data,
      isFetching: false,
      initialForm: {
        ...this.initialForm,
        product_attributes: attributes.map(e => ({ attribute_id: e.attribute.id, option_id: e.option.id })),
      },
      fileList: files.filter(e => e.type === "thumbnail").map((e, i) => ({ uid: e.id, group_id: e.group_id, group_priority: e.group_priority, status: "done", url: e.url })),
      measurementUnits: resp_measurements.data,
      selectedMeasurementUnit: measurement_unit
    }, () => {
      this.formRef.current.resetFields()
      this.updateFormatted()
    })
  }

  async fetchAttributes(category_id) {
    let resp_attributes = await requestClient.get(`/api/attributes?category_id=${category_id}`)
    this.setState({ ...this.state, attributes: resp_attributes.data })
  }

  handlePriceChange(callback) {
    let formFields = this.formRef.current.getFieldsValue(["price", "quantity"])
    let formatted = this.productFormatter.formattedPrice({ price: currencyHelper.value(formFields.price).format(), quantity: formFields.quantity })
    this.state.formattedPrice = formatted
    this.setState({ ...this.state }, callback)
  }

  handleMeasurementUnitChange(value) {
    let selectedMeasurementUnit = this.state.measurementUnits.find(e => e.id === value)
    let formFields = this.formRef.current.getFieldsValue(["packed"])
    this.setState({ ...this.state, selectedMeasurementUnit }, () => {
      this.productFormatter.setOptions({ measurementUnitAlias: this.state.selectedMeasurementUnit.alias, packed: formFields.packed, intl: this.props.intl })
      this.updateFormatted()
    })
  }

  updateFormatted() {
    let formFields = this.formRef.current.getFieldsValue(["quantity", "min_quantity", "max_quantity", "quantity_in_stock"])
    let formValues = Object.keys(formFields).map(e => {
      return formFields[e] ? { name: e, value: this.setParser(formFields[e].toString(), { checkIfPacked: e !== "quantity" }) } : null
    })
    var filtered = formValues.filter(el => el != null);
    this.formRef.current.setFields(filtered)
    this.handlePriceChange(() => this.handleLimitChange(() => { this.handleStockQuantityChange() }))
  }

  setParser(value, options = {}) {
    let decimalPoints = this.state.selectedMeasurementUnit.max_decimal_points
    if (options.checkIfPacked)
      decimalPoints = this.formRef.current.getFieldsValue(["packed"]).packed ? 0 : decimalPoints
    return numberHelper.parse(value, { maxDecimalPoints: decimalPoints || 0 })
  }

  handleLimitChange(callback) {
    let formFields = this.formRef.current.getFieldsValue(["min_quantity", "max_quantity"])
    let min = this.productFormatter.formattedQuantity({ quantity: formFields.min_quantity })
    let max = this.productFormatter.formattedQuantity({ quantity: formFields.max_quantity })
    let formatted = `${this.props.intl.formatMessage({ id: "general.min" })} ${min} - ${this.props.intl.formatMessage({ id: "general.max" })} ${max}`
    this.setState({ ...this.state, formattedSalesLimits: formatted }, callback)
  }

  handlePackedChange(val) {
    this.productFormatter.setOptions({ measurementUnitAlias: this.state.selectedMeasurementUnit.alias, packed: val, intl: this.props.intl })
    this.updateFormatted()
  }

  handleStockQuantityChange() {
    let formFields = this.formRef.current.getFieldsValue(["quantity_in_stock"])
    let formatted = this.productFormatter.formattedQuantity({ quantity: formFields.quantity_in_stock })
    this.setState({ ...this.state, formattedQuantityInStock: formatted })
  }

  async handleOnRemoveImage(file) {
    requestClient.delete(`/api/product_files/delete_image/${file.uid}`).then(async (response) => {
      let fileInList = fileList.find(e => e.uid === file.uid)
      if (fileInList)
        thi.state
    })
  }

  async handleOnImagesChange({ file, fileList }) {
    if (file.status === "removed") {
      requestClient.delete(`/api/product_files/delete_image/${file.uid}`).then(async (response) => {
        this.state.fileList = fileList
        this.setState(this.state)
      })
    }
  }

  async uploadImage(props) {
    this.setState({ ...this.state, imageLoading: true })
    let lastFile = this.state.fileList[this.state.fileList.length - 1] || {}
    let data = {
      base64: await getBase64(props.file),
      group_priority: (lastFile.group_priority || 0) + 1,
      product_id: this.state.product.id
    }

    requestClient.post('/api/product_files/upload_image', data)
      .then(async (response) => {
        switch (response.status) {
          case 201:
          case 200:
          default:
            let file = response.data
            this.state.fileList.push({ uid: file.id, group_id: file.group_id, group_priority: file.group_priority, status: "done", url: file.url })
            this.setState({ ...this.state, imageLoading: false })
            break
        }
      })
      .catch((error) => {
        switch ((error.response || {}).status) {
          default:
            console.log(error)
            break
        }
      })
  }

  handleFormSubmit(values) {
    values.category_id = this.state.product.category_id
    values.description = values.description ? values.description.toHTML() : ""
    values.product_attributes = (values.product_attributes || [])
      .map((e, i) => ({
        attribute_id: this.state.initialForm.product_attributes[i].attribute_id,
        option_id: e.option_id || null }))

    requestClient.patch(`/api/products/${this.state.product.id}`, values)
      .then(async (response) => {
        switch (response.status) {
          case 200:
            //this.resetErrors()
            //this.props.handleWizardNext(3)
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
          title={this.props.intl.formatMessage({ id: 'pages.editProduct.header' })}
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
        />
        <Divider className="site-devider after-header"></Divider>

        <Row type="flex" justify="center" style={{ ...this.props.style }}  >
          <Col lg={14} >
            <Card>
              <Form
                ref={this.formRef}
                {...layout}
                name="basic"
                initialValues={this.state.initialForm}
                onFinish={(values) => { this.handleFormSubmit(values) }}
              >
                {/* Attributes */}
                {this.state.attributes.map((e, index) => (
                  <Form.Item
                    required={!!e.required}
                    label={e.name} key={e.id}
                    name={["product_attributes", index, 'option_id']}
                    validateStatus={this.state.error.errors.product_attributes[index] && "error"}
                    help={this.state.error.errors.product_attributes[index] && this.state.error.errors.product_attributes[index].join(', ')}
                  >
                    <Select key={e.id}> {e.options.map(e => (<Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>))} </Select>
                  </Form.Item>
                ))}

                {/* Is packed ? (Switch) */}

                <Form.Item
                  label={this.props.intl.formatMessage({ id: `pages.newProduct.pricePerPackQuestion` })}
                  valuePropName="checked"
                  name="packed"
                >
                  <Switch
                    checkedChildren={this.props.intl.formatMessage({ id: "general.yes" })}
                    unCheckedChildren={this.props.intl.formatMessage({ id: "general.no" })}
                    size={"large"}
                    onChange={(val) => { this.handlePackedChange(val) }}
                  />
                </Form.Item>

                {/* Price per units */}

                <Form.Item
                  required
                  label={`${this.props.intl.formatMessage({ id: `general.price` })} ${this.state.formattedPrice}`}
                >
                  <Row>
                    <Col lg={8} >
                      <Form.Item
                        name="price"
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          formatter={value => numberHelper.format(value, currencyHelper.options.symbol)}
                          parser={value => numberHelper.parse(value, { maxDecimalPoints: 2 })}
                          onChange={() => { this.handlePriceChange() }}
                        />
                      </Form.Item>
                    </Col>

                    <Col lg={8} >
                      <Form.Item
                        name="quantity"
                        validateStatus={this.state.error.errors.quantity && "error"}
                        help={this.state.error.errors.quantity && this.state.error.errors.quantity.join(', ')}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          placeholder="Antal"
                          formatter={value => numberHelper.format(value)}
                          parser={value => this.setParser(value)}
                          onChange={() => { this.handlePriceChange() }}
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={8} >
                      <Form.Item
                        name="measurement_unit_id"
                        validateStatus={this.state.error.errors.measurement_unit_id && "error"}
                        help={this.state.error.errors.measurement_unit_id && this.state.error.errors.measurement_unit_id.join(', ')}
                      >
                        <Select onChange={(val) => { this.handleMeasurementUnitChange(val) }} >
                          {this.state.measurementUnits.map(e => (<Select.Option key={e.id} value={e.id}>{e.alias}</Select.Option>))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
                {/* Min Max Sales quantity */}
                <Form.Item
                  label={`${this.props.intl.formatMessage({ id: `models.product.salesLimit` })} ${this.state.formattedSalesLimits}`}
                >
                  <Row>
                    <Col lg={8} >
                      <Form.Item
                        name="min_quantity"
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          placeholder="Min"
                          onChange={() => { this.handleLimitChange() }}
                          formatter={value => numberHelper.format(value)}
                          parser={value => this.setParser(value, { checkIfPacked: true })}
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={8} >
                      <Form.Item
                        name="max_quantity"
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          placeholder="Max"
                          onChange={() => { this.handleLimitChange() }}
                          formatter={value => numberHelper.format(value)}
                          parser={value => this.setParser(value, { checkIfPacked: true })}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
                {/* Currently in stock */}

                <Row>
                  <Col lg={8} >
                    <Form.Item
                      name="quantity_in_stock"
                      label={`${this.props.intl.formatMessage({ id: `models.product.quantityInStock` })} ${this.state.formattedQuantityInStock}`}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        parser={value => numberHelper.parse(value, { int: true })}
                        onChange={() => { this.handleStockQuantityChange() }}
                        formatter={value => numberHelper.format(value)}
                        parser={value => this.setParser(value, { checkIfPacked: true })}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.product.images' })}
                  style={{ marginBottom: "0px" }}
                ></Form.Item>
                <ImgCrop rotate modalWidth={1000}>
                  <Upload
                    //action={(file) => (this.uploadImage(file))}
                    customRequest={(props) => { this.uploadImage(props) }}
                    listType="picture-card"
                    fileList={this.state.fileList}
                    //onPreview={(file) => { this.handlePreview(file) }}
                    onChange={(props) => { this.handleOnImagesChange(props) }}
                    onRemove={(val) => { }}
                  >
                    {this.state.fileList.length >= 8 ? null : uploadButton}
                  </Upload>
                </ImgCrop>

                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.product.title' })}
                  name="title"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={this.props.intl.formatMessage({ id: 'models.product.description' })}
                  name="description"
                >
                  <BraftEditor
                    language="en"
                    onSave={this.submitContent}
                    title={"title1"}
                  />
                </Form.Item>
                <Row justify="end">
                  <Button type="primary" htmlType="submit">
                    {this.props.intl.formatMessage({ id: 'general.next' })}
                  </Button>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
export default injectIntl(withRouter(EditProduct))