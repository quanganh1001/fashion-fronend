import React from 'react';
import Header from '../Fragments/Header';
import Footer from '../Fragments/Footer';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className=" flex-grow-1" style={{ minHeight: "50vh" }}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}
