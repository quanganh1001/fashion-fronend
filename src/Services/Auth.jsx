import { apiPublic } from '../Ultils/AxiosCustomize';
import jwtDecode from 'jwt-decode';

export const loginClient =  (data) => {
    const response =  apiPublic.post('/auth/login', data);
    return response;
};

export const loginAdmin = (data) => {
    const response = apiPublic.post('/auth/admin/login', data);
    return response;
};

export const logout =  () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const response =  apiPublic.delete('/auth/logout', {
        data: auth.token,
    });
    return response;
};

export const register =  (accountRegisterDto) => {
    return  apiPublic.post('/auth/register', accountRegisterDto);
};

export const getAuth = () => {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth) : {};
};

export const refreshToken = (refreshToken) => {
    return apiPublic
        .put(
            '/auth/refreshToken',
            {},
            {
                headers: {
                    Authorization: 'RefreshToken ' + refreshToken,
                },
            }
        )
};

export const resetPass = (email) => {
    return apiPublic.put('/auth/resetPass',email, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });

};

export const isTokenExpired = (token) => {
    const userPayload = jwtDecode(token);
    const { exp } = userPayload;
    return exp * 1000 < Date.now();
};
