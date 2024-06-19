import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCategories } from '../../Services/CategoryService';

export default function Header() {
    const [listCategoriesF1, setListCategoriesF1] = useState([]);
    const [listCategoriesF2, setListCategoriesF2] = useState([]);
    const [listCategoriesF3, setListCategoriesF3] = useState([]);

    useEffect(() => {
        fetchAllCategories();
    }, []);


    const fetchAllCategories = async () => {
        await getAllCategories()
            .then((res) => {
                const categories = res.data;
                
                const categoriesF1 = categories.filter(
                    (category) => category.catParent === null
                );
                setListCategoriesF1(categoriesF1);

                // set categoriesF2
                const categoriesF2 = categories.filter((category) =>
                    categoriesF1.some(
                        (f1Category) => f1Category.catId === category.parentId
                    )
                );
                setListCategoriesF2(categoriesF2);
                
                // set categories F3
                 const categoriesF3 = categories.filter((category) =>
                     categoriesF2.some(
                         (f2Category) => f2Category.catId === category.parentId
                     )
                 );
                 setListCategoriesF3(categoriesF3);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    

    return (
        <>
            <nav className=" pb-2 pt-2 bg-body-tertiary position-relative shadow-sm d-flex">
                <div className="container-xl d-flex justify-content-between align-sefl">
                    <div className="col-2 align-self-center">
                        <Link>
                            <img src="" style={{ width: '100%' }} alt="" />
                        </Link>
                    </div>

                    <div className=" align-self-end d-flex col-5 justify-content-between">
                        {listCategoriesF1.map((f1) => (
                            <li key={f1.id}>
                                <Link
                                    to={'/categories/' + f1.id}
                                    className=" text-decoration-none text-dark fw-bold"
                                >
                                    {f1.catName}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link className=" text-decoration-none text-dark  fw-bold">
                                Hệ thống cửa hàng
                            </Link>
                        </li>
                    </div>

                    <div className="bg-white">
                        {listCategoriesF2.map((f2) => (
                            <li>
                                <Link className="text-dark nav-link fw-bold"></Link>
                            </li>
                            
                        ))}
                        

                        <div
                            className="pb-4 hidden  position-absolute start-50 translate-middle-x col-8"
                            style={{ zIndex: '999' }}>

                            
                        </div>

                        <div className="d-flex flex-wrap f2 pt-3 pb-3 border bg-white position-absolute start-50 top-100 translate-middle-x col-12 rounded-bottom shadow justify-content-around">
                            <Link className="text-dark  fw-bold"></Link>
                        </div>
                    </div>

                   {/* <div className="col-2 align-self-center">
                        <form>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="key"
                                    placeholder="Tìm kiếm"
                                />
                                <button className="btn border" type="submit">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="align-self-center d-flex">
                        <a
                            className="position-relative btn btn-outline-dark align-self-center"
                            href="/carts"
                        >
                            <i className="fa-solid fa-cart-shopping">
                                <span th:if="${number == 0}"></span>
                                <span
                                    th:unless="${number == 0}"
                                    th:text="${number}"
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                ></span>
                            </i>
                        </a>
                          <div className="ms-3 d-flex" th:if="${account != null}">
                    <div className="d-flex flex-column ">
                        <span>Xin chào, </span>
                        <a th:href="@{/info-account(accountId=${account.accountId})}"
                           th:text="${account.userName} + '!'"
                           className=" fst-italic text-decoration-underline btn-link"></a>
                    </div>
                    <form th:id="form-logout" th:action="@{/logout}" method="post"
                          className="align-self-center ms-1">
                        <i id="logout" className="fa-solid fa-arrow-right-from-bracket" style="padding: 5px;"></i>
                    </form>
                </div>

                <div className="btn-group ms-3" role="group">
                    <div className="btn btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown"
                         aria-expanded="false">
                        <i className="fa-solid fa-user"></i>
                    </div>
                    <div className="dropdown-menu p-3 start-0 top-100 translate-middle-x mt-2"
                         style={{width: '400px',zIndex:'9999'}}>
                        <div className="fw-bold">Đăng nhập</div>
                        <form className="mt-3">
                            <input type="text" name="username" id="name" className="form-control" style="font-size: 0.8rem"
                                   placeholder="Tên đăng nhập"/>
                            <input type="password" name="password" id="password" className="form-control mt-3"
                                   placeholder="Mật khẩu"/>
                            <div className="d-flex justify-content-between col-12">
                                <Link className=" fst-italic text-decoration-underline btn-link"
                                   >Quên mật khẩu?
                                </Link>

                                <Link href="/register" className="btn-link">Đăng ký tài khoản</Link>
                            </div>
                            <button className="btn btn-dark mt-3">Đăng nhập</button>
                        </form>
                    </div>
                </div>*/}
                    </div>
                </div>
            </nav>
        </>
    );
}
