import axios from 'axios';
import { getAuth, isTokenExpired } from '../Services/Auth';

const api = axios.create({
    baseURL: 'http://localhost:8080/'
})


api.interceptors.request.use(
    config => { 
        const { token } = getAuth();
        if (token) {
          if (!isTokenExpired(token)) {
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;