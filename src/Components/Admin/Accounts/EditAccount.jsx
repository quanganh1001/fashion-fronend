import { useEffect, useState } from 'react';
import {
    changePass,
    getCurrentAccount,
    updateAccount,
} from '../../../Services/AccountService';
import Tittle from '../../Fragments/Tittle';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import useAuth from '../../../CustomHooks/useAuth';
import useModal from '../../../CustomHooks/useModal';

export default function EditAccount() {
    const [phoneError, setPhoneError] = useState('');

    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingAccount, setIsLoadingAccount] = useState(true);

    const [nameError, setNameError] = useState('');

    const [account, setAccount] = useState({
        phone: '',
        name: '',
        email: '',
        address: '',
    });
    const { openModal, closeModal } = useModal();
    const { auth } = useAuth();
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
        fetchAccount();
    }, []);
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
    const fetchAccount = async () => {
        await getCurrentAccount()
            .then((res) => {
                setAccount({
                    phone: res.data.phone,
                    name: res.data.name,
                    email: res.data.email,
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
        setAccount({ ...account, [name]: value });
    };

    const editAccountForm = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (account.phone === '') {
            isValid = false;
            setPhoneError('Số điện thoại không được để trống');
        } else if (isNaN(account.phone)) {
            isValid = false;
            setPhoneError('Số điện thoại không hợp lệ');
        } else {
            setPhoneError('');
        }

        if (account.email === '') {
            isValid = false;
            setEmailError('Email không được để trống');
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                String(account.email).toLowerCase()
            )
        ) {
            isValid = false;
            setEmailError('Email không hợp lệ');
        } else {
            setEmailError('');
        }

        if (account.name === '') {
            isValid = false;
            setNameError('Tên không được để trống');
        } else {
            setNameError('');
        }

        if (isValid) {
            setIsLoading(true);
            await updateAccount(account)
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

    return (
        <>
            <Tittle tittle="Thông tin tài khoản" />
            <div className="mt-5 bg-white p-5 shadow border">
                {isLoadingAccount ? (
                    <LoadingSpinner />
                ) : (
                    <form onSubmit={editAccountForm}>
                        <div className="row">
                            <div className="mb-3">
                                <label className="form-label">
                                    Tên<span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    className={
                                        nameError !== ''
                                            ? 'border-danger form-control'
                                            : 'form-control'
                                    }
                                    value={account.name}
                                    onChange={handleInputChange}
                                />
                                <span className=" text-danger">
                                    {nameError}
                                </span>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Số điện thoại
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    name="phone"
                                    type="text"
                                    className={
                                        phoneError !== ''
                                            ? 'border-danger form-control'
                                            : 'form-control'
                                    }
                                    value={account.phone}
                                    onChange={handleInputChange}
                                />
                                <span className=" text-danger">
                                    {phoneError}
                                </span>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Email<span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    name="email"
                                    type="text"
                                    className={
                                        emailError !== ''
                                            ? 'border-danger form-control'
                                            : 'form-control'
                                    }
                                    value={account.email}
                                    onChange={handleInputChange}
                                />
                                <span className=" text-danger">
                                    {emailError}
                                </span>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Địa chỉ</label>
                                <input
                                    name="address"
                                    type="text"
                                    className="form-control"
                                    value={account.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
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
        </>
    );
}
