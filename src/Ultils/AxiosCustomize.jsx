import axios from 'axios';
import { getAuth } from '../Services/Auth';

const apiPrivate = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
    },
});

const apiPublic = axios.create({
    baseURL: 'http://localhost:8080/',
});

apiPrivate.interceptors.request.use(
    (config) => {
        const { token } = getAuth();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } 

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiPrivate.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (
            error.response &&
            (error.response.status === 403 || error.response.status === 401)
        ) {
            
            if (window.location.pathname !== '/error/403') {
                window.location.href = '/error/403';
            }

        }
        if (
            error.response &&
            (error.response.status === 500 || error.response.status === 500)
        ) {
            // window.location.href = '/error/500';
        }

        return Promise.reject(error);
    }
);

export { apiPrivate, apiPublic };
