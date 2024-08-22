import React from 'react'
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function AccessDenied() {
  return (
      <>
          <div
              className="container-xl my-5 col-12 d-flex flex-column align-items-center justify-content-center"
              style={{ minHeight: '30vh' }}
          >
              <Helmet>
                  <title>403</title>
              </Helmet>
              <h1>Đã xảy ra lỗi</h1>
              <p>Bạn không có quyền truy cập trang này!</p>
              <Link to="/login-admin" className="btn btn-warning">
                  Đăng nhập
              </Link>
          </div>
      </>
  );
 }