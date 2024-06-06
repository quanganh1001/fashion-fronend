import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { RouterProvider } from 'react-router-dom';
import { router } from './Router/router'; 
import "./fontawesome.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    
    
      <RouterProvider router={router} />

    
  </React.StrictMode>
);

reportWebVitals();
