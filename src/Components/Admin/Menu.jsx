import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../CustomHooks/useAuth';
import { toast } from 'react-toastify';

const Menu = (props) => {
    const [username, setUsername] = useState('');

    const { auth, handleLogout } = useAuth();

    const navItems = [
        {
            path: '/admin/home',
            label: 'TRANG CHỦ',
        },
        {
            path: '/admin/products',
            label: 'QUẢN LÝ SẢN PHẨM',
            requiredRoles: ['ROLE_MANAGER'],
        },
        {
            path: '/admin/categories',
            label: 'QUẢN LÝ DANH MỤC',
            requiredRoles: ['ROLE_MANAGER'],
        },
        {
            path: '/admin/accounts',
            label: 'QUẢN LÝ TÀI KHOẢN',
            requiredRoles: ['ROLE_MANAGER'],
        },
        {
            path: '/admin/accounts/edit',
            label: 'CÀI ĐẶT TÀI KHOẢN',
            requiredRoles: ['ROLE_EMPLOYEE'],
        },
        {
            path: '/admin/invoices',
            label: 'QUẢN LÝ HÓA ĐƠN',
        },
        
    ];

    const location = useLocation();

    useEffect(() => {
        setUsername(auth.account.name);
    }, [auth.account.name]); 

    const logout = async () => {
        try {
            await handleLogout();
            toast.success('Đã đăng xuất!');
        } catch (error) {
            toast.error('Có lỗi xảy ra!');
        }
    };

    const checkManager = (requiredRoles) => {
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        return requiredRoles.some((role) => auth.account.role.includes(role));
    };

    return (
      <>
        <div className="shadow-lg d-flex flex-column text-white bg-dark bg-gradient min-vh-100">
          <ul className=" list-group p-3 menu ">
            {navItems.map((item) =>
              checkManager(item.requiredRoles) ? (
                <li className="nav-item my-2" key={item.label}>
                  <Link
                    to={item.path}
                    className={"nav-link ps-3 py-2"}
                    style={{
                      backgroundColor: location.pathname.startsWith(item.path)
                        ? "#E9ECEF"
                        : "transparent",
                      borderRadius: location.pathname.startsWith(item.path)
                        ? "8px"
                        : "0",
                      color: location.pathname.startsWith(item.path)
                        ? "#000"
                        : "#fff",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ) : null
            )}

            <div className="col-12 border-top">
              <div className="mb-3 text-light mt-3 ">
                Xin chào,
                {username} !{" "}
                <Link to={"/admin/accounts/edit"}>
                  <FontAwesomeIcon icon="fa-regular fa-eye" />
                </Link>
              </div>

              <button className="btn btn-danger" onClick={logout}>
                Đăng xuất
              </button>
            </div>
          </ul>
        </div>
      </>
    );
};

export default Menu;
