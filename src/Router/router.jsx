import AdminLayout from "../components/Layout/AdminLayout.js";
import { ProtectedRoute } from "./ProtectedRoute"
import { Outlet, createBrowserRouter } from "react-router-dom"
import App from "../App";
import PaginationProvider from "../ContextProvider/PaginationProvider";
import Product from "../components/Admin/Product"
import Category from "../components/Admin/Category"
import Login from "../components/Auth/Login";
import HomeAdmin from "../components/Admin/HomeAdmin.js";

export const router = createBrowserRouter([
    {
        path: '',
        element: <App />,
        children: [
            {
                path: 'login',
                element: <Login />
            },

            {
                path: 'admin',
                element:
                    <AdminLayout>
                        <ProtectedRoute hasAnyRoles={['ROLE_MANAGER','ROLE_EMPLOYEE']} />
                    </AdminLayout>,
                children: [
                    {
                        path: '',
                        element: <Outlet />,
                        children: [
                            {
                                index: true,
                                element:     
                                        <HomeAdmin />
                            },
                            
                        ]
                    },

                    {
                        path: 'products',
                        element: (
                            <PaginationProvider>
                                <Product />
                            </PaginationProvider>
                        )
                    },

                    {
                        path: 'categories',
                        element: <Outlet />,
                        children: [
                            {
                                element:
                                    <PaginationProvider>
                                        <Category />
                                    </PaginationProvider>
                            },
                            
                        ]
                    }
                ]
            }

        ]
    }
]);
