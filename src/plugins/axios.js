'use strict'

import Vue from 'vue'
import axios from 'axios'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const token = localStorage.getItem('token')

const config = {
  //상용
  // baseURL: 'https://api.arambookclub.com',
  //상용

  // baseURL: 'https://tobe-qa-user-api.arambookclub.com',
  baseURL: 'https://qa-api.arambookclub.com',
  headers: {
    authorization: `Bearer ${token}`
    // authorization:
    //   'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIiLCJzeXNNZW1JZCI6Ik1FLTIwMjAwOTExMTQwMDI3MzkxIiwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImNoaWxkSWQiOiJNQy0yMDIwMDkxMDExMTAwMDAyNiIsImNoaWxkTmFtZSI6IuyVhOuejDAyNiIsImNoaWxkQWdlIjoyMSwiY2hpbGRUaHVtYm5haWwiOiIiLCJscm5nTWVtU2Vxbm8iOjIwNCwiaWF0IjoxNjE3Nzc3ODU1LCJleHAiOjE2MTgzODI2NTV9.EyOwJV-ASzLfH2nM8d993L3nh4-hHXMYlzXTaYvXy1k'
    // 2 단계
    // authorization:
    //   'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIiLCJzeXNNZW1JZCI6Ik1FLTIwMjAwOTExMTQwMDEwNjIxIiwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImNoaWxkSWQiOiJNQy0yMDIwMDkxMDExMTAwMDAyNSIsImNoaWxkTmFtZSI6IuyVhOuejDAyNSIsImNoaWxkQWdlIjowLCJjaGlsZFRodW1ibmFpbCI6IiIsImxybmdNZW1TZXFubyI6MTg2LCJpYXQiOjE2MTc3NTU2NTYsImV4cCI6MTYxODM2MDQ1Nn0.yUgzIBYC5C77EdyofPk_v5cAWq5y0jnL4GTSQMLmwDI'
    // 3 단계
    // authorization:
    //   'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIiLCJzeXNNZW1JZCI6Ik1FLTIwMjAwOTA5MTgxNjEyNDM4Iiwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImNoaWxkSWQiOiJNQy0yMDIwMDkxMDEyMjAyMjgxNSIsImNoaWxkTmFtZSI6IlRFU1QiLCJjaGlsZEFnZSI6MiwiY2hpbGRUaHVtYm5haWwiOiIiLCJscm5nTWVtU2Vxbm8iOjE5NiwiaWF0IjoxNjE2MDQ2ODAwLCJleHAiOjE2MzQxOTA4MDB9.DhKUN41b_WPs0OCoOaBE9SO3-C3f0fA0ONfX878Y_cw'
  }
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error)
  }
)

Plugin.install = function(Vue) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios
      }
    },
    $axios: {
      get() {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
