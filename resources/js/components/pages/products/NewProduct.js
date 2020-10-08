import React, { Component } from 'react'
import { PageHeader, Divider, Button } from 'antd';
import { DropboxOutlined, QqSquareFilled } from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import { Input, AutoComplete, Select, Card, Row, Col, Form, Steps, Avatar } from 'antd';
import deepCopy from 'json-deep-copy'
import { injectIntl } from 'react-intl'
import { initialState } from './initialStates/newProductInitialState'
import WizarPage1 from './wizardPages/WizardPage1'
import WizarPage2 from './wizardPages/WizardPage2'
import WizarPage3 from './wizardPages/WizardPage3'
import { modifyTypes } from './helpers/helper'
import AutoCompleteOptionLabel from './components/AutocompleteOptionLabel'
import merge from 'deep-merge-js'
import qs from 'query-string';
import parsem from 'multi-number-parse'

const { Step } = Steps;

export function intl() {
  return NewProdutPage.instance.props.intl;
}

class NewProdutPage extends Component {
  constructor(props) {
    super(props)
    this.initialState = initialState
    this.state = deepCopy(initialState)
  }

  componentDidMount() {
  }

  async fetchInitialData() {
    let resp = await requestClient.get('/api/products/')
    this.setState({ ...this.state, isFetching: false, categories, category })
  }

  componentWillUpdate(nextProps, nextState) {
    let step = parseInt((qs.parse(this.props.history.location.search)["wizard-step"] || 1), 10)
    if (step !== 1 && this.state.wizardStep === 1) {
      this.props.history.push(`/products/new?${qs.stringify({ "wizard-step": 1 })}`)
      nextState.wizardStep = 1
    }
    else if (step === 1 && this.state.wizardStep !== 1 ) {
      nextState.wizardStep = 1
    }
    else if (step === 2 && this.state.wizardStep !== 2) {
      nextState.wizardStep = 2
    }
  }

  handleCategoryChange(value) {
    this.state.initialForm.category_id = value.id
    this.setState({ ...this.state, category: value },
      () => { this.state.wp2FormRef.current.resetFields() })
  }

  async handlWizardeNext(value) {

    if (value == 2) {
      let resp_attributes = await requestClient.get(`/api/attributes?category_id=${this.state.category.id}`)
      let resp_measurements = await requestClient.get(`/api/measurements?category_id=${this.state.category.id}`)
      this.initialState.initialForm.product_attributes = resp_attributes.data.map( e => ({ attribute_id: e.id, option_id: null }))
      this.state.initialForm.product_attributes = deepCopy(this.initialState.initialForm.product_attributes)
      this.state = { ...this.state, measurementUnits: resp_measurements.data, attributes: resp_attributes.data }
    }

    this.setState({
      ...this.state,
      wizardStep: value,
    }, () => { this.goNextPage(value) })

  }

  goNextPage(value) {
    this.props.history.push(`/products/new?${qs.stringify({ "wizard-step": value })}`)
  }

  setErrors(error = {}) {
    this.state.error = merge(deepCopy(this.initialState.error), error)
    this.setState({ ...this.state })
  }

  async createProductRequest(wp3Values) {
    let form = deepCopy(this.state.initialForm)
    form = merge(form, this.state.wp2FormRef.current.getFieldsValue())
    form = merge(form, wp3Values)
    form.product_attributes = (form.product_attributes || [])
      .map((e, i) => ({
        attribute_id: this.state.initialForm.product_attributes[i].attribute_id,
        option_id: e.option_id || null }))

    requestClient.post('/api/products/', form)
      .then(async (response) => {
        switch (response.status) {
          case 201:
          case 200:
            this.setErrors()
            this.props.history.push(`/products`)
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
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title={this.props.intl.formatMessage({ id: 'pages.newProduct.header' })}
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
        />
        <Divider className="site-devider after-header"></Divider>

        <Steps current={this.state.wizardStep - 1}>
          <Step title={this.props.intl.formatMessage({ id: 'pages.newProduct.wizard.1' })} />
          <Step title={this.props.intl.formatMessage({ id: 'pages.newProduct.wizard.2' })} />
          <Step title={this.props.intl.formatMessage({ id: 'pages.newProduct.wizard.3' })} />
        </Steps>

        <WizarPage1
          style={{ display: this.state.wizardStep == 1 ? "" : "none"}}
          handleCategoryChange={(value) => { this.handleCategoryChange(value) }}
          handleWizardNext={(value) => { this.handlWizardeNext(value) }}
        />

        <WizarPage2
          intl={this.props.intl}
          error={this.state.error}
          category={this.state.category}
          attributes={this.state.attributes}
          initialForm={this.state.initialForm}
          setErrors={(val) => { this.setErrors(val) } }
          measurementUnits={this.state.measurementUnits}
          style={{ display: this.state.wizardStep == 2 ? "" : "none"}}
          handleWizardNext={(value) => { this.handlWizardeNext(value) }}
          setFormRef={(val) => { this.setState({ ...this.state, wp2FormRef: val }) }}
        />

        <WizarPage3
          error={this.state.error}
          initialForm={this.state.initialForm}
          setErrors={(val) => { this.setErrors(val) } }
          style={{ display: this.state.wizardStep == 3 ? "" : "none"}}
          setFormRef={(val) => { this.setState({ ...this.state, wp3FormRef: val }) }}
          createProductRequest={(val) => { this.createProductRequest(val) }}
        />
      </div>
    )
  }
}

export default injectIntl(withRouter(NewProdutPage))