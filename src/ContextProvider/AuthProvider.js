import { useEffect, useState } from "react";
import { activateAccount, decodeToken, getAuth, login, refreshToken } from "../services/Auth";
import { AuthContext } from "./Context";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


export default function AuthProvider({ children }) {

    const location = useLocation();

    const navigate = useNavigate();

    const [auth, setAuth] = useState(getAuth());

    const redirectTo = location.state?.redirectTo?.pathname || '/';
    
    useEffect(() => {
        localStorage.setItem('auth', JSON.stringify(auth));
    }, [auth]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (auth.accessToken && auth.refreshToken) {
                refreshToken(auth.refreshToken)
                    .then(res => {
                        setAuth({
                            accessToken: res.accessToken,
                            refreshToken: res.refreshToken,
                            role: res.role,
                            usename: res.username
                        });
                    })
                    .catch(e => {
                        console.log(e);
                        setAuth({});
                        toast.error('Your login session might has been expired, please try to login again');
                        navigate('/');
                    });
            }

        }, 1000 * 60 * 10);
        return () => clearInterval(interval);
    }, [auth]);


    const handleLogin = (data) => {
        login(data)
            .then(res => { 
                setAuth({
                    accessToken: res.token,
                    refreshToken: res.refreshToken,
                    role: res.role,
                    usename: res.username
                });
                navigate(redirectTo, { replace: true });

            })
            .catch(error => {
                console.log(error.response);
               
            })
    }

    return (
        <AuthContext.Provider value={{ auth, handleLogin}}>
            {children}
        </AuthContext.Provider>
    )
    
}