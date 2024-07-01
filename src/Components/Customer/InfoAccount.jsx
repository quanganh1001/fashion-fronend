import { useEffect, useState } from "react";
import { getCurrentAccount, updateAccount } from "../../Services/AccountService";
import { toast } from 'react-toastify';
import useAuth from "../../CustomHooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function InfoAccount() {
    const [currentAccount, setCurrentAccount] = useState('')
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [accountUpdateDto, setAccountUpdateDto] = useState({
        name: '',
        phone: "",
        email: "",
        address:""
    })
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    
    useEffect(() => {
        if (auth.account) {
            fetchAccount();
        } else {
            navigate("/error/403");
        }
        
    }, [])
    
    const fetchAccount = () => {
        getCurrentAccount()
            .then((res) => {
                setCurrentAccount(res.data)
            });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccountUpdateDto({ ...accountUpdateDto, [name]: value });
    };

    const editAccountForm = async (e) => {
        e.preventDefault();
        let isValid = true;

        if (accountUpdateDto.phone === '') {
            isValid = false;
            setPhoneError('Số điện thoại không được để trống');
        } else if (isNaN(accountUpdateDto.phone)) {
            isValid = false;
            setPhoneError('Số điện thoại không hợp lệ');
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
            await updateAccount(accountUpdateDto)
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
                });
        }
    };
    return (
        <>
            <div className="container-xl" style={{ minHeight: ' 50vh' }}>
                <div className="d-flex flex-column align-items-center p-5   ">
                    <h2>Cập nhập tài khoản</h2>
                    <div className="my-5 bg-white p-5 shadow border">
                        <form onSubmit={editAccountForm}>
                            <div className="row">
                                <div className="mb-5 col-6">
                                    <label className="form-label">
                                        Họ và tên
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        defaultValue={currentAccount.name}
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
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        defaultValue={currentAccount.phone}
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
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        defaultValue={currentAccount.email}
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
                                        defaultValue={currentAccount.address}
                                        onChange={handleInputChange}
                                        name="address"
                                        type="text"
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className=" col-6 d-flex justify-content-start">
                                <button
                                    style={{ textAlign: 'center' }}
                                    type="submit"
                                    className="col-2 btn btn-dark me-3"
                                >
                                    Lưu
                                </button>
                                <button
                                    type="submit"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal-change-pass"
                                    className=" btn btn-warning"
                                >
                                    Đổi mật khẩu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
