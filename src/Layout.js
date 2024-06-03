import React from "react";
import "./index.css";
import App from "./App";
import { Route, Routes } from "react-router-dom";
import Category from "./components/Admin/Category";
import Product from "./components/Admin/Product";
import Login from "./components/Auth/Login";


const Layout = (props) => {
    return(
        <>
        <Routes>
        <Route path="/" element={<App />}>
          <Route path="category" element={<Category />} />
          <Route path="product" element={<Product />} />
        </Route>

        <Route path="/login" element={<Login />}></Route>

      </Routes>
      </>
    )
}

export default Layout