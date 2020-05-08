import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

export const setupRequestClient = () => {
  let axiosInstance = axios.create()
  window.requestClient = axiosInstance

  axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  axiosInstance.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
  }, function (err) {
    return Promise.reject(err);
  });

  axiosInstance.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    switch (error.response.status) {
      case 503:
        props.history.push('/503')
        break
      default:
        break
    }
    return Promise.reject(error);
  });
}