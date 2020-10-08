import React, { Component } from 'react'
import { Row, Col, Card, Form, Input, InputNumber, Select, Switch, Button, PageHeader, Divider } from 'antd'
import { withRouter } from 'react-router-dom'
import { initialState } from './initialStates/editProductInitialState'
import { DropboxOutlined, QqSquareFilled } from '@ant-design/icons';
import { injectIntl } from 'react-intl'
import deepCopy from 'json-deep-copy'
import qs from 'query-string';
import merge from 'deep-merge-js'

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

class EditProduct extends Component {
  constructor(props) {
    super(props)
    this.state = { }
    this.initialState = initialState
    this.state = deepCopy(initialState)
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.fetchInitialData()    
  }

  async fetchInitialData() {
    let id = this.props.match.params.id
    let resp = await requestClient.get(`/api/products/${id}`)
    this.initialState.initialForm = merge(this.initialState.initialForm, resp.data)
    this.setState({ ...this.state, isFetching: false, initialForm:  { ...this.initialState.initialForm } }, () => { console.log(this.state) })
    this.formRef.current.resetFields()

/*     let resp = await requestClient.get(`/api/products/${}/edit`)
    let categories = modifyCategories(resp.data, AutoCompleteOptionLabel)
    let category = categories.find(e => e.parent_id == null) || {}
    this.setState({ ...this.state, isFetching: false, categories, category }) */
  }

  render() {
    return (
 <div>
        <PageHeader
          className="site-page-header"
          title={this.props.intl.formatMessage({ id: 'pages.newProduct.header' })}
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
              onFinish={() => {}}
            >

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
                  onChange={() => {  }}
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      </div>
    )
  }
}
export default injectIntl(withRouter(EditProduct))