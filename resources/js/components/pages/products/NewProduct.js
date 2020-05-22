import React, { Component } from 'react'
import { PageHeader, Divider } from 'antd';
import { DropboxOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import { Input, AutoComplete, Select } from 'antd';
import deepCopy from 'json-deep-copy'
import { initialState } from './initialStates/newProductInitialState'
import { tuple } from 'antd/lib/_util/type';

const modifyTypes = (types) => {
  for (let index in types) {
    let el = types[index]
    el.value = el.id
    el.parentschain = getParentsChain(types[index], types)
    el.ancestors = types.filter((e) => e.parent_id === types[index].parent_id)
    el.firstlevelchildren = types.filter((e) => e.parent_id === types[index].id)
    let path = el.parentschain.map((e) => e.name).join(el.parentschain.length > 1 ? " > " : "")
    el.label = ( <div> {path} </div>)
  }
  return types
}

const getParentsChain = (type, types) => {
  let el = [type]
  let parent = types.find((e) => e.id === type.parent_id)
  return parent ? getParentsChain(parent, types).concat(el) : el
}

const CategorySelectBoxes = (props) => {
  let { state: { selectedCategoryChain }, ...rest } = props
  let chain = [ ...selectedCategoryChain ]
  let lastElementChildren = (chain[chain.length - 1] || {}).firstlevelchildren || []
  if (lastElementChildren.length > 0) chain.push(lastElementChildren)
  return chain.map((el) => {
    let type = Array.isArray(el) ? { ancestors: el, id: null } : el 
    return (<Select key={type.id} value={type.id} {...rest} >
      {type.ancestors.map((ancestor) => (
        <Select.Option
          key={ancestor.id}
          value={ancestor.id}
        >
          {ancestor.name}
        </Select.Option>))}
    </Select>)})
  
}

class NewProdutPage extends Component {
  constructor(props) {
    super(props)
    this.initialState = initialState
    this.state = deepCopy(initialState)
  }

  componentDidMount() {
    this.fetchInitialData()
  }

  async fetchInitialData() {
    let resp = await requestClient.get('/api/types')
    this.state.types = modifyTypes(resp.data)
    this.setState({ ...this.state, isFetching: false })
  }

  handleSearch(value) {
    let blank = value.replace(/ /g, '') === ""
    this.state.searchOptions = []
    if (!blank)
      for (const type of this.state.types)
        if (type.name.match(new RegExp(`${value}`, 'gi')))
          this.state.searchOptions.push(type)
    this.setState({ ...this.state, selectedSearchValue: value })
  }

  handleSearhSelect(value) {
    let chain = this.state.types.find(e => e.id === value).parentschain
    this.setState({ ...this.state, selectedCategoryChain: chain, selectedSearchValue: null })
  }

  handleCategorySelectChange(value) {
    this.handleSearhSelect(value)
  }

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title="New Product"
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
          onBack={() => { this.props.history.goBack() }}
        />
        <Divider className="site-devider after-header"></Divider>
        <AutoComplete
          options={this.state.searchOptions}
          onSearch={(value) => { this.handleSearch(value) }}
          onSelect={(value) => { this.handleSearhSelect(value) }}
          value={this.state.selectedSearchValue}
        >
          <Input.Search placeholder="write the letter T" enterButton />
        </AutoComplete>
        <CategorySelectBoxes
          showSearch
          state={this.state}
          style={{ width: "100%" }}
          onChange={(value) => { this.handleCategorySelectChange(value) }}
         />
      </div>
    )
  }
}

export default withRouter(NewProdutPage)