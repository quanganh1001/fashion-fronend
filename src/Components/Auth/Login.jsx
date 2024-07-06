/* eslint-disable no-restricted-globals */
import { useEffect, useState } from 'react';
import useAuth from '../../CustomHooks/useAuth';
import { toast } from 'react-toastify';
import LoadingSpinner from '../Fragments/LoadingSpinner';
import { resetPass } from '../../Services/Auth';
import useModal from '../../CustomHooks/useModal';
import { Link } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passBlank, setPassBlank] = useState('');
    const [usernameBlank, setUsernameBlank] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { handleLogin } = useAuth();
    const { openModal, closeModal } = useModal();

    useEffect(() => {
        if (email !== "" || showModal) {
            openModal(
                'Cấp lại mật khẩu',
                <div>
                    <div>Nhập email đăng ký</div>
                    <input
                        value={email}
                        className="form-control mt-3"
                        type="email"
                        onChange={handleSetEmail}
                    />
                </div>,
                () => {
                    let isValid = true;

                    if (email === '') {
                        isValid = false;
                        toast.error('Email không được để trống');
                    } else if (
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                            String(email).toLowerCase()
                        )
                    ) {
                        isValid = false;
                        toast.error('Email không hợp lệ');
                    }

                    if (isValid) {
                        resetPass(email)
                            .then((res) => {
                                toast.success(
                                    'Mật khẩu mới được gửi về email đăng ký!'
                                );
                            })
                            .catch((error) => {
                                toast.error('Có lỗi xảy ra!');
                            });
                        closeModal();
                    }
                }
            );
        }
        setShowModal(false)
        setEmail('');
    }, [email,showModal]);

    const handleSetEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleResetPass = () => {
            setShowModal(true)
    };

    const submitForm =  (event) => {
        event.preventDefault();

        let valid = true;

        if (password === '') {
            setPassBlank('Mật khẩu không được để trống');
            valid = false;
        } else {
            setPassBlank('');
        }

        if (username === '') {
            valid = false;
            setUsernameBlank('Tên đăng nhập không được để trống');
        } else {
            setUsernameBlank('');
        }

        if (valid) {
            try {
                setIsLoading(true);
                 handleLogin({ username, password });
                toast.success('Đăng nhập thành công!');
            } catch (error) {
                setIsLoading(false);
                if (error.response.data === 'Invalid username or password') {
                    toast.error('Sai tên đăng nhập hoặc mật khẩu');
                    setError('Sai tên đăng nhập hoặc mật khẩu');
                } else if (
                    error.response.data === 'Account has been deactivated'
                ) {
                    toast.error('Tài khoản không hoạt động');
                    setError('Tài khoản không hoạt động');
                }
            }
        }
    };

    return (
        <div className="p-5 d-flex flex-column align-items-center">
            <h2>ĐĂNG NHẬP</h2>
            <div className="mt-5 bg-white p-5 shadow border col-8">
                <div className="card-body">
                    <p className="login-box-msg">Đăng nhập</p>
                    <form onSubmit={submitForm}>
                        <div className=" mb-3">
                            <input
                                id="username"
                                type="text"
                                className={
                                    usernameBlank === ''
                                        ? 'form-control'
                                        : 'border-danger form-control'
                                }
                                placeholder="Tên đăng nhập"
                                onChange={(event) =>
                                    setUsername(event.target.value)
                                }
                            />
                            <span className="text-danger">{usernameBlank}</span>
                        </div>
                        <div className=" mb-3">
                            <input
                                id="password"
                                type="password"
                                className={
                                    passBlank === ''
                                        ? 'form-control'
                                        : 'border-danger form-control'
                                }
                                placeholder="Mật khẩu"
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />
                            <span className="text-danger">{passBlank}</span>
                            <span className="text-danger">{error}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <div
                                onClick={handleResetPass}
                                className=" fst-italic text-decoration-underline text-dark"
                                style={{ cursor: 'pointer' }}
                            >
                                Quên mật khẩu?
                            </div>
                            <Link
                                to={'/register'}
                                style={{ cursor: 'pointer' }}
                                className=" text-dark"
                            >
                                Đăng ký tài khoản
                            </Link>
                        </div>
                        <div className="row mt-3">
                            <div className="col-4 d-flex align-items-center">
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="btn btn-dark bg-gradient"
                                >
                                    Đăng nhập
                                </button>
                                {isLoading && <LoadingSpinner />}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
