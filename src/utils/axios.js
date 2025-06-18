import axios from "axios"

const API_URL = "http://localhost:8080/"

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 25000,
})

export default axiosInstance
