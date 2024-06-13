import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import useAuth from '../CustomHooks/useAuth';

export const ProtectedRoute = ({ hasAnyRoles }) => {
    const location = useLocation();
    const { id } = useParams();
    const { auth } = useAuth();
    const isEditAccountAdminPage = location.pathname.startsWith(
        '/admin/accounts/edit/'
    );

    if (auth.token && hasAnyRoles?.includes(auth.account.role)) {
        if (isEditAccountAdminPage) {
            if (auth.account.id === Number(id)) {
                return <Outlet />;
            } else {
                console.log('Bạn không có quyền truy cập');
                return <Navigate to="/login" />;
            }
        }

        return <Outlet />;
    }

    console.log('Bạn không có quyền truy cập');
    return <Navigate to="/login" />;
};
