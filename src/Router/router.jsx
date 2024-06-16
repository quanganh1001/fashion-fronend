import AdminLayout from "../Components/Layout/AdminLayout.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { Outlet, createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Product from "../Components/Admin/Products/Product";
import Category from "../Components/Admin/Categories/Category.jsx";
import Login from "../Components/Auth/Login.jsx";
import HomeAdmin from "../Components/Admin/HomeAdmin.jsx";
import PaginationProvider from "../ContextProvider/PaginationProvider.jsx";
import AddProduct from "../Components/Admin/Products/AddProduct";
import EditProduct from "../Components/Admin/Products/EditProduct";
import AddCategory from "../Components/Admin/Categories/AddCategory.jsx";
import ImageProduct from "../Components/Admin/Products/ImageProduct.jsx";
import EditProductDetail from "../Components/Admin/ProductsDetails/EditProductDetail.jsx";
import AddProductDetail from "../Components/Admin/ProductsDetails/AddProductDetail.jsx";
import EditCategory from "../Components/Admin/Categories/EditCategory.jsx";
import Account from "../Components/Admin/Accounts/Account.jsx";
import EditAccount from "../Components/Admin/Accounts/EditAccount.jsx";
import AddAccount from "../Components/Admin/Accounts/AddAccount.jsx";
import Invoice from "../Components/Admin/Invoices/Invoice.jsx";
import EditInvoiceDetail from "../Components/Admin/Invoices/EditInvoiceDetail.jsx";

export const router = createBrowserRouter([
    {
        path: '',
        element: <App />,
        children: [
            {
                path: 'login',
                element: <Login />,
            },

            {
                path: 'admin',
                element: (
                    <ProtectedRoute
                        hasAnyRoles={['ROLE_MANAGER', 'ROLE_EMPLOYEE']}
                    />
                ),
                children: [
                    {
                        path: 'home' || '',
                        element: <HomeAdmin />,
                    },

                    {
                        path: 'products',
                        element: <Outlet />,
                        children: [
                            {
                                index: true,
                                element: (
                                    <PaginationProvider>
                                        <Product />
                                    </PaginationProvider>
                                ),
                            },
                            {
                                path: 'add',
                                element: <AddProduct />,
                            },
                            {
                                path: ':id/edit',
                                element: <EditProduct />,
                            },
                            {
                                path: ':id/images',
                                element: <ImageProduct />,
                            },
                            {
                                path: ':id/productDetail/add',
                                element: <AddProductDetail />,
                            },
                            {
                                path: ':id/productDetail/edit/:pdid',
                                element: <EditProductDetail />,
                            },
                        ],
                    },

                    {
                        path: 'categories',
                        element: <Outlet />,
                        children: [
                            {
                                index: true,
                                element: <Category />,
                            },
                            {
                                path: 'add',
                                element: <AddCategory />,
                            },
                            {
                                path: ':id/edit',
                                element: <EditCategory />,
                            },
                        ],
                    },

                    {
                        path: 'accounts',
                        element: <Outlet />,
                        children: [
                            {
                                index: true,
                                element: <Account />,
                            },
                            {
                                path: 'edit',
                                element: <EditAccount />,
                            },
                            {
                                path: 'add',
                                element: <AddAccount />,
                            },
                        ],
                    },

                    {
                        path: 'invoices',
                        element: <Outlet />,
                        children: [
                            {
                                index: true,
                                element: (
                                    <PaginationProvider>
                                        <Invoice />
                                    </PaginationProvider>
                                ),
                            },
                            {
                                path: ':id/invoicesDetail',
                                element: <EditInvoiceDetail />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
