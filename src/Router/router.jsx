import { ProtectedRoute } from './ProtectedRoute.jsx';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import Product from '../Components/Customer/Product.jsx';
import CategoryAdmin from '../Components/Admin/Categories/CategoryAdmin.jsx';
import Category from '../Components/Customer/Category.jsx';
import AdminLogin from '../Components/Auth/AdminLogin.jsx';
import HomeAdmin from '../Components/Admin/HomeAdmin.jsx';
import PaginationProvider from '../ContextProvider/PaginationProvider.jsx';
import AddProduct from '../Components/Admin/Products/AddProduct';
import EditProduct from '../Components/Admin/Products/EditProduct';
import AddCategory from '../Components/Admin/Categories/AddCategory.jsx';
import ImageProduct from '../Components/Admin/Products/ImageProduct.jsx';
import EditProductDetail from '../Components/Admin/ProductsDetails/EditProductDetail.jsx';
import AddProductDetail from '../Components/Admin/ProductsDetails/AddProductDetail.jsx';
import EditCategory from '../Components/Admin/Categories/EditCategory.jsx';
import Account from '../Components/Admin/Accounts/Account.jsx';
import EditAccount from '../Components/Admin/Accounts/EditAccount.jsx';
import AddAccount from '../Components/Admin/Accounts/AddAccount.jsx';
import Invoice from '../Components/Admin/InvoicesOnline/Invoice.jsx';
import EditInvoiceDetail from '../Components/Admin/InvoicesOnline/EditInvoiceDetail.jsx';
import Home from '../Components/Customer/Home.jsx';
import PublicLayout from '../Components/Layout/PublicLayout.jsx';
import ProductAdmin from '../Components/Admin/Products/ProductAdmin.jsx';
import Cart from '../Components/Customer/Cart.jsx';
import PaymentResponse from '../Components/Customer/PaymentResponse.jsx';
import Register from '../Components/Auth/Register.jsx';
import Store from '../Components/Customer/Store.jsx';
import CustomerEmail from '../Components/Admin/CustomerEmails/CustomerEmail.jsx';
import Introduce from '../Components/Customer/Introduce.jsx';
import ReturnPolicy from '../Components/Customer/ReturnPolicy.jsx';
import PrivatePolicy from '../Components/Customer/PrivatePolicy.jsx';
import ContactUs from '../Components/Customer/ContactUs.jsx';
import FeedbackCustomer from '../Components/Admin/FeedbackCustomers/FeedbackCustomer.jsx';
import NotFoundPage from '../Components/ErrorPage/NotFoundPage.jsx';
import AccessDenied from '../Components/ErrorPage/AccessDenied.jsx';
import ErrorPage from '../Components/ErrorPage/ErrorPage.jsx';
import InternalServerError from '../Components/ErrorPage/InternalServerError.jsx';
import InfoAccount from '../Components/Customer/InfoAccount.jsx';
import ClientLogin from '../Components/Auth/ClientLogin.jsx';
import InvoiceStore from '../Components/Admin/InvoicesStore/InvoiceStore.jsx';
import CreateInvoice from '../Components/Admin/InvoicesStore/CreateInvoice.jsx';
import InvoiceDetailAtStore from '../Components/Admin/InvoicesStore/InvoiceDetailAtStore.jsx';

export const router = createBrowserRouter([
    {
        path: '',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'error',
                element: (
                    <PublicLayout>
                        <Outlet />
                    </PublicLayout>
                ),
                children: [
                    {
                        path: '403',
                        element: <AccessDenied />,
                    },
                    {
                        path: '404',
                        element: <NotFoundPage />,
                    },
                    {
                        path: '500',
                        element: <InternalServerError />,
                    },
                ],
            },

            {
                path: 'login-admin',

                element: <AdminLogin />,
            },

            {
                path: '',
                element: (
                    <PublicLayout>
                        <Outlet />
                    </PublicLayout>
                ),
                children: [
                    {
                        path: 'login',
                        element: <ClientLogin />,
                    },
                    {
                        index: true,
                        element: <Home />,
                    },
                    {
                        path: 'register',
                        element: <Register />,
                    },
                    {
                        path: 'stores',
                        element: <Store />,
                    },
                    {
                        path: 'introduce',
                        element: <Introduce />,
                    },
                    {
                        path: 'returnPolicy',
                        element: <ReturnPolicy />,
                    },
                    {
                        path: 'privatePolicy',
                        element: <PrivatePolicy />,
                    },
                    {
                        path: 'contactUs',
                        element: <ContactUs />,
                    },
                    {
                        path: 'category/:catId',
                        element: (
                            <PaginationProvider>
                                <Category />
                            </PaginationProvider>
                        ),
                    },
                    {
                        path: 'product/:id',
                        element: <Product />,
                    },
                    {
                        path: 'cart',
                        element: <Cart />,
                    },
                    {
                        path: 'infoAccount',
                        element: (
                            <PaginationProvider>
                                <InfoAccount />
                            </PaginationProvider>
                        ),
                    },
                    {
                        path: 'response',
                        element: <PaymentResponse />,
                    },
                ],
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
                                        <ProductAdmin />
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
                                element: <CategoryAdmin />,
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
                                element: (
                                    <PaginationProvider>
                                        <Account />
                                    </PaginationProvider>
                                ),
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
                        path: 'invoices/online',
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
                    {
                        path: 'invoices/store',
                        element: <Outlet />,
                        children: [
                            {
                                index: true,
                                element: (
                                    <PaginationProvider>
                                        <InvoiceStore />
                                    </PaginationProvider>
                                ),
                            },
                            {
                                path: 'create',
                                element: <CreateInvoice />,
                            },
                            {
                                path: 'detail/:id',
                                element: <InvoiceDetailAtStore />,
                            },
                        ],
                    },

                    {
                        path: 'customerEmails',
                        element: <CustomerEmail />,
                    },

                    {
                        path: 'feedbackCustomers',
                        element: (
                            <PaginationProvider>
                                <FeedbackCustomer />
                            </PaginationProvider>
                        ),
                    },
                ],
            },
        ],
    },
]);
