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
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAccount, setIsLoadingAccount] = useState(true);
    const { openModal, closeModal } = useModal();
    const [newPass, setNewPass] = useState('');
    const [currentPass, setCurrentPass] = useState('');
    const [reNewPass, setReNewPass] = useState('');
    const [showModal, setShowModal] = useState(false);

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
        } else {
            navigate('/error/403');
        }
    }, []);

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

    const editAccountForm =  (e) => {
        e.preventDefault();
        let isValid = true;

        if (accountUpdateDto.phone === '') {
            isValid = false;
            setPhoneError('Số điện thoại không được để trống');
        } else if (isNaN(accountUpdateDto.phone)) {
            isValid = false;
            setPhoneError('Số điện thoại không hợp lệ');
        } else if (accountUpdateDto.phone.length !== 10) {
            isValid = false;
            setPhoneError('Số điện thoại phải có 10 ký tự');
        } else {
            setPhoneError('');
        }

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
                        if (error.response.message.startsWith('Phone')) {
                            toast.error('Số điện thoại đã tồn tại');
                            setPhoneError('Số điện thoại đã tồn tại');
                        } else {
                            toast.error('Email đã tồn tại');
                            setPhoneError('Email đã tồn tại');
                        }
                    }
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
                <div className="d-flex flex-column align-items-center p-5   ">
                    <h2>Cập nhập tài khoản</h2>
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
                                            onChange={handleInputChange}
                                            name="phone"
                                            type="text"
                                            className={`form-control ${
                                                phoneError !== ''
                                                    ? 'border-danger'
                                                    : ''
                                            }`}
                                        />
                                        <span className=" text-danger">
                                            {phoneError}
                                        </span>
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
                </div>
            </div>
        </>
    );
}
