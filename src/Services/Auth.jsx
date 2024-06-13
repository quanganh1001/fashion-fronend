import { apiPublic } from '../Ultils/AxiosCustomize';
import jwtDecode from 'jwt-decode';

export const login = async (data) => {
    const response = await apiPublic.post('/auth/login', data);
    return response;
};

export const logout = async () => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const response = await apiPublic.delete('/auth/logout', {
        data: auth.token,
    });
    return response;
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
        .then((res) => res.data);
};

export const isTokenExpired = (token) => {
    const userPayload = jwtDecode(token);
    const { exp } = userPayload;
    return exp * 1000 < Date.now();
};
