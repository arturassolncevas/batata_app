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

class NewProdutPage extends Component {
  constructor(props) {
    super(props)
    this.initialState = initialState
    this.state = deepCopy(initialState)
  }

  componentDidMount() {
  }

  componentWillUpdate(nextProps, nextState) {
    /*
    let step = parseInt((qs.parse(this.props.history.location.search)["wizard-step"] || 1), 10)
    if (step !== 1 && this.state.wizardStep === 1) {
      this.props.history.push(`/products/new?${qs.stringify({ "wizard-step": 1 })}`)
      nextState.wizardStep = 1
    }
    else if (step === 1 && this.state.wizardStep !== 1 ) {
      nextState.wizardStep = 1
    }
    */
  }

  handleCategoryChange(value) {
    this.setState({ ...this.state, category: value }, () => { this.state.formRef.current.resetFields() })
  }

  async handlWizardeNext(value) {
    let resp_attributes = await requestClient.get(`/api/attributes?category_id=${this.state.category.id}`)
    let resp_measurements = await requestClient.get(`/api/measurements?category_id=${this.state.category.id}`)
    this.initialState.initialForm.product_attributes = resp_attributes.data.map( e => ({ attribute_id: e.id, option_id: null }))
    this.state.initialForm.product_attributes = deepCopy(this.initialState.initialForm.product_attributes)

    this.setState({
      ...this.state, measurementUnits: resp_measurements.data, attributes: resp_attributes.data, wizardStep: value,
    }, () => { this.props.history.push(`/products/new?${qs.stringify({ "wizard-step": value - 1 })}`) })
  }

  setErrors(error = {}) {
    this.state.error = merge(deepCopy(this.initialState.error), error)
    this.setState({ ...this.state })
  }

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title={this.props.intl.formatMessage({ id: 'pages.new_product.header' })}
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
        />
        <Divider className="site-devider after-header"></Divider>

        <Steps current={this.state.wizardStep - 1}>
          <Step title={this.props.intl.formatMessage({ id: 'pages.new_product.wizard.1' })} />
          <Step title={this.props.intl.formatMessage({ id: 'pages.new_product.wizard.2' })} />
          <Step title={this.props.intl.formatMessage({ id: 'pages.new_product.wizard.3' })} />
          <Step title={this.props.intl.formatMessage({ id: 'pages.new_product.wizard.4' })} />
        </Steps>

        <WizarPage1
          style={{ display: this.state.wizardStep == 1 ? "" : "none"}}
          handleCategoryChange={(value) => { this.handleCategoryChange(value) }}
          handleWizardNext={(value) => { this.handlWizardeNext(value) }}
        />

        <WizarPage2
          style={{ display: this.state.wizardStep == 2 ? "" : "none"}}
          intl={this.props.intl}
          error={this.state.error}
          initialForm={this.state.initialForm}
          category={this.state.category}
          measurementUnits={this.state.measurementUnits}
          attributes={this.state.attributes}
          setFormRef={(val) => { this.setState({ ...this.state, formRef: val }) }}
          setErrors={(val) => { this.setErrors(val) } }
          handleWizardNext={(value) => { this.handlWizardeNext(value) }}
        />

        <WizarPage3
          style={{ display: this.state.wizardStep == 3 ? "" : "none"}}
        />
      </div>
    )
  }
}

export default injectIntl(withRouter(NewProdutPage))