import api from "../Ultils/AxiosCustomize"
import jwtDecode from "jwt-decode";


export const login = (data) => {
    return api.post('login', data)
        .then(res => res.data);
}

export const getAuth = () => {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth) : {};
}



export const isTokenExpired = (token) => {
    const userPayload = jwtDecode(token);
    const { exp } = userPayload;
    return exp * 1000 < Date.now();
}
