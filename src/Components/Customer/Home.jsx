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
import { getAllProductByCategory } from '../../Services/ProductService';

export default function Home() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [listCategoriesF2, setListCategoriesF2] = useState([]);
    const [listProductsSale, setListProductSale] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchProductSale();
    }, []);

    const fetchProductSale =  () => {
         getAllProductByCategory(0).then((res) => {
            setListProductSale(res.data);
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
                                    <h5 className="card-title fs-5 my-2">
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
