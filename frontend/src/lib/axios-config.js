import axios from "axios";
import getApiHeaders from "./api-config";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: { 
    ...getApiHeaders()
  }
});