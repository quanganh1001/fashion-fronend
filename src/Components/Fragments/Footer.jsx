import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function Footer(){
    return (
        <>
            <div className="bg-secondary-subtle shadow-lg border footer">
                <div className="container d-flex">
                    <div className="col-3 d-flex flex-column pt-5 pb-5 ps-3 pe-3 border-end border-dark-subtle">
                        <b className="fs-5">Thời trang nam TORANO</b>
                        <span className="text-dark-emphasis fs-6 mt-3 mb-3">
                            Hệ thống thời trang cho phái mạnh hàng đầu Việt Nam,
                            hướng tới phong cách nam tính, lịch lãm và trẻ
                            trung.
                        </span>
                        <div className="d-flex flex-wrap mt-3 mb-3">
                            <li>
                                <Link className="border border-dark-subtle pt-1 pb-1 pe-2 ps-2 me-4 rounded">
                                    <FontAwesomeIcon
                                        className="text-dark"
                                        icon="fa-brands fa-square-facebook"
                                    />{' '}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="border border-dark-subtle pt-1 pb-1 pe-2 ps-2 me-4 rounded"
                                    href="https://twitter.com/"
                                >
                                    <FontAwesomeIcon
                                        className="text-dark"
                                        icon="fa-brands fa-instagram"
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link className="border border-dark-subtle pt-1 pb-1 pe-2 ps-2 me-4 rounded">
                                    <FontAwesomeIcon
                                        className="text-dark"
                                        icon="fa-brands fa-youtube"
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="border border-dark-subtle pt-1 pb-1 pe-2 ps-2 me-4 rounded"
                                    href="https://www.tiktok.com/"
                                >
                                    <FontAwesomeIcon
                                        className="text-dark"
                                        icon="fa-brands fa-twitter"
                                    />
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="border border-dark-subtle pt-1 pb-1 pe-2 ps-2 me-2 rounded"
                                >
                                    <FontAwesomeIcon className="text-dark" icon="fa-brands fa-tiktok" />
                                </Link>
                            </li>
                        </div>
                        <div className="mt-2">
                            <b className="fw-semibold">
                                Phương thức thanh toán
                            </b>
                            <div className="d-flex flex-wrap mt-2">
                                <li className="me-2 mb-2">
                                    <img
                                        className=" ls-is-cached lazyloaded"
                                        data-src="//theme.hstatic.net/200000690725/1001078549/14/payment_1_img.png?v=276"
                                        src="//theme.hstatic.net/200000690725/1001078549/14/payment_1_img.png?v=276"
                                        alt="Vnpay"
                                        title="Vnpay"
                                    />
                                </li>
                            </div>
                        </div>
                    </div>
                    <div className="col-3 d-flex flex-column pt-5 pb-5 ps-3 pe-3 border-end border-dark-subtle">
                        <b className="fs-5 mb-3">Thông tin liên hệ</b>
                        <span className="fw-semibold fs-6 mb-2">
                            Địa chỉ:
                            <span className="fw-lighter fs-6">
                                {' '}
                                Tầng 8, tòa nhà Ford, số 313 Trường Chinh, quận
                                Thanh Xuân, Hà Nội
                            </span>
                        </span>
                        <span className="fw-semibold fs-6 mb-2">
                            Điện thoại:
                            <span className="fw-lighter fs-6"> 0364100196</span>
                        </span>
                        <span className="fw-semibold fs-6 mb-2">
                            Fax:
                            <span className="fw-lighter fs-6"> 0364100196</span>
                        </span>
                        <span className="fw-semibold fs-6 mb-2">
                            Email:
                            <span className="fw-lighter fs-6">
                                {' '}
                                cskh@torano.vn
                            </span>
                        </span>
                        <div className="fw-semibold mt-3 mb-3">
                            Phương thức vận chuyển
                        </div>
                        <div className="d-flex flex-wrap">
                            <li className="me-2">
                                <img
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/shipment_1_img.png?v=276"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/shipment_1_img.png?v=276"
                                    alt="GHN"
                                    title="GHN"
                                />
                            </li>
                            <li className="me-2">
                                <img
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/shipment_2_img.png?v=276"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/shipment_2_img.png?v=276"
                                    alt="Ninjavan"
                                    title="Ninjavan"
                                />
                            </li>
                            <li className="me-2">
                                <img
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/shipment_3_img.png?v=276"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/shipment_3_img.png?v=276"
                                    alt="Ahamove"
                                    title="Ahamove"
                                />
                            </li>
                            <li className="me-2">
                                <img
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/shipment_4_img.png?v=276"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/shipment_4_img.png?v=276"
                                    alt="J&amp;T"
                                    title="J&amp;T"
                                />
                            </li>
                        </div>
                    </div>
                    <div className="col-3 d-flex flex-column pt-5 pb-5 ps-3 pe-3 border-end border-dark-subtle">
                        <b className="fs-5">Nhóm liên kết</b>
                        <ul>
                            <li
                                className="mt-3 fw-lighter fs-6"
                                style={{ listStyleType: 'disc' }}
                            >
                                <Link className="text-dark text-decoration-none">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li
                                className="mt-3 fw-lighter fs-6"
                                style={{ listStyleType: 'disc' }}
                            >
                                <Link className="text-dark text-decoration-none">
                                    Chính sách đổi trả
                                </Link>
                            </li>
                            <li
                                className="mt-3 fw-lighter fs-6 "
                                style={{ listStyleType: 'disc' }}
                            >
                                <Link className="text-dark text-decoration-none">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                            <li
                                className="mt-3 fw-lighter fs-6"
                                style={{ listStyleType: 'disc' }}
                            >
                                <Link className="text-dark text-decoration-none">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-3 d-flex flex-column pt-5 pb-5 ps-3 pe-3">
                        <b className="fs-5">Đăng ký nhận tin</b>
                        <span className="mt-3 fw-lighter fs-6">
                            Để cập nhật những sản phẩm mới, nhận thông tin ưu
                            đãi đặc biệt và thông tin giảm giá khác.
                        </span>
                        <div className="input-group mt-3">
                            <span
                                className="input-group-text"
                                id="basic-addon1"
                            >
                                @
                            </span>
                            <div className="form-floating">
                                <input
                                    id="email-input"
                                    type="email"
                                    className="form-control"
                                    placeholder="Nhập email"
                                    style={{ fontSize: '0.8rem' }}
                                />
                                <label>
                                    Nhập email của bạn
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-dark"
                                id="btn-send-mail"
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
                <p className="fs-6 fw-light border-top border-dark-subtle p-2 d-flex justify-content-center">
                    Copyright © 2024{' '}
                    <Link className="ms-1 text-dark" href="https://torano.vn">
                        {' '}
                        Torano
                    </Link>
                    .
                    <Link className="text-dark">
                        Powered by Quang Anh Nguyen
                    </Link>
                </p>
            </div>
        </>
    );
}