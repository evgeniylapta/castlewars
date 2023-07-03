import axios from 'axios'

const baseUrl = 'http://localhost:4000/api/v1'

export const apiClientDefaultParams = {
  baseURL: baseUrl,
  withCredentials: true
}

export const apiClient = axios.create(apiClientDefaultParams)
