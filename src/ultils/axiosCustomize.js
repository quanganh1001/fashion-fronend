import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/'
})


instance.interceptors.response.use(function(response){
    console.log(response.data);
    return response && response.data ? response.data :response;
}, function (error) {
    return Promise.reject(error)
})

export default instance;