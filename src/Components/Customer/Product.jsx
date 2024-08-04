import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllImageProducts, getProduct } from '../../Services/ProductService';
import { Tab, Tabs } from 'react-bootstrap';
import ReturnPolicy from './ReturnPolicy';
import PrivatePolicy from './PrivatePolicy';
import useModal from '../../CustomHooks/useModal';
import { toast } from 'react-toastify';
import useCart from '../../CustomHooks/useCart';
import useAuth from '../../CustomHooks/useAuth';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { getUrlImgEnum } from '../../Services/EnumService';
import LoadingSpinner from '../Fragments/LoadingSpinner';
import { Helmet } from 'react-helmet-async';

export default function Product() {
    const [listImage, setListImage] = useState([]);
    const images = listImage.map((image) => ({
        original: image.fileImg,
        thumbnail: image.fileImg,
    }));
    const { id } = useParams();
    const [product, setProduct] = useState('');
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const [listSize, setListSize] = useState([]);
    const [listColor, setListColor] = useState([]);
    const [selectProductDetail, setSelectProductDetail] = useState('');
    const [listProductsDetail, setListProductsDetail] = useState([]);
    const { openModal } = useModal();
    const [inputQuantity, setInputQuantity] = useState(1);
    const { handleAddCartWithAuth, handleAddCart } = useCart();
    const { auth } = useAuth();
    const [index, setIndex] = useState(0);
    const [isLoadingProduct, setIsLoadingProduct] = useState(true);

    useEffect(() => {
        fetchListImage();
        fetchProduct();
    }, []);

    useEffect(() => {
        if (color) {
            setSelectProductDetail('');
        }
    }, [color, listProductsDetail]);

    useEffect(() => {
        if (size) {
            const productDetail = product.productsDetails.find(
                (pd) => pd.color === color && pd.size === size
            );
            setSelectProductDetail(productDetail);
        }
    }, [size]);

    const fetchListImage = () => {
        getAllImageProducts(id)
            .then((res) => {
                setListImage(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const fetchProduct = () => {
        getProduct(id)
            .then((res) => {
                const uniqueSizes = [
                    ...new Set(
                        res.data.productsDetails.map((product) => product.size)
                    ),
                ];
                setListSize(uniqueSizes);

                const uniqueColors = [
                    ...new Set(
                        res.data.productsDetails.map((product) => product.color)
                    ),
                ];
                setListColor(uniqueColors);

                setProduct(res.data);
                setListProductsDetail(res.data.productsDetails);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoadingProduct(false);
            });
    };

    const handleChangeColor = (cl) => {
        setColor(cl);
        setSize('');
    };

    const handleChangeSize = (sz) => {
        setSize(sz);
    };

    const checkProductAvailability = (sz) => {
        const productDetail = product.productsDetails.find(
            (pd) => pd.color === color && pd.size === sz
        );

        return productDetail ? productDetail.quantity > 0 : false;
    };

    const handleShowImageChooseSize = (imgUrl) => {
        getUrlImgEnum(imgUrl)
            .then((res) => {
                openModal(
                    'Hướng dẫn chọn size',
                    <img src={res.data} alt="Chọn size" width="100%" />,
                    true,
                    () => {}
                );
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleAddToCart = () => {
        if (auth.token) {
             handleAddCartWithAuth(selectProductDetail.id, inputQuantity);
        } else {
            handleAddCart(selectProductDetail, inputQuantity);
        }
    };

    return (
        <>
            {' '}
            <style>{`.image-gallery .image-gallery-icon {
                    color: white;
                    opacity: 0.3; 
                    padding: 5px 10px;
                    border-radius: 100%; 
                    cursor: pointer;
                    transition: opacity 0.3s;
                    }

                     .image-gallery .image-gallery-icon:hover {
                    opacity: 1; 
                    
                    }

                    .image-gallery .image-gallery-left-nav,
                    .image-gallery .image-gallery-right-nav {
                    top: 50%; 
                    transform: translateY(-50%);
                    z-index: 1; 
                    }
            `}</style>
            <div className="container-xl my-5 ">
                <div className="d-flex flex-wrap mb-5">
                    <div className="col-4 ">
                        <ImageGallery
                            items={images}
                            showThumbnails={true}
                            showFullscreenButton={false}
                            showPlayButton={false}
                            slideInterval={2000}
                            showNav={true}
                            lazyLoad={true}
                            renderItem={({ original, description }) => (
                                <div>
                                    {original.endsWith('.mp4') ? (
                                        <video
                                            style={{
                                                height: '500px',
                                                width: '100%',
                                            }}
                                            controls
                                        >
                                            <source
                                                src={original}
                                                type="video/mp4"
                                            />
                                        </video>
                                    ) : (
                                        <img
                                            src={original}
                                            alt={description}
                                            style={{
                                                height: '500px',
                                                width: '100%',
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                            renderThumbInner={(item, idx) => (
                                <div
                                    className={`image-gallery-thumbnail-inner ${
                                        index === idx ? 'selected' : ''
                                    }`}
                                >
                                    {item.thumbnail.endsWith('.mp4') ? (
                                        <video
                                            style={{
                                                height: '80px',
                                                width: '100%',
                                                cursor: 'pointer',
                                            }}
                                            controls
                                        >
                                            <source
                                                src={item.thumbnail}
                                                type="video/mp4"
                                            />
                                        </video>
                                    ) : (
                                        <img
                                            src={item.thumbnail}
                                            alt={item.description}
                                            style={{
                                                height: '80px',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => setIndex(idx)}
                                        />
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    <div className=" col-8 ps-5">
                        {isLoadingProduct ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                <h4 className="mb-4">{product.productName}</h4>

                                <div className="d-flex justify-content-between mb-3">
                                    {selectProductDetail ? (
                                        <div>{selectProductDetail.code}</div>
                                    ) : (
                                        <div>Hãy chọn màu và size</div>
                                    )}
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        className="link-dark fst-italic btn-link"
                                        onClick={() =>
                                            handleShowImageChooseSize(
                                                product.imageChooseSize
                                            )
                                        }
                                    >
                                        Bảng hướng dẫn chọn size
                                    </div>
                                </div>
                                <div
                                    style={{ backgroundColor: '#d9d7d7' }}
                                    className="p-3 "
                                >
                                    <div className="d-flex">
                                        Giá:{' '}
                                        {product.discountPrice === null ? (
                                            <span className="ms-3 fw-semibold text-danger">
                                                {product &&
                                                    product.price.toLocaleString(
                                                        'vi-VN',
                                                        {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        }
                                                    )}
                                            </span>
                                        ) : (
                                            <>
                                                <span className=" mx-3 text-decoration-line-through">
                                                    {product &&
                                                        product.price.toLocaleString(
                                                            'vi-VN',
                                                            {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            }
                                                        )}
                                                </span>
                                                <span className=" fw-semibold text-danger">
                                                    {product &&
                                                        product.discountPrice.toLocaleString(
                                                            'vi-VN',
                                                            {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            }
                                                        )}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="p-3">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className="col-2">
                                                    Màu sắc:
                                                </td>
                                                <td className="d-flex flex-wrap justify-content-start">
                                                    {listColor.map((cl) => (
                                                        <label
                                                            key={cl}
                                                            className={` m-2  border p-2 ${
                                                                color === cl
                                                                    ? 'button'
                                                                    : 'button-non-active'
                                                            }`}
                                                        >
                                                            {cl}
                                                            <input
                                                                type="radio"
                                                                name="color"
                                                                value={cl}
                                                                hidden
                                                                onChange={() =>
                                                                    handleChangeColor(
                                                                        cl
                                                                    )
                                                                }
                                                            />
                                                        </label>
                                                    ))}
                                                </td>
                                            </tr>

                                            <tr className="border-top">
                                                <td className="col-2">Size:</td>
                                                <td className="  d-flex justify-content-start">
                                                    {listSize.map((sz) => (
                                                        <label
                                                            key={sz}
                                                            className={` m-2 border p-2 ${
                                                                !checkProductAvailability(
                                                                    sz
                                                                )
                                                                    ? 'bg-body-secondary'
                                                                    : ''
                                                            } ${
                                                                size === sz
                                                                    ? 'button'
                                                                    : 'button-non-active'
                                                            }`}
                                                        >
                                                            {sz}
                                                            <input
                                                                type="radio"
                                                                name="size"
                                                                value={sz}
                                                                hidden
                                                                onChange={() =>
                                                                    handleChangeSize(
                                                                        sz
                                                                    )
                                                                }
                                                                disabled={
                                                                    !checkProductAvailability(
                                                                        sz
                                                                    )
                                                                }
                                                            />
                                                        </label>
                                                    ))}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <label className=" d-flex mt-5 align-items-center">
                                        <span className="col-2">
                                            Số lượng:{' '}
                                        </span>
                                        <div className="col-2">
                                            <input
                                                className="p-2 form-control"
                                                type="number"
                                                defaultValue="1"
                                                min="1"
                                                max="99"
                                                onChange={(e) =>
                                                    setInputQuantity(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </label>

                                    <div className="mt-5">
                                        <button
                                            type="button"
                                            disabled={!selectProductDetail}
                                            className="button p-3"
                                            onClick={() => handleAddToCart()}
                                        >
                                            Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-5">
                    <div className="fw-bold mb-1">Chính sách bán hàng</div>
                    <div className="row">
                        <div className="col-4 d-flex align-items-center">
                            <div>
                                <img
                                    width="100%"
                                    className=" ls-is-cached lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc1_img.png?v=282"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc1_img.png?v=282"
                                    alt="Miễn phí giao hàng cho đơn hàng từ 500K"
                                />
                            </div>
                            <div className="ms-2">
                                Miễn phí giao hàng cho đơn hàng từ 500K
                            </div>
                        </div>

                        <div className="col-4 d-flex align-items-center">
                            <div>
                                <img
                                    width="100%"
                                    className=" ls-is-cached lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc2_img.png?v=282"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc2_img.png?v=282"
                                    alt="Hàng phân phối chính hãng 100%"
                                />
                            </div>
                            <div className="ms-2">
                                Hàng phân phối chính hãng 100%
                            </div>
                        </div>

                        <div className="col-4 d-flex align-items-center">
                            <div>
                                <img
                                    width="100%"
                                    className=" ls-is-cached lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc3_img.png?v=282"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info1_desc3_img.png?v=282"
                                    alt="TỔNG ĐÀI 24/7 :  0964942121"
                                />
                            </div>
                            <div className="ms-2">
                                TỔNG ĐÀI 24/7 : 0964942121
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-3">
                    <div className="fw-bold mb-1">Thông tin thêm</div>
                    <div className="row">
                        <div className="col-4 d-flex align-items-center">
                            <div>
                                <img
                                    width="100%"
                                    className=" ls-is-cached lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc1_img.png?v=282"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc1_img.png?v=282"
                                    alt="ĐỔI SẢN PHẨM DỄ DÀNG (Trong vòng 7 ngày khi còn nguyên tem mác)"
                                />
                            </div>
                            <div className="ms-2">
                                ĐỔI SẢN PHẨM DỄ DÀNG (Trong vòng 7 ngày khi còn
                                nguyên tem mác)
                            </div>
                        </div>

                        <div className="col-4 d-flex align-items-center">
                            <div>
                                <img
                                    width="100%"
                                    className=" ls-is-cached lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc2_img.png?v=282"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc2_img.png?v=282"
                                    alt="Kiểm tra, thanh toán khi nhận hàng COD"
                                />
                            </div>
                            <div className="ms-2">
                                Kiểm tra, thanh toán khi nhận hàng COD
                            </div>
                        </div>

                        <div className="col-4 d-flex align-items-center">
                            <div>
                                <img
                                    width="100%"
                                    className=" ls-is-cached lazyloaded"
                                    data-src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc3_img.png?v=282"
                                    src="//theme.hstatic.net/200000690725/1001078549/14/product_info2_desc3_img.png?v=282"
                                    alt="Hỗ trợ bảo hành,đổi sản phẩm tại tất cả store TORANO"
                                />
                            </div>
                            <div className="ms-2">
                                Hỗ trợ bảo hành, đổi sản phẩm tại tất cả store
                                TORANO
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="m-5">
                <Tabs defaultActiveKey="description" id="myTab">
                    <Tab
                        eventKey="description"
                        title="Thông tin chi tiết"
                        className="h3 me-5 text-dark"
                    >
                        <div className="tab-content mt-5">
                            {product.description ? (
                                <pre
                                    className="text-dark"
                                    style={{
                                        fontSize: '16px',
                                        fontFamily: 'Quicksand, sans-serif',
                                    }}
                                >
                                    {product.description}
                                </pre>
                            ) : (
                                <pre className="mt-5">
                                    {product.productName}
                                </pre>
                            )}
                        </div>
                    </Tab>
                    <Tab
                        eventKey="return-policy"
                        title="Chính sách đổi trả"
                        className="h3 me-5 text-dark"
                    >
                        <div className="tab-content">
                            <ReturnPolicy />
                        </div>
                    </Tab>
                    <Tab
                        eventKey="private-policy"
                        title="Chính sách bảo mật"
                        className="h3 text-dark"
                    >
                        <div className="tab-content my-5">
                            <PrivatePolicy />
                        </div>
                    </Tab>
                </Tabs>
            </div>
            <Helmet>
                <title>{product.productName}</title>
            </Helmet>
        </>
    );
}
