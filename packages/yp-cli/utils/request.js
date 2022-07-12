const axios = require('axios')
const { baseURL, token } = require('../config')

const instance = axios.create({
  baseURL,
  timeout: 6e4,
  headers: {
    'PRIVATE-TOKEN': token,
  },
})

// Add a request interceptor
instance.interceptors.request.use((config) => config,
  (error) => Promise.reject(error))

// Add a response interceptor
instance.interceptors.response.use((response) => response.data,
  (error) => Promise.reject(error))

module.exports = instance
