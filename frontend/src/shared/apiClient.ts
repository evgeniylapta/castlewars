import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  method: 'get',
  timeout: 10000000
})
