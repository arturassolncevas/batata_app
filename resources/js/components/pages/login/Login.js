import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Link, Redirect } from 'react-router-dom'
import { Form, Input, Button, Checkbox, Row, Col, Card } from 'antd';
import { initialState } from './initialState'
import { injectIntl } from 'react-intl'
import { signIn } from '../../redux/actions/authActions'
import { connect } from 'react-redux'


const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = { ...initialState }
    this.formRef = React.createRef();
  }

  handleFormSubmit(values) {
    requestClient.post('/api/login', {
      ...values
    })
      .then(async (response) => {
        switch (response.status) {
          case 200:
            let { success: { token = "" } } = response.data
            localStorage.setItem("token", token)
            await this.props.signIn()
            this.props.history.push("/")
          default:
            break
        }
      })
      .catch((error) => {
        switch ((error.response || {}).status) {
          case 401:
            this.state.generalError.message = this.props.intl.formatMessage({ id: 'pages.login.errors.wrong_credentials' })
            this.setState({ ...this.state })
            break;
          default:
            console.log(error)
            break
        }
      })
  }

  handleFormSubmitFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  };

  render() {
    if (this.props.authReducer.isLogged) {
      return (<Redirect to="/"></Redirect>)
    }
    return (
      <Row type="flex" justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col lg={6} >
          <Card title={this.props.intl.formatMessage({ id: 'pages.login.header' })}>
            <div style={{ color: "red" }}>{this.state.generalError.message}</div>
            <Form
              ref={this.formRef}
              {...layout}
              name="basic"
              initialValues={this.state.formDefault}
              onFinish={(e) => { this.handleFormSubmit(e) }}
              onFinishFailed={this.handleFormSubmitFailed}
            >
              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.email' })}
                name="email"
                validateStatus={this.state.errors.name.status}
                help={this.state.errors.name.message}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={this.props.intl.formatMessage({ id: 'general.password' })}
                name="password"
              >
                <Input.Password />
              </Form.Item>

              <Row style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "25px", textDecoration: "underline" }}>
                <Link to="/sign-up">{this.props.intl.formatMessage({ id: 'pages.login.sign_up' })}</Link>
                <Link to="/home">{this.props.intl.formatMessage({ id: 'pages.login.forgot_password' })}</Link>
              </ Row>

              <Form.Item >
                <Row justify="end">
                  <Button type="primary" htmlType="submit">
                    {this.props.intl.formatMessage({ id: 'general.submit' })}
                  </Button>
                </Row>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = state => {
  const { authReducer } = state
  return { authReducer }
}

const mapDispatchToProps = dispatch => ({
  signIn: () => dispatch(signIn())
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Login))