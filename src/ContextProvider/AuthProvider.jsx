import { useState, useEffect } from 'react';
import {
    getAuth,
    loginAdmin,
    loginClient,
    logout,
    refreshToken,
} from '../Services/Auth';
import { AuthContext } from './Context';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AuthProvider({ children }) {
    const location = useLocation();

    const navigate = useNavigate();

    const [auth, setAuth] = useState(getAuth());

    useEffect(() => {
        localStorage.setItem('auth', JSON.stringify(auth));
    }, [auth]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (auth.token && auth.refreshToken) {
                refreshToken(auth.refreshToken)
                    .then((res) => {
                        console.log(res.data);
                        setAuth({
                            token: res.data.token,
                            refreshToken: res.data.refreshToken,
                            account: res.data.account,
                        });
                    })
                    .catch((e) => {
                        setAuth({});
                        toast.error('Phiên đăng nhập đã hết hạn!');
                        navigate('/');
                    });
            }
        }, 1000 * 10 * 59);
        return () => clearInterval(interval);
    }, [auth]);

    const handleLoginAdmin = async (data) => {
        await loginAdmin(data).then((res) => {
            setAuth({
                token: res.data.token,
                refreshToken: res.data.refreshToken,
                account: {
                    id: res.data.account.id,
                    name: res.data.account.name,
                    phone: res.data.account.phone,
                    email: res.data.account.email,
                    address: res.data.account.address,
                    isActivated: res.data.account.isActivated,
                    role: res.data.account.role,
                },
            });
            toast.success('Đăng nhập thành công!');
            if (res.data.account.role === 'ROLE_MANAGER') {
                navigate(
                    location.state?.redirectTo?.pathname || '/admin/home',
                    { replace: true }
                );
            } else if (res.data.account.role === 'ROLE_EMPLOYEE') {
                navigate(
                    location.state?.redirectTo?.pathname || '/admin/invoices',
                    { replace: true }
                );
            }
        });
    };

    const handleLoginClient = async (data) => {
        await loginClient(data).then((res) => {
            setAuth({
                token: res.data.token,
                refreshToken: res.data.refreshToken,
                account: {
                    id: res.data.account.id,
                    name: res.data.account.name,
                    phone: res.data.account.phone,
                    email: res.data.account.email,
                    address: res.data.account.address,
                    isActivated: res.data.account.isActivated,
                    role: res.data.account.role,
                },
            });
            toast.success('Đăng nhập thành công!');
            navigate(location.state?.redirectTo?.pathname || '/', {
                replace: true,
            });
        });
    };

    const handleLogout = async () => {
        await logout()
            .then((res) => {
                setAuth({});
                localStorage.removeItem('auth');
            })
            .catch(() => {
                setAuth({});
                localStorage.removeItem('auth');
            });
    };

    return (
        <AuthContext.Provider
            value={{ auth, handleLoginClient, handleLoginAdmin, handleLogout }}
        >
            {children}
        </AuthContext.Provider>
    );
}
