import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router/router';
import './fontawesome.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalProvider from './ContextProvider/ModalProvider.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ModalProvider>
            <RouterProvider router={router} />
            <ToastContainer autoClose={2000} />
        </ModalProvider>
    </React.StrictMode>
);

reportWebVitals();
