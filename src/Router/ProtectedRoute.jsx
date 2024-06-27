import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import useAuth from '../CustomHooks/useAuth';
import AdminLayout from '../Components/Layout/AdminLayout';

export const ProtectedRoute = ({ hasAnyRoles }) => {
    const location = useLocation();

    const { auth } = useAuth();

    if (!auth.token) {
        console.log('Bạn không có quyền truy cập');
        return <Navigate to="/login" />;
    }

    if (
        (location.pathname.startsWith('/admin/products') ||
            location.pathname.startsWith('/admin/categories') ||
            (location.pathname.startsWith('/admin/accounts') &&
                (!location.pathname.endsWith('/edit') ||
                    location.pathname.endsWith('/add')))) &&
        (auth.account.role !== 'ROLE_MANAGER')
    ) {
        console.log('Bạn không có quyền truy cập');
        return <Navigate to="/login" />;
    }

    if (auth.token && hasAnyRoles?.includes(auth?.account?.role)) {
        return (
            <AdminLayout>
                <Outlet />
            </AdminLayout>
        );
    }

    console.log('Bạn không có quyền truy cập');
    return <Navigate to="/login" />;
};
