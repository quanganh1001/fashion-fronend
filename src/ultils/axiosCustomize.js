import axios from 'axios';
import { getAuth, isTokenExpired } from '../services/Auth';

const api = axios.create({
    baseURL: 'http://localhost:8080/'
})


api.interceptors.request.use(
    config => { 
        const { accessToken } = getAuth();
        if (accessToken) {
            if (!isTokenExpired(accessToken)) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default api;