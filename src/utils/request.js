import axios from 'axios'
const request = axios.request({
  baseURL: 'process.env.VUE_APP_BASE_API',
  timeout: 5000
})
export default request
