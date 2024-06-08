import {  useState,useEffect } from "react";
import { getAuth, login, logout } from "../Services/Auth";
import { AuthContext } from "./Context";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



export default function AuthProvider({ children }) {

    const location = useLocation();

    const navigate = useNavigate();

    const redirectTo = location.state?.redirectTo?.pathname || "/admin/home";

    const [auth, setAuth] = useState(getAuth());

   useEffect(() => {
     localStorage.setItem("auth", JSON.stringify(auth));
   }, [auth]);
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

    const handleLogin = async (data) => {
        await login(data)
          .then((res) => {
                setAuth({
                  token: res.data.token,
                  refreshToken: res.data.refreshToken,
                  role: res.data.role,
                  username: res.data.username
                });
                navigate(redirectTo, { replace: true });
            })
           
    }

    const handleLogout = async () => {
      await logout()
        .then((res) => {
            if (res.status === 200) {
              setAuth({});
              navigate('/');
            }   
        }) 
    };
    
    return (
      <AuthContext.Provider value={{ auth, handleLogin, handleLogout }}>
        {children}
      </AuthContext.Provider>
    );
    
}