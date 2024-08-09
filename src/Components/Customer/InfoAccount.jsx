import { useEffect, useState } from 'react';
import {
    changePass,
    getCurrentAccount,
    updateAccount,
} from '../../Services/AccountService';
import { toast } from 'react-toastify';
import useAuth from '../../CustomHooks/useAuth';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../Fragments/LoadingSpinner';
import useModal from '../../CustomHooks/useModal';
import { Helmet } from 'react-helmet-async';
import usePagination from '../../CustomHooks/usePagination';
import CustomPagination from '../Fragments/CustomPagination';
import { getAllPurchasedOrders } from '../../Services/InvoiceService';
import { Card, Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';

export default function InfoAccount() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [accountUpdateDto, setAccountUpdateDto] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
    });
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAccount, setIsLoadingAccount] = useState(true);
    const { openModal, closeModal } = useModal();
    const [newPass, setNewPass] = useState('');
    const [currentPass, setCurrentPass] = useState('');
    const [reNewPass, setReNewPass] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [tab, setTab] = useState('info');
    const { searchParams } = usePagination();
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState();
    const [currentPage, setCurrentPage] = useState();
    const [listOrders, setListOrders] = useState([]);

    useEffect(() => {
        if (
            newPass !== '' ||
            showModal ||
            currentPass !== '' ||
            reNewPass !== ''
        ) {
            openModal(
                'Đổi mật khẩu mới',
                <div>
                    <div>Nhập mật khẩu cũ</div>
                    <input
                        value={currentPass}
                        className="form-control mt-3"
                        type="password"
                        onChange={handleSetCurrentPass}
                    />
                    <div>Nhập mật khẩu mới</div>
                    <input
                        value={newPass}
                        className="form-control mt-3"
                        type="password"
                        onChange={handleSetNewPass}
                    />
                    <div>Nhập lại mật khẩu mới</div>
                    <input
                        value={reNewPass}
                        className="form-control mt-3"
                        type="password"
                        onChange={handleSetReNewPass}
                    />
                </div>,
                () => {
                    let isValid = true;

                    if (newPass === '' || reNewPass === '') {
                        isValid = false;
                        toast.error('Mật khẩu mới không được để trống');
                    } else if (currentPass === '') {
                        isValid = false;
                        toast.error('Mật khẩu cũ không được để trống');
                    } else if (newPass !== reNewPass) {
                        isValid = false;
                        toast.error('Nhập lại mật khẩu mới không chính xác');
                    }

                    if (isValid) {
                        setIsLoading(true);
                        changePass(auth.account.id, currentPass, newPass)
                            .then((res) => {
                                toast.success('Đổi mật khẩu thành công');
                                setCurrentPass('');
                                setNewPass('');
                                setReNewPass('');
                            })
                            .catch((error) => {
                                if (
                                    error.response.data ===
                                    'Current password is incorrect'
                                ) {
                                    toast.error('Mật khẩu cũ không chính xác!');
                                } else {
                                    console.error(error);
                                    toast.error('Có lỗi xảy ra!');
                                }
                            })
                            .finally(() => {
                                setIsLoading(false);
                            });

                        closeModal();
                    }
                }
            );
        }
        setShowModal(false);
    }, [showModal, newPass, currentPass, reNewPass]);

    useEffect(() => {
        if (auth.account) {
            fetchAccount();
            fetchOrders();
        } else {
            navigate('/error/403');
        }
    }, [searchParams]);

    const fetchOrders = () => {
        getAllPurchasedOrders(searchParams)
            .then((res) => {
                console.log(res.data);

                setListOrders(res.data.invoices);
                setCurrentPage(res.data.currentPage);
                setTotalPages(res.data.totalPages);
                setTotalItems(res.data.totalItems);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchAccount = () => {
        getCurrentAccount()
            .then((res) => {
                setAccountUpdateDto({
                    name: res.data.name,
                    email: res.data.email,
                    phone: res.data.phone,
                    address: res.data.address,
                });
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoadingAccount(false);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccountUpdateDto({ ...accountUpdateDto, [name]: value });
    };

    const editAccountForm = (e) => {
        e.preventDefault();
        let isValid = true;

        if (accountUpdateDto.email === '') {
            isValid = false;
            setEmailError('Email không được để trống');
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                String(accountUpdateDto.email).toLowerCase()
            )
        ) {
            isValid = false;
            setEmailError('Email không hợp lệ');
        } else {
            setEmailError('');
        }

        if (accountUpdateDto.name === '') {
            isValid = false;
            setNameError('Tên không được để trống');
        } else {
            setNameError('');
        }

        if (isValid) {
            setIsLoading(true);
            updateAccount(accountUpdateDto)
                .then(() => {
                    toast.success('Sửa thành công');
                })
                .catch((error) => {
                    if (error.response.status === 409) {
                        toast.error('Email đã tồn tại');
                        setEmailError('Email đã tồn tại');
                    }
                    console.error(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const handleSetCurrentPass = (e) => {
        setCurrentPass(e.target.value);
    };

    const handleSetNewPass = (e) => {
        setNewPass(e.target.value);
    };

    const handleSetReNewPass = (e) => {
        setReNewPass(e.target.value);
    };

    const handleModal = () => {
        setShowModal(true);
    };
    return (
        <>
            <Helmet>
                <title>Thông tin tài khoản</title>
            </Helmet>
            <div className="container-xl" style={{ minHeight: ' 50vh' }}>
                <div className="d-flex flex-column align-items-center p-5 justify-content-between   ">
                    <nav className="nav justify-content-center">
                        <div className="nav-item position-relative mx-2">
                            <p
                                onClick={() => setTab('info')}
                                className="nav-link text-muted fs-4 "
                                style={
                                    tab === 'info'
                                        ? {
                                              color: 'black',
                                              fontWeight: 'bold',
                                              cursor: 'pointer',
                                          }
                                        : { cursor: 'pointer' }
                                }
                            >
                                Thông tin tài khoản
                            </p>
                            <div
                                className="underline"
                                style={
                                    tab === 'info'
                                        ? {
                                              width: '100%',
                                          }
                                        : {}
                                }
                            ></div>
                        </div>
                        <div className="nav-item position-relative mx-2">
                            <p
                                onClick={() => setTab('order')}
                                className="nav-link text-muted fs-4 "
                                style={
                                    tab === 'order'
                                        ? {
                                              color: 'black',
                                              fontWeight: 'bold',
                                              cursor: 'pointer',
                                          }
                                        : { cursor: 'pointer' }
                                }
                            >
                                Đơn hàng đã mua
                            </p>
                            <div
                                className="underline"
                                style={
                                    tab === 'order'
                                        ? {
                                              width: '100%',
                                          }
                                        : {}
                                }
                            ></div>
                        </div>
                    </nav>

                    {tab === 'info' ? (
                        <div className="my-5 bg-white p-5 shadow border">
                            {isLoadingAccount ? (
                                <LoadingSpinner />
                            ) : (
                                <form onSubmit={editAccountForm}>
                                    <div className="row">
                                        <div className="mb-5 col-6">
                                            <label className="form-label">
                                                Họ và tên
                                                <span style={{ color: 'red' }}>
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                value={accountUpdateDto.name}
                                                onChange={handleInputChange}
                                                name="name"
                                                type="text"
                                                className={`form-control ${
                                                    nameError !== ''
                                                        ? 'border-danger'
                                                        : ''
                                                }`}
                                            />
                                            <span className=" text-danger">
                                                {nameError}
                                            </span>
                                        </div>

                                        <div className="mb-5 col-6">
                                            <label className="form-label">
                                                Số điện thoại
                                                <span style={{ color: 'red' }}>
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                value={accountUpdateDto.phone}
                                                disabled
                                                type="text"
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="mb-5 col-6">
                                            <label className="form-label">
                                                Email
                                                <span style={{ color: 'red' }}>
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                value={accountUpdateDto.email}
                                                onChange={handleInputChange}
                                                name="email"
                                                type="text"
                                                className={`form-control ${
                                                    emailError !== ''
                                                        ? 'border-danger'
                                                        : ''
                                                }`}
                                            />
                                            <span className=" text-danger">
                                                {emailError}
                                            </span>
                                        </div>

                                        <div className="mb-5 col-6">
                                            <label className="form-label">
                                                Địa chỉ
                                            </label>
                                            <input
                                                value={accountUpdateDto.address}
                                                onChange={handleInputChange}
                                                name="address"
                                                type="text"
                                                className="form-control"
                                            />
                                        </div>
                                    </div>

                                    <div className=" col-6 d-flex justify-content-start">
                                        <button
                                            disabled={isLoading}
                                            style={{ textAlign: 'center' }}
                                            type="submit"
                                            className="col-2 btn btn-dark me-3"
                                        >
                                            Lưu
                                        </button>
                                        {isLoading && <LoadingSpinner />}
                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={handleModal}
                                            className=" btn btn-warning"
                                        >
                                            Đổi mật khẩu
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div className="col-12 container-xxl my-5">
                            {listOrders.length > 0 ? (
                                <>
                                    {listOrders.map((order, index) => (
                                        <>
                                            <Card
                                                key={index}
                                                className="mb-5 shadow"
                                            >
                                                <Card.Header className="bg-dark-subtle">
                                                    <div className="d-flex justify-content-between">
                                                        <small>
                                                            {new Date(
                                                                order.createdAt
                                                            ).toLocaleString()}
                                                        </small>

                                                        <b>
                                                            {
                                                                order.invoiceStatus
                                                            }
                                                        </b>
                                                    </div>
                                                </Card.Header>
                                                <Card.Body className="bg-body-tertiary">
                                                    <div className="d-flex flex-wrap justify-content-between">
                                                        <div className="col-5 ">
                                                            <Row className="mb-2">
                                                                <div className="col-4">
                                                                    <strong>
                                                                        Tên:
                                                                    </strong>{' '}
                                                                </div>
                                                                <div className="col-8">
                                                                    {order.name}
                                                                </div>
                                                            </Row>
                                                            <Row className="mb-2">
                                                                <div className="col-4">
                                                                    <strong>
                                                                        Sđt:
                                                                    </strong>{' '}
                                                                </div>
                                                                <div className="col-8">
                                                                    {
                                                                        order.phone
                                                                    }
                                                                </div>
                                                            </Row>
                                                            <Row className="mb-2">
                                                                <div className="col-4">
                                                                    <strong>
                                                                        Địa chỉ:
                                                                    </strong>{' '}
                                                                </div>
                                                                <div className="col-8">
                                                                    {
                                                                        order.address
                                                                    }
                                                                </div>
                                                            </Row>
                                                        </div>
                                                        <div className="col-6 ">
                                                            {order.invoicesDetails.map(
                                                                (
                                                                    detail,
                                                                    index
                                                                ) => (
                                                                    <ListGroup.Item
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <Row className="mb-4">
                                                                            <div className="col-11">
                                                                                <strong>
                                                                                    {
                                                                                        detail.productName
                                                                                    }
                                                                                </strong>
                                                                                <br />
                                                                                <small>
                                                                                    Phân
                                                                                    loại:{' '}
                                                                                    {
                                                                                        detail.color
                                                                                    }{' '}
                                                                                    -{' '}
                                                                                    {
                                                                                        detail.size
                                                                                    }
                                                                                </small>
                                                                                <br />
                                                                                <small>
                                                                                    Giá:{' '}
                                                                                    {detail.price.toLocaleString(
                                                                                        'vi-VN',
                                                                                        {
                                                                                            style: 'currency',
                                                                                            currency:
                                                                                                'VND',
                                                                                        }
                                                                                    )}
                                                                                </small>
                                                                            </div>
                                                                            <div className="col-1 d-flex align-items-center text-right">
                                                                                x
                                                                                {
                                                                                    detail.quantity
                                                                                }
                                                                            </div>
                                                                        </Row>
                                                                    </ListGroup.Item>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    <hr />

                                                    <div className=" d-flex flex-column align-items-end">
                                                        <small>
                                                            Phí Ship:{' '}
                                                            {order.shippingFee.toLocaleString(
                                                                'vi-VN',
                                                                {
                                                                    style: 'currency',
                                                                    currency:
                                                                        'VND',
                                                                }
                                                            )}
                                                        </small>
                                                        <div>
                                                            <strong>
                                                                Thành tiền:
                                                            </strong>{' '}
                                                            {order.totalBill.toLocaleString(
                                                                'vi-VN',
                                                                {
                                                                    style: 'currency',
                                                                    currency:
                                                                        'VND',
                                                                }
                                                            )}
                                                        </div>
                                                        {order.isPaid && (
                                                            <div className="text-danger">
                                                                (Đã thanh toán)
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </>
                                    ))}
                                </>
                            ) : (
                                <>Bạn chưa có đơn hàng nào</>
                            )}
                            <CustomPagination
                                totalPages={totalPages}
                                currentPage={parseInt(currentPage)}
                                totalItems={totalItems}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
