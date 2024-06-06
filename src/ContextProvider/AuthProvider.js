import { useEffect, useState } from "react";
import { getAuth } from "../Services/Auth";
import { AuthContext } from "./Context";
import { useLocation, useNavigate } from "react-router-dom";



export default function AuthProvider({ children }) {

    const location = useLocation();

    const navigate = useNavigate();

    const [auth, setAuth] = useState(getAuth());
   
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if (auth.accessToken && auth.refreshToken) {
    //             refreshToken(auth.refreshToken)
    //                 .then(res => {
    //                     setAuth({
    //                         accessToken: res.accessToken,
    //                         refreshToken: res.refreshToken,
    //                         role: res.role,
    //                         usename: res.username
    //                     });
    //                 })
    //                 .catch(e => {
    //                     console.log(e);
    //                     setAuth({});
    //                     navigate('/');
    //                 });
    //         }

    //     }, 1000 * 60 * 10);
    //     return () => clearInterval(interval);
    // }, [auth]);

    useEffect(() => {
     
            setAuth(JSON.parse(localStorage.getItem('auth')));
        
    }, []);
    return (
        <AuthContext.Provider value={{ auth}}>
            {children}
        </AuthContext.Provider>
    )
    
}