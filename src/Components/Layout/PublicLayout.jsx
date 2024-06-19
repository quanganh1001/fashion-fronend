import React from 'react';
import Header from '../Fragments/Header';
import Footer from '../Fragments/Footer';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="container-xl flex-grow-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
