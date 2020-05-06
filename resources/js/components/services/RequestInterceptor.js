import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class RequestInterceptor extends Component {
    componentDidMount() {
        axios.interceptors.response.use(function (response) {
            // Do something with response data
            return response;
        }, function (error) {
            switch (error.response.status) {
                case 503:
                    props.history.push('/503')
                    break
                default:
                    console.log("intercepted")
                    break
            }
            // Do something with response error
            return Promise.reject(error);
        });
    }

    render() {
        return (<div>{this.props.children}</div>)
    }

} 