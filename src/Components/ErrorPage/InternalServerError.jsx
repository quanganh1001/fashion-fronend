import React from 'react';
import { Link } from 'react-router-dom';

export default function InternalServerError() {
    return (
        <>
            <div
                className="container-xl my-5 col-12 d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: '30vh' }}
            >
                <h1>Opps!!</h1>
                <p>Xảy ra lỗi từ phía máy chủ!</p>
                <Link to="/" className="btn btn-warning">
                    Về trang chủ
                </Link>
            </div>
        </>
    );
}
