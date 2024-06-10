import axios from 'axios';
import { getAuth, isTokenExpired } from '../Services/Auth';

const apiPrivate = axios.create({
    baseURL: 'http://localhost:8080/'
})

const apiPublic = axios.create({
  baseURL: "http://localhost:8080/",
});


apiPrivate.interceptors.request.use(
  (config) => {
    const { token } = getAuth();
    if (token) {
      if (!isTokenExpired(token)) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export { apiPrivate, apiPublic };