import AdminLayout from "../Components/Layout/AdminLayout.js";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { Outlet, createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Product from "../Components/Admin/Products/Product.js";
import Category from "../Components/Admin/Category.js";
import Login from "../Components/Auth/Login.js";
import HomeAdmin from "../Components/Admin/HomeAdmin.js";
import PaginationProvider from "../ContextProvider/PaginationProvider.js";
import AddProduct from "../Components/Admin/Products/AddProduct.js";

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
            path: "",
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
                element: (
                  <PaginationProvider>
                    <AddProduct />
                  </PaginationProvider>
                ),
              },
            ],
          },

          {
            path: "categories",
            element: (
              <PaginationProvider>
                <Category />
              </PaginationProvider>
            ),
          },
        ],
      },
    ],
  },
]);
