import { useEffect, useState } from 'react';
import { register } from '../../Services/Auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../CustomHooks/useAuth';
import LoadingSpinner from '../Fragments/LoadingSpinner';

export default function Register() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.token) {
            navigate('/');
        }
    }, [auth]);

    const [accountRegisterDto, setAccountRegisterDto] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccountRegisterDto({ ...accountRegisterDto, [name]: value });
    };

    const registerForm = (e) => {
        e.preventDefault();
        let isValid = true;

        if (accountRegisterDto.name === '') {
            isValid = false;
            setNameError('Tên không được để trống');
        } else {
            setNameError('');
        }

        if (accountRegisterDto.address === '') {
            isValid = false;
            setAddressError('Địa chỉ không được để trống');
        } else {
            setAddressError('');
        }

        if (accountRegisterDto.phone === '') {
            isValid = false;
            setPhoneError('Số điện thoại không được để trống');
        } else if (isNaN(accountRegisterDto.phone)) {
            isValid = false;
            setPhoneError('Số điện thoại không hợp lệ');
        } else {
            setPhoneError('');
        }

        if (accountRegisterDto.email === '') {
            isValid = false;
            setEmailError('Email không được để trống');
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                String(accountRegisterDto.email).toLowerCase()
            )
        ) {
            isValid = false;
            setEmailError('Email không hợp lệ');
        } else {
            setEmailError('');
        }

        if (isValid) {
            setIsLoading(true);
            register(accountRegisterDto)
                .then((res) => {
                    toast.success(
                        'Đăng ký tài khoản thành công! Mật khẩu sẽ được gửi về Email'
                    );
                    navigate('/');
                })
                .catch((error) => {
                    if (error.response.data.startsWith('Email')) {
                        toast.error('Email này đã được đăng ký rồi!');
                    } else if (error.resonse.data.startsWith('Phone')) {
                        toast.error('Số điện thoại này đã được đăng ký rồi!');
                    } else {
                        console.error(error);
                        toast.error('Có lỗi xảy ra!');
                    } 
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };
    return (
        <>
            <div className="container-xl d-flex flex-column align-items-center my-5">
                <h2 className="mb-4">Đăng ký tài khoản</h2>
                <div className="mt-3 bg-white p-5 shadow border">
                    <form onSubmit={registerForm}>
                        <div className="row">
                            <div className="mb-3 col-6">
                                <label className="form-label">
                                    Họ và tên
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className={`form-control ${
                                        nameError !== '' && 'border-danger'
                                    }`}
                                    onChange={handleInputChange}
                                />
                                <span className=" text-danger">
                                    {nameError}
                                </span>
                            </div>

                            <div className="mb-3 col-6">
                                <label className="form-label">
                                    Số điện thoại
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    className={`form-control ${
                                        phoneError !== '' && 'border-danger'
                                    }`}
                                    onChange={handleInputChange}
                                />
                                <span className=" text-danger">
                                    {phoneError}
                                </span>
                            </div>

                            <div className="mb-3 col-6">
                                <label className="form-label">
                                    Email<span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    name="email"
                                    className={`form-control ${
                                        emailError !== '' && 'border-danger'
                                    }`}
                                />
                                <span className=" text-danger">
                                    {emailError}
                                </span>
                            </div>

                            <div className="mb-3 col-6">
                                <label className="form-label">
                                    Địa chỉ
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    name="address"
                                    className={`form-control ${
                                        addressError !== '' && 'border-danger'
                                    }`}
                                />
                                <span className=" text-danger">
                                    {addressError}
                                </span>
                            </div>
                            <div className="mt-3 col-12 d-flex justify-content-center">
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className=" col-4 button"
                                >
                                    Tạo tài khoản
                                </button>
                                {isLoading && <LoadingSpinner />}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
