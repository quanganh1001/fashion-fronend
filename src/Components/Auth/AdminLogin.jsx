/* eslint-disable no-restricted-globals */
import { useEffect, useState } from 'react';
import useAuth from '../../CustomHooks/useAuth';
import { toast } from 'react-toastify';
import LoadingSpinner from '../Fragments/LoadingSpinner';
import { resetPass } from '../../Services/Auth';
import useModal from '../../CustomHooks/useModal';


export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passBlank, setPassBlank] = useState('');
    const [usernameBlank, setUsernameBlank] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const { handleLoginAdmin } = useAuth();
    const { openModal, closeModal } = useModal();

    useEffect(() => {
        if (email !== '' || showModal) {
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
        setShowModal(false);
        setEmail('');
    }, [email, showModal]);

    const handleSetEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleResetPass = () => {
        setShowModal(true);
    };

    const submitForm = async (event) => {
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
                await handleLoginAdmin({ username, password });
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
                } else {
                    toast.error('Có lỗi xảy ra!');
                    console.error(error);
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div
            style={{
                backgroundImage: `url('/slide_3_img.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100vh',
            }}
            className=" position-relative d-flex flex-wrap flex-column align-items-center"
        >
            <form
                style={{
                    left: '10%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    height: '50%',
                }}
                onSubmit={submitForm}
                className=" col-4 rounded-5 position-absolute bg-white shadow py-3 d-flex justify-content-around flex-wrap flex-column align-items-center"
            >
                <h3>Đăng nhập Admin</h3>
                <div className="col-8 form-floating ">
                    <input
                        type="text"
                        placeholder="Nhập email"
                        className={
                            usernameBlank === ''
                                ? 'form-control bg-body-tertiary'
                                : 'border-danger bg-body-tertiary form-control'
                        }
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <label className="fw-lighter fst-italic">
                        Email hoặc số điện thoại
                    </label>
                    <span className="text-danger ">{usernameBlank}</span>
                </div>
                <div className="col-8 form-floating">
                    <input
                        id="password"
                        type="password"
                        className={
                            passBlank === ''
                                ? 'form-control bg-body-tertiary'
                                : 'border-danger bg-body-tertiary form-control'
                        }
                        placeholder="Mật khẩu"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <label className="fw-lighter fst-italic">Mật khẩu</label>
                    <span className="text-danger">{passBlank}</span>
                    <span className="text-danger">{error}</span>
                </div>
                <div className="col-8 d-flex justify-content-center">
                    <div
                        onClick={handleResetPass}
                        className=" fst-italic text-decoration-underline text-dark"
                        style={{ cursor: 'pointer' }}
                    >
                        Quên mật khẩu?
                    </div>
                </div>

                <div className="col-12 d-flex justify-content-center">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="btn btn-dark bg-gradient col-4"
                    >
                        Đăng nhập
                    </button>
                    {isLoading && <LoadingSpinner />}
                </div>
            </form>
        </div>
    );
}
