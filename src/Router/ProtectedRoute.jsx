import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../CustomHooks/useAuth';
import AdminLayout from '../Components/Layout/AdminLayout';
import FeedbackProvider from '../ContextProvider/FeedbackProvider';

export const ProtectedRoute = ({ hasAnyRoles }) => {
    const location = useLocation();

    const { auth } = useAuth();

    if (!auth || !auth.account) {
        console.log('Bạn không có quyền truy cập');
        return <Navigate to="/error/403" />;
    }

    if (
        (location.pathname.startsWith('/admin/products') ||
            location.pathname.startsWith('/admin/categories') ||
            (location.pathname.startsWith('/admin/accounts') &&
                (!location.pathname.endsWith('/edit') ||
                    location.pathname.endsWith('/add')))) &&
        (auth?.account?.role !== 'ROLE_MANAGER')
    ) {
        console.log('Bạn không có quyền truy cập');
        return <Navigate to="/error/403" />;
    }

    if (auth.token && hasAnyRoles?.includes(auth?.account?.role)) {
        return (
            <FeedbackProvider>
                <AdminLayout>
                    <Outlet />
                </AdminLayout>
            </FeedbackProvider>
        );
    }

    console.log('Bạn không có quyền truy cập');
    return <Navigate to="/error/403" />;
};
