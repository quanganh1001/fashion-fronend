import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../CustomHooks/useAuth';
import { toast } from 'react-toastify';
import useFeedback from '../../CustomHooks/useFeedback';
import { Badge } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';

const Menu = (props) => {
    const [username, setUsername] = useState('');
    const { auth, handleLogout } = useAuth();
    const { totalFeedbackUnread } = useFeedback();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const navItems = [
        {
            path: '/admin/home',
            label: 'TRANG CHỦ',
            requiredRoles: ['ROLE_MANAGER'],
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
            path: '/admin/invoices/online',
            label: 'QUẢN LÝ ĐƠN ONLINE',
        },
        {
            path: '/admin/invoice/store',
            label: 'QUẢN LÝ ĐƠN TẠI QUẦY',
        },
        {
            path: '/admin/customerEmails',
            label: 'GỬI THÔNG TIN KHUYẾN MÃI',
            requiredRoles: ['ROLE_MANAGER'],
        },
        {
            path: '/admin/feedbackCustomers',
            label: 'PHẢN HỒI KHÁCH HÀNG',
            requiredRoles: ['ROLE_MANAGER'],
            badge: totalFeedbackUnread,
        },
    ];

    const location = useLocation();

    useEffect(() => {
        setUsername(auth.account.name);
    }, [auth.account.name]);

    const logout = async () => {
        setIsLoading(true);
        try {
            await handleLogout();
            navigate('/login-admin');
            toast.success('Đã đăng xuất!');
        } catch (error) {
            toast.error('Có lỗi xảy ra!');
        } finally {
            setIsLoading(false);
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
                            <li
                                className="nav-item my-2 position-relative"
                                key={item.label}
                            >
                                <Link
                                    to={item.path}
                                    className={'nav-link ps-3 py-2'}
                                    style={{
                                        backgroundColor:
                                            location.pathname.startsWith(
                                                item.path
                                            )
                                                ? '#E9ECEF'
                                                : 'transparent',
                                        borderRadius:
                                            location.pathname.startsWith(
                                                item.path
                                            )
                                                ? '8px'
                                                : '0',
                                        color: location.pathname.startsWith(
                                            item.path
                                        )
                                            ? '#000'
                                            : '#fff',
                                    }}
                                >
                                    {item.label}
                                </Link>
                                {item.badge !== undefined && (
                                    <Badge className="ms-2 bg-danger position-absolute translate-middle-y top-0 end-0 ">
                                        {item.badge}
                                    </Badge>
                                )}
                            </li>
                        ) : null
                    )}

                    <div className="col-12 border-top">
                        <div className="mb-3 text-light mt-3 ">
                            Xin chào,
                            {username} !{' '}
                            <Link to={'/admin/accounts/edit'}>
                                <FontAwesomeIcon
                                    className="text-warning"
                                    icon="fa-regular fa-eye"
                                />
                            </Link>
                        </div>

                        <button
                            disabled={isLoading}
                            className="btn btn-danger"
                            onClick={logout}
                        >
                            Đăng xuất
                        </button>
                        {isLoading && <LoadingSpinner />}
                    </div>
                </ul>
            </div>
        </>
    );
};

export default Menu;
