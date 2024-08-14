import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../../Services/CategoryService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAuth from '../../CustomHooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useCart from '../../CustomHooks/useCart';
import useModal from '../../CustomHooks/useModal';
import { resetPass } from '../../Services/Auth';
import LoadingSpinner from './LoadingSpinner';

export default function Header() {
    const [listCategoriesF1, setListCategoriesF1] = useState([]);
    const [listCategoriesF2, setListCategoriesF2] = useState([]);
    const [listCategoriesF3, setListCategoriesF3] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchValid, setSearchValid] = useState(false);
    const { auth, handleLogout, handleLoginClient } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passBlank, setPassBlank] = useState('');
    const [usernameBlank, setUsernameBlank] = useState('');
    const [error, setError] = useState('');
    const [isShowFormLogin, setIsShowFormLogin] = useState(false);
    const [hoveredF1, setHoveredF1] = useState(null);
    const [activeClass, setActiveClass] = useState('');
    const navigate = useNavigate();
    const { totalCartItems, isLoadingCart } = useCart();
    const { openModal, closeModal } = useModal();
    const [email, setEmail] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingLogin, setIsLoadingLogin] = useState(false);
    const [isLoadingLogout, setIsLoadingLogout] = useState(false);

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

    useEffect(() => {
        if (hoveredF1 !== null) {
            setTimeout(() => {
                setActiveClass('show');
            }, 50);
        } else {
            setActiveClass('');
        }
    }, [hoveredF1]);

    useEffect(() => {
        fetchAllCategories();
    }, []);

    const fetchAllCategories = () => {
        getAllCategories()
            .then((res) => {
                setIsLoading(false);
                const categories = res.data;

                const categoriesF1 = categories.filter(
                    (category) => category.catParent === null
                );
                setListCategoriesF1(categoriesF1);

                // set categoriesF2
                const categoriesF2 = categories.filter((category) =>
                    categoriesF1.some(
                        (f1Category) => f1Category.id === category.catParent
                    )
                );
                setListCategoriesF2(categoriesF2);

                // set categories F3
                const categoriesF3 = categories.filter((category) =>
                    categoriesF2.some(
                        (f2Category) => f2Category.id === category.catParent
                    )
                );
                setListCategoriesF3(categoriesF3);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const searchForm = (e) => {
        e.preventDefault();
        let isValid = true;

        if (searchValue === '') {
            setSearchValid(true);
            isValid = false;
        } else setSearchValid(false);

        if (isValid) {
            navigate('/category/search?key=' + searchValue);
        }
    };

    const logoutForm = async() => {
        setIsLoadingLogout(true);
        await handleLogout();
        setIsLoadingLogout(false);
        toast.success('Đã đăng xuất!');
    };

    const formLogin = async (event) => {
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
             setIsLoadingLogin(true);
            try {
                await handleLoginClient({ username, password });
            } catch (error) {
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
                setIsLoadingLogin(false);
            }
        }
    };

    const handleToggleFormLogin = () => {
        setIsShowFormLogin(!isShowFormLogin);
    };

    const handleSetEmail = (e) => {
        setEmail(e.target.value);
    };
    const handleResetPass = () => {
        setShowModal(true);
    };

    return (
        <>
            <style>
                {`
                    .dropdown-content {
                        opacity: 0;
                        margin-top: 20px;
                        transition: margin-top 0.3s,opacity 0.3s;
                        z-index:5;
                    }
                    .dropdown-content.show {
                        margin-top: 0px;
                        opacity: 1;

                    }
                `}
            </style>

            <nav
                style={{ zIndex: '15' }}
                className=" bg-body-tertiary position-relative shadow-lg d-flex"
            >
                <div className="container-xl  d-flex justify-content-between">
                    <Link
                        className="col-2 menu-item d-flex align-items-center "
                        to={'/'}
                    >
                        <img
                            src={process.env.PUBLIC_URL + '/logo.png'}
                            style={{ width: '100%' }}
                            alt=""
                        />
                    </Link>

                    <div className=" d-flex col-5 justify-content-between">
                        <div className="menu-item py-4 d-flex align-items-center ">
                            <Link
                                to={`/category/sale`}
                                className="   text-dark fw-bold text-decoration-none"
                            >
                                Sale
                            </Link>
                        </div>
                        {isLoading && <LoadingSpinner />}
                        {listCategoriesF1.map((f1) => (
                            <div
                                onMouseLeave={() => {
                                    setHoveredF1(null);
                                }}
                                key={f1.id}
                                onMouseEnter={() => setHoveredF1(f1.id)}
                                className="menu-item py-4 d-flex align-items-center  f1"
                            >
                                <Link
                                    to={`/category/${f1.id}`}
                                    className="   text-dark fw-bold text-decoration-none"
                                >
                                    {f1.catName}
                                </Link>

                                {hoveredF1 === f1.id && (
                                    <div
                                        className={`dropdown-content d-flex flex-wrap pt-3 pb-3 border bg-white position-absolute start-50 top-100 translate-middle-x col-10 rounded-bottom shadow justify-content-around ${activeClass}`}
                                        style={{ zIndex: '51' }}
                                    >
                                        {listCategoriesF2
                                            .filter(
                                                (f2) => f2.catParent === f1.id
                                            )
                                            .map((f2) => (
                                                <div
                                                    key={f2.id}
                                                    className="my-2 d-flex flex-column"
                                                >
                                                    <Link
                                                        to={`/category/${f2.id}`}
                                                        className="text-dark fw-bold text-decoration-none"
                                                    >
                                                        {f2.catName}
                                                    </Link>

                                                    {listCategoriesF3
                                                        .filter(
                                                            (f3) =>
                                                                f3.catParent ===
                                                                f2.id
                                                        )
                                                        .map((f3) => (
                                                            <Link
                                                                key={f3.id}
                                                                to={`/category/${f3.id}`}
                                                                className="mt-3 text-dark text-decoration-none"
                                                            >
                                                                {f3.catName}
                                                            </Link>
                                                        ))}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="d-flex align-items-center">
                            <Link
                                to={'/stores'}
                                className=" text-decoration-none text-dark  fw-bold"
                            >
                                Hệ thống cửa hàng
                            </Link>
                        </div>
                    </div>

                    <div className="col-2 align-self-center">
                        <form onSubmit={searchForm}>
                            <div className="input-group">
                                <input
                                    onChange={(e) =>
                                        setSearchValue(e.target.value)
                                    }
                                    type="text"
                                    className={
                                        searchValid
                                            ? 'border-danger form-control'
                                            : ' form-control'
                                    }
                                    value={searchValue}
                                    placeholder="Tìm kiếm"
                                />
                                <button className="btn border" type="submit">
                                    <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="align-self-center d-flex">
                        <Link
                            to={'/cart'}
                            className="btn btn-outline-dark align-self-center position-relative"
                        >
                            <FontAwesomeIcon icon="fa-solid fa-cart-shopping" />

                            {isLoadingCart ? (
                                <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                    <LoadingSpinner />
                                </span>
                            ) : (
                                <>
                                    {totalCartItems !== 0 && (
                                        <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                                            {totalCartItems}
                                        </span>
                                    )}
                                </>
                            )}
                        </Link>
                        {auth.account ? (
                            <div className="ms-3 d-flex align-items-center">
                                <div className="d-flex flex-column ">
                                    <span>Xin chào, </span>
                                    <Link
                                        to="/infoAccount"
                                        className=" fst-italic text-decoration-underline btn-link text-dark"
                                    >
                                        {auth.account.name}
                                    </Link>
                                </div>
                                {isLoadingLogout ? (
                                    <LoadingSpinner />
                                ) : (
                                    <FontAwesomeIcon
                                        className="btn-link text-dark"
                                        onClick={logoutForm}
                                        style={{
                                            padding: '5px',
                                            cursor: 'pointer',
                                        }}
                                        icon="fa-solid fa-right-from-bracket"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className=" ms-3 position-relative">
                                <button
                                    onClick={handleToggleFormLogin}
                                    type="button"
                                    className={
                                        isShowFormLogin === true
                                            ? 'btn btn-dark'
                                            : 'btn btn-outline-dark'
                                    }
                                >
                                    <FontAwesomeIcon icon="fa-solid fa-user" />
                                    {isShowFormLogin === true ? (
                                        <FontAwesomeIcon
                                            className="ms-1"
                                            icon="fa-solid fa-caret-up"
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            className="ms-1"
                                            icon="fa-solid fa-caret-down"
                                        />
                                    )}
                                </button>
                                {isShowFormLogin === true ? (
                                    <div
                                        className="border rounded-3 p-3 bg-light-subtle bg-gradient position-absolute end-0 top-100 mt-2"
                                        style={{ width: '400px', zIndex: 9999 }}
                                    >
                                        <div className="fw-bold">Đăng nhập</div>

                                        <form
                                            onSubmit={formLogin}
                                            method="post"
                                            className="mt-3"
                                        >
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    name="username"
                                                    className={`form-control ${
                                                        usernameBlank !== ''
                                                            ? 'border-danger'
                                                            : ''
                                                    }`}
                                                    placeholder="Tên đăng nhập"
                                                    onChange={(event) =>
                                                        setUsername(
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                                <span className="text-danger">
                                                    {usernameBlank}
                                                </span>
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className={`form-control ${
                                                        passBlank !== ''
                                                            ? 'border-danger'
                                                            : ''
                                                    }`}
                                                    placeholder="Mật khẩu"
                                                    onChange={(event) =>
                                                        setPassword(
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                                <span className="text-danger">
                                                    {passBlank}
                                                </span>
                                            </div>
                                            <span className="text-danger">
                                                {error}
                                            </span>
                                            <div className="d-flex justify-content-between col-12 mt-3">
                                                <Link
                                                    onClick={handleResetPass}
                                                    className="fst-italic text-decoration-underline btn-link text-dark"
                                                    style={{
                                                        fontSize: '0.9rem',
                                                    }}
                                                >
                                                    Quên mật khẩu?
                                                </Link>
                                                <Link
                                                    to="/register"
                                                    className="btn-link text-dark"
                                                    style={{
                                                        fontSize: '0.9rem',
                                                    }}
                                                >
                                                    Đăng ký tài khoản
                                                </Link>
                                            </div>
                                            <button
                                                disabled={isLoadingLogin}
                                                type="submit"
                                                className="button mt-3"
                                            >
                                                Đăng nhập
                                            </button>
                                            {isLoadingLogin && (
                                                <LoadingSpinner />
                                            )}
                                        </form>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}
