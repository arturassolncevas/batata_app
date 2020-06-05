import React, { Component } from 'react'
import { Button } from 'antd';
import { Input, AutoComplete, Select, Card, Row, Col, Form, Avatar } from 'antd';
import qs from 'query-string';
import { modifyTypes } from '../helpers/helper'
import { injectIntl } from 'react-intl'
import AutoCompleteOptionLabel from '../components/AutocompleteOptionLabel'

const CategorySelectBoxes = (props) => {
  let { category, ...rest } = props
  let chain = category.parentschain || []
  let lastElementChildren = (chain[chain.length - 1] || {}).firstlevelchildren || []

  if (lastElementChildren.length > 0) chain.push(lastElementChildren)
  return chain.map((el, index) => {
    let type = Array.isArray(el) ? { ancestors: el, id: null } : el
    return (
      <Form.Item key={index}>
        <Select key={type.id}
          value={type.id || undefined}
          placeholder={props.intl.formatMessage({ id: 'pages.new_product.select_category' })}
          optionLabelProp="label"
          {...rest}
        >
          {type.ancestors.map((ancestor) => (
            <Select.Option
              label={ancestor.name}
              key={ancestor.id}
              value={ancestor.id}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "5px 0",
                alignItems: "center"
              }}>
                {ancestor.name}
                <Avatar shape="square" src="https://ae01.alicdn.com/kf/HTB1U6.dkbZnBKNjSZFGq6zt3FXae.jpg" />
              </div>
            </Select.Option>))}
        </Select>
      </Form.Item>
    )
  })
}

class WizardPage extends Component {

  constructor(props) {
    super(props)
    this.state = { searchOptions: [], autocompleteValue: null, category: {}, categories: [] }
  }

  componentDidMount() {
    //let step = qs.parse(this.props.history.location.search)["wizard-step"] || 0
    //if (parseInt(step, 10) !== 0) this.props.history.push('/products/new')
    this.fetchInitialData()
  }

  async fetchInitialData() {
    let resp = await requestClient.get('/api/categories')
    let categories = modifyTypes(resp.data, AutoCompleteOptionLabel)
    let category = categories.find(e => e.parent_id == null) || {}
    this.setState({ ...this.state, isFetching: false, categories, category })
  }

  handleSearch(value) {
    let blank = value.replace(/ /g, '') === ""
    this.state.searchOptions = []
    if (!blank)
      for (const category of this.state.categories)
        if (category.name.match(new RegExp(`${value}`, 'gi')))
          this.state.searchOptions.push(category)
    this.setState({ ...this.state, autocompleteValue: value })
  }

  handleSearhSelect(value, callback = null) {
    let category = this.state.categories.find(e => e.id === value) || {}
    this.setState({ ...this.state, category, autocompleteValue: null }, () => { callback(category) })
  }

  handleCategoryChange(value) {
    this.handleSearhSelect(value, (val) => { this.props.handleCategoryChange(val) } )
  }

  async handleWizardNext() {
    if ((this.state.category.firstlevelchildren || []).length === 0) {
      this.setState({...this.state, selectedCategoryWarning: null}, this.props.handleWizardNext(2))
    } else {
      this.setState({
        ...this.state,
        selectedCategoryWarning: this.props.intl.formatMessage({
          id: 'pages.new_product.selected_category_warning'
      })})
    }
  }

  render() {
    return (
      <Row type="flex" justify="center" style={{ marginTop: "30px", ...this.props.style }}  >
        <Col lg={8} >
          <Card bordered={true}>
            <Form>
              <Form.Item key="0">
                <AutoComplete
                  options={this.state.searchOptions}
                  onSearch={(value) => { this.handleSearch(value) }}
                  onSelect={(value) => { this.handleSearhSelect(value) }}
                  value={this.state.autocompleteValue}
                >
                  <Input.Search placeholder={this.props.intl.formatMessage({ id: 'general.search' })} enterButton />
                </AutoComplete>
              </Form.Item>
              <h3>{this.props.intl.formatMessage({ id: 'pages.new_product.select_header' })}</h3>
              <CategorySelectBoxes
                showSearch
                category={this.state.category}
                style={{ width: "100%" }}
                onChange={(value) => { this.handleCategoryChange(value) }}
                intl={this.props.intl}
              />
              <div className="error-text">{this.state.selectedCategoryWarning}</div>
              <Row justify="end">
                <Button type="primary" htmlType="submit" onClick={() => {this.handleWizardNext()}}>
                  {this.props.intl.formatMessage({ id: 'general.next' })}
                </Button>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>)
  }
}

export default injectIntl(WizardPage)