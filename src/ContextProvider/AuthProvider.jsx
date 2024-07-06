import { useState, useEffect } from 'react';
import { getAuth, login, logout, refreshToken } from '../Services/Auth';
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
                        setAuth({
                            token: res.token,
                            refreshToken: res.refreshToken,
                            role: res.role,
                            username: res.username,
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

    const handleLogin =  (data) => {
         login(data).then((res) => {
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
            if (
                res.data.account.role === 'ROLE_MANAGER' ||
                res.data.account.role === 'ROLE_EMPLOYEE'
            ) {
                navigate(location.state?.redirectTo?.pathname || '/admin/home', { replace: true });
            } else {
                navigate('/')
            }
                
        });
    };

    const handleLogout =  () => {
         logout().then((res) => {
            setAuth({});
            localStorage.removeItem("auth")
                navigate('/');
            
        });
    };

    return (
        <AuthContext.Provider value={{ auth, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}
