import React, { Component } from 'react'
import { PageHeader, Divider, Button, Row, Col } from 'antd';
import { DropboxOutlined, PlusOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'


class PlacedOrdersPage extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  render() {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title={this.props.intl.formatMessage({ id: 'pages.placed_orders.header' })}
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
        />
        <Divider className="site-devider after-header"></Divider>

        <Row justify="center">
          <Col xl={20} style={{ textAlign: "center", padding: "40px" }}>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withRouter(injectIntl(PlacedOrdersPage))