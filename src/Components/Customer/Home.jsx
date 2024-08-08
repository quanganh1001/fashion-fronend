import { React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
} from 'reactstrap';
import { getAllCategories } from '../../Services/CategoryService';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllProductByCategory, getSelectedListProducts } from '../../Services/ProductService';
import { Helmet } from 'react-helmet-async';

export default function Home() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [listCategoriesF2, setListCategoriesF2] = useState([]);
    const [listProductsSale, setListProductSale] = useState([]);
    const [listProducts, setListProducts] = useState([]);
    const [isSelected, setIsSelected] = useState('best'); 

    useEffect(() => {
        fetchCategories();
        fetchProductSale();
    }, []);

    useEffect(() => {
        fetchGetSelectedListProducts();
    },[isSelected])

    const fetchGetSelectedListProducts = () => {
        getSelectedListProducts(isSelected)
            .then((res) => {
                setListProducts(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchProductSale =  () => {
         getAllProductByCategory(0).then((res) => {
            setListProductSale(res.data);
         }).catch((error) => {
            console.error(error);
        });
    };

    const fetchCategories =  () => {
         getAllCategories()
            .then((res) => {
                const categories = res.data;

                // set categoriesF1
                const categoriesF1 = categories.filter(
                    (category) => category.catParent === null
                );

                // set categoriesF2
                const categoriesF2 = categories.filter((category) =>
                    categoriesF1.some(
                        (f1Category) => f1Category.id === category.catParent
                    )
                );
                setListCategoriesF2(categoriesF2);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const listBanner = [
        'https://res.cloudinary.com/dmmvhjl0m/image/upload/v1711885305/ysmew6aqlneqdojqdgdq.webp',
        'https://res.cloudinary.com/dmmvhjl0m/image/upload/v1711885303/bfbpbb0zfrhe5k1wn8hx.webp',
        'https://res.cloudinary.com/dmmvhjl0m/image/upload/v1711885307/tzbdiicr7ds9ncao7jxj.webp',
        'https://res.cloudinary.com/dmmvhjl0m/image/upload/v1711885309/k6eyr9bcnhwppvvmshq2.webp',
    ];


    const next = () => {
        if (animating) return;
        const nextIndex =
            activeIndex === listBanner.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        if (animating) return;
        const nextIndex =
            activeIndex === 0 ? listBanner.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };

    const slides = listBanner.map((item, index) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={index}
            >
                <img
                    src={item}
                    alt={`Slide ${index + 1}`}
                    className="d-block w-100"
                />
                <CarouselCaption captionText="" captionHeader="" />
            </CarouselItem>
        );
    });

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 5000,
        centerMode: true,
        focusOnSelect: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <>
            <style>
                {`
                .add-to-cart-btn {
                position: absolute;
                transform: translate(-50%, -50%);
                top: 100%;
                left: 50%;
                transition: all 0.3s;
                opacity: 0;
                }

                .card:hover .add-to-cart-btn {
                opacity: 1;
                transition: all 0.3s;
                top: 80%;
                }
                .btn-sale{
                    transition: all 0.5s;
                }
                .btn-sale:hover{
                    background-color: black!important;
                    color: white;
                }
                
                .nav-item .nav-link {
                    position: relative;
                    text-decoration: none;
                    transition: color 0.3s, font-weight 0.3s;
                }   

                .nav-item .nav-link:hover {
                    color: black;
                    font-weight: bold;
                }

                .nav-item .underline {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: -1px;
                    width: 0;
                    height: 2px;
                    background-color: black;
                    transition: width 0.3s;
                }

                .nav-item:hover .underline {
                    width: 100%;
                }
                `}
            </style>

            <Carousel activeIndex={activeIndex} next={next} previous={previous}>
                <CarouselIndicators
                    items={listBanner}
                    activeIndex={activeIndex}
                    onClickHandler={goToIndex}
                />
                {slides}
                <CarouselControl
                    direction="prev"
                    directionText="Previous"
                    onClickHandler={previous}
                />
                <CarouselControl
                    direction="next"
                    directionText="Next"
                    onClickHandler={next}
                />
            </Carousel>

            <section style={{ marginTop: '100px' }}>
                <Helmet>
                    <title>Trang chủ</title>
                </Helmet>
                <div className="container-xl">
                    <h2 className="fw-bold mb-5">DANH MỤC SẢN PHẨM</h2>

                    <Slider {...settings}>
                        {listCategoriesF2.map((cat) => (
                            <div
                                className="shadow-sm position-relative"
                                key={cat.categoryCode}
                            >
                                <div className="me-2">
                                    <img
                                        src={cat.catBackground}
                                        style={{
                                            height: '350px',
                                            width: '100%',
                                        }}
                                        alt=""
                                    />

                                    <div className="position-absolute bg-white bg-opacity-50 p-3 d-flex justify-content-between align-items-center w-100 bottom-0">
                                        <h4>{cat.catName}</h4>
                                        <Link to={`/category/${cat.id}`}>
                                            <FontAwesomeIcon
                                                icon="fa-solid fa-arrow-right-to-bracket fa-1x"
                                                className="text-dark bg-white rounded-circle p-2 "
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>

            <section
                className="mt-5 pt-5"
                style={{ backgroundColor: '#faefec' }}
            >
                <div className=" container-xl">
                    <div className="mb-5  d-flex">
                        <img
                            src={process.env.PUBLIC_URL + '/fire-icon-new.png'}
                            alt=""
                            width="40px"
                        />

                        <h2 className=" ms-3 fw-bold text-danger">
                            TẾT NHẤT SALE TẤT
                        </h2>
                    </div>

                    <Slider {...settings}>
                        {listProductsSale.map((product) => (
                            <div className="pe-3" key={product.id}>
                                <div className="card position-relative">
                                    <div
                                        style={{
                                            zIndex: '2',
                                            backgroundColor: 'red',
                                            width: '50px',
                                        }}
                                        className="position-absolute top-0 start-0 text-white rounded-pill m-2 fw-bold d-flex justify-content-center"
                                    >
                                        -{product.discountPercent}%
                                    </div>

                                    {product.imageBackground &&
                                    product.imageBackground.endsWith('.mp4') ? (
                                        <video
                                            style={{
                                                height: '350px',
                                                width: '100%',
                                            }}
                                            controls
                                            autoplay
                                            muted
                                            src={product.imageBackground}
                                        ></video>
                                    ) : (
                                        <img
                                            src={product.imageBackground}
                                            alt="..."
                                            style={{
                                                height: '350px',
                                                width: '100%',
                                            }}
                                        />
                                    )}

                                    <Link
                                        to={'/product/' + product.id}
                                        style={{ width: '80%' }}
                                        className="add-to-cart-btn position-absolute button border-white shadow fw-bold"
                                    >
                                        Chi tiết sản phẩm
                                    </Link>
                                </div>

                                <div
                                    className="card-body px-2 pb-3 bg-white"
                                    style={{ minHeight: '20vh' }}
                                >
                                    <div className="d-flex justify-content-between p-2">
                                        <span
                                            className="fw-light"
                                            style={{ fontSize: '14px' }}
                                        >
                                            +{product.totalColor} Màu sắc
                                        </span>
                                        <span
                                            className="fw-light"
                                            style={{ fontSize: '14px' }}
                                        >
                                            +{product.totalSize} Kích thước
                                        </span>
                                    </div>
                                    <h5 className="card-title fs-6">
                                        {product.productName}
                                    </h5>

                                    {product.discountPrice !== null ? (
                                        <div>
                                            <span
                                                className="me-2"
                                                style={{
                                                    textDecorationLine:
                                                        'line-through',
                                                }}
                                            >
                                                {product.price.toLocaleString(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }
                                                )}
                                            </span>
                                            <span
                                                style={{
                                                    color: 'red',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {product.discountPrice.toLocaleString(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }
                                                )}
                                            </span>
                                        </div>
                                    ) : (
                                        <div>
                                            <span
                                                style={{
                                                    color: 'red',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {product.price.toLocaleString(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </Slider>

                    <div className=" d-flex justify-content-center">
                        <Link
                            to="/category/sale"
                            className="btn-sale btn mt-5 mb-5 pt-2 pb-2 bg-white border border-black rounded d-flex justify-content-center"
                        >
                            <span>Xem tất cả</span>
                            <span
                                className="fw-bold"
                                style={{ marginLeft: '3px' }}
                            >
                                TẾT NHẤT SALE TẤT
                            </span>{' '}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="pt-5 container-xl">
                <div className=" text-center">
                    <nav className="nav justify-content-center">
                        <div className="nav-item position-relative mx-2">
                            <p
                                onClick={() => setIsSelected('best')}
                                className="nav-link text-muted fs-4 "
                                style={
                                    isSelected === 'best'
                                        ? {
                                              color: 'black',
                                              fontWeight: 'bold',
                                              cursor: 'pointer',
                                          }
                                        : { cursor: 'pointer' }
                                }
                            >
                                SẢN PHẨM BÁN CHẠY
                            </p>
                            <div
                                className="underline"
                                style={
                                    isSelected === 'best'
                                        ? {
                                              width: '100%',
                                          }
                                        : {}
                                }
                            ></div>
                        </div>
                        <div className="nav-item position-relative mx-2">
                            <p
                                onClick={() => setIsSelected('polo')}
                                className="nav-link text-muted fs-4 "
                                style={
                                    isSelected === 'polo'
                                        ? {
                                              color: 'black',
                                              fontWeight: 'bold',
                                              cursor: 'pointer',
                                          }
                                        : { cursor: 'pointer' }
                                }
                            >
                                ÁO POLO
                            </p>
                            <div
                                className="underline"
                                style={
                                    isSelected === 'polo'
                                        ? {
                                              width: '100%',
                                          }
                                        : {}
                                }
                            ></div>
                        </div>
                        <div className="nav-item position-relative mx-2">
                            <p
                                onClick={() => setIsSelected('pants')}
                                className="nav-link text-muted fs-4 "
                                style={
                                    isSelected === 'pants'
                                        ? {
                                              color: 'black',
                                              fontWeight: 'bold',
                                              cursor: 'pointer',
                                          }
                                        : { cursor: 'pointer' }
                                }
                            >
                                QUẦN ÂU
                            </p>
                            <div
                                className="underline"
                                style={
                                    isSelected === 'pants'
                                        ? {
                                              width: '100%',
                                          }
                                        : {}
                                }
                            ></div>
                        </div>
                        <div className="nav-item position-relative mx-2">
                            <p
                                onClick={() => setIsSelected('shirt')}
                                className="nav-link text-muted fs-4 "
                                style={
                                    isSelected === 'shirt'
                                        ? {
                                              color: 'black',
                                              fontWeight: 'bold',
                                              cursor: 'pointer',
                                          }
                                        : { cursor: 'pointer' }
                                }
                            >
                                ÁO SƠ MI
                            </p>
                            <div
                                className="underline"
                                style={
                                    isSelected === 'shirt'
                                        ? {
                                              width: '100%',
                                          }
                                        : {}
                                }
                            ></div>
                        </div>
                    </nav>
                </div>
                <div className="pt-5 d-flex flex-wrap justify-content-center">
                    {listProducts.map((product) => (
                        <div className="col-2 m-2" key={product.id}>
                            <div className=" card position-relative">
                                {product.discountPercent != null && (
                                    <div
                                        style={{
                                            zIndex: '2',
                                            backgroundColor: 'red',
                                            width: '50px',
                                        }}
                                        className="position-absolute top-0 start-0 text-white rounded-pill m-2 fw-bold d-flex justify-content-center"
                                    >
                                        -{product.discountPercent}%
                                    </div>
                                )}

                                {product.imageBackground &&
                                product.imageBackground.endsWith('.mp4') ? (
                                    <video
                                        style={{
                                            height: '270px',
                                            width: '100%',
                                        }}
                                        controls
                                        autoplay
                                        muted
                                        src={product.imageBackground}
                                    ></video>
                                ) : (
                                    <img
                                        src={product.imageBackground}
                                        alt="..."
                                        style={{
                                            height: '270px',
                                            width: '100%',
                                        }}
                                    />
                                )}

                                <Link
                                    to={'/product/' + product.id}
                                    style={{ width: '80%' }}
                                    className="add-to-cart-btn position-absolute button border-white shadow fw-bold"
                                >
                                    Chi tiết sản phẩm
                                </Link>
                            </div>

                            <div className="card-body px-2 pb-3 bg-white">
                                <div className="d-flex justify-content-between">
                                    <span
                                        className="fw-light"
                                        style={{ fontSize: '14px' }}
                                    >
                                        +{product.totalColor} Màu sắc
                                    </span>
                                    <span
                                        className="fw-light"
                                        style={{ fontSize: '14px' }}
                                    >
                                        +{product.totalSize} Kích thước
                                    </span>
                                </div>
                                <h5 className="card-title fs-6 my-2">
                                    {product.productName}
                                </h5>

                                {product.discountPrice !== null ? (
                                    <div>
                                        <span
                                            style={{
                                                textDecorationLine:
                                                    'line-through',
                                            }}
                                        >
                                            {product.price.toLocaleString(
                                                'vi-VN',
                                                {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }
                                            )}
                                        </span>
                                        <span
                                            className="ms-2"
                                            style={{
                                                color: 'red',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {product.discountPrice.toLocaleString(
                                                'vi-VN',
                                                {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }
                                            )}
                                        </span>
                                    </div>
                                ) : (
                                    <div>
                                        <span
                                            style={{
                                                color: 'red',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {product.price.toLocaleString(
                                                'vi-VN',
                                                {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <hr />

            <section className="py-5">
                <div className="container-xxl">
                    <div className=" row">
                        <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                            <div className="d-flex">
                                <div className="me-3 align-self-center">
                                    <img
                                        className=" lazyloaded"
                                        data-src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_1.png?v=281"
                                        src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_1.png?v=281"
                                        alt="Miễn phí vận chuyển"
                                    />
                                </div>
                                <div className="align-self-center">
                                    <b>Miễn phí vận chuyển</b>
                                    <div>Áp dụng cho mọi đơn hàng từ 500k</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                            <div className="d-flex">
                                <div className="me-3 align-self-center">
                                    <img
                                        className=" ls-is-cached lazyloaded"
                                        data-src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_2.png?v=281"
                                        src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_2.png?v=281"
                                        alt="Đổi trả dễ dàng"
                                    />
                                </div>
                                <div className="align-self-center">
                                    <b>Đổi trả dễ dàng</b>
                                    <div>7 ngày đổi trả vì bất kì lí do gì</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                            <div className="d-flex">
                                <div className="me-3 align-self-center">
                                    <img
                                        className=" lazyloaded"
                                        data-src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_3.png?v=281"
                                        src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_3.png?v=281"
                                        alt="Hỗ trợ nhanh chóng"
                                    />
                                </div>
                                <div className="align-self-center">
                                    <b>Hỗ trợ nhanh chóng</b>
                                    <div>HOTLINE 24/7 : 0364100196</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-lg-6 col-md-6 col-12">
                            <div className="d-flex">
                                <div className="me-3 align-self-center">
                                    <img
                                        className=" ls-is-cached lazyloaded"
                                        data-src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_4.png?v=281"
                                        src="//theme.hstatic.net/200000690725/1001078549/14/home_policy_icon_4.png?v=281"
                                        alt="Thanh toán đa dạng"
                                    />
                                </div>
                                <div className="align-self-center">
                                    <b>Thanh toán đa dạng</b>
                                    <div>
                                        Thanh toán khi nhận hàng, Napas, Visa,
                                        Chuyển Khoản
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function SampleNextArrow(props) {
    const {  style, onClick } = props;
    return (
        <FontAwesomeIcon
            className="position-absolute btn btn-outline-dark py-2 px-3 rounded-5"
            style={{
                ...style,
                display: 'block',
                top: '-55px',
                right: '50px',
                cursor: 'pointer',
            }}
            onClick={onClick}
            icon="fa-solid fa-angle-right"
        />
    );
}

function SamplePrevArrow(props) {
    const {  style, onClick } = props;
    return (
        <FontAwesomeIcon
            className="position-absolute btn btn-outline-dark py-2 px-3 rounded-5"
            style={{
                ...style,
                display: 'block',
                top: '-55px',
                right: '100px',
                cursor: 'pointer',
            }}
            onClick={onClick}
            icon="fa-solid fa-angle-left"
        />
    );
}
