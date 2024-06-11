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

export const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },

      {
        path: "admin",
        element: (
          <AdminLayout>
            <ProtectedRoute hasAnyRoles={["ROLE_MANAGER", "ROLE_EMPLOYEE"]} />
          </AdminLayout>
        ),
        children: [
          {
            path: "home",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <HomeAdmin />,
              },
            ],
          },

          {
            path: "products",
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
                path: "add",
                element: <AddProduct />,
              },
              {
                path: ":id/edit",
                element: <EditProduct />,
              },
              {
                path: ":id/images",
                element: <ImageProduct />,
              },
              {
                path: ":id/productDetail/add",
                element: <AddProductDetail />,
              },
              {
                path: ":id/productDetail/edit/:pdid",
                element: <EditProductDetail />,
              },
            ],
          },

          {
            path: "categories",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <Category />,
              },
              {
                path: "add",
                element: <AddCategory />,
              },
              {
                path: ":id/edit",
                element: <EditCategory />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
