import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../CustomHooks/useAuth";


export const ProtectedRoute = ({ hasAnyRoles }) => {
    const { auth } = useAuth();
    if (auth.token && hasAnyRoles?.includes(auth.role)) {
        
        return <Outlet />;
    }
    
    return < Navigate to='/' />;

    
}

