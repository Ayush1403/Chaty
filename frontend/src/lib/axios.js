import axios from "axios";

export const axiosInstance =axios.create({
    baseURL: 'http://localhost:5002',
    withCredentials: true,
})