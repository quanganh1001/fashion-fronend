import { useEffect, useState } from 'react';
import {
    getAllProductByCategory,
} from '../../Services/ProductService';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import CustomPagination from '../Fragments/CustomPagination';
import usePagination from '../../CustomHooks/usePagination';


export default function Category() {
    let { catId } = useParams();
    const [listProducts, setListProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState();
    const [currentPage, setCurrentPage] = useState();
    const {searchParams } = usePagination();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const key = params.get('key') || '';
    const page = params.get('page') || 1;
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000000 });
    const [sortOption, setSortOption] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        fetchGetProductByCategory();
    }, [catId, key]);


    useEffect(() => {
        filterProducts();
        window.scrollTo(0, 0);
    }, [listProducts, sortOption, searchParams]);

    useEffect(() => {
        params.set('page', 1);
        navigate({ search: params.toString() });
        filterProducts();
        window.scrollTo(0, 0);
    }, [ priceRange]);


    const filterProducts = () => {
        let filtered = [...listProducts];

        if (priceRange.min || priceRange.max) {
            filtered = filtered.filter((product) => {
                const price =
                    product.discountPrice !== null
                        ? product.discountPrice
                        : product.price;

                return (
                    (!priceRange.min || price >= priceRange.min) &&
                    (!priceRange.max || price <= priceRange.max)
                );
            });
        }

        if (sortOption) {
            if (sortOption === 'name-up') {
                filtered.sort((a, b) =>
                    a.productName.localeCompare(b.productName)
                );
            } else if (sortOption === 'name-down') {
                filtered.sort((a, b) =>
                    b.productName.localeCompare(a.productName)
                );
            } else if (sortOption === 'price-up') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sortOption === 'price-down') {
                filtered.sort((a, b) => b.price - a.price);
            }
        }

        const limit = parseInt(searchParams.get('limit') || '10', 10); 

         if (limit <= 0) {
             console.error('Invalid limit value:', limit);
             return;
        }
        
        const startIndex = (page - 1) * parseInt(limit);

        const endIndex = startIndex + parseInt(limit);

        const productsOnCurrentPage = filtered.slice(startIndex, endIndex);

        setFilteredProducts(productsOnCurrentPage);

        const newTotalPages = Math.ceil(filtered.length / limit);

        setTotalPages(newTotalPages);

        setTotalItems(filtered.length);

        setCurrentPage(page);
    };

    const fetchGetProductByCategory = async () => {
        if (catId === 'sale') {
            catId = 0;
        }
        await getAllProductByCategory(catId, key)
            .then((res) => {
                setListProducts(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
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
                `}
            </style>

            <div className="d-flex flex-wrap container-xl py-5">
                <div className="col-3 bg-light p-3 align-self-start">
                    <h4 className="fw-bold">Bộ lọc</h4>

                    <div className="mt-5">
                        Sắp xếp theo:
                        <select
                            className="form-control"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">--Chọn--</option>
                            <option value="name-up">
                                Sắp xếp theo tên a-z
                            </option>
                            <option value="name-down">
                                Sắp xếp theo tên z-a
                            </option>
                            <option value="price-up">
                                Sắp xếp theo giá tăng dần
                            </option>
                            <option value="price-down">
                                Sắp xếp theo giá giảm dần
                            </option>
                        </select>
                    </div>

                    <div className="mt-5 mb-3">
                        Chọn khoảng giá:
                        <div className="input-group">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Từ"
                                value={priceRange.min}
                                onChange={(e) =>
                                    setPriceRange({
                                        ...priceRange,
                                        min: e.target.value,
                                    })
                                }
                            />
                            <span className="input-group-text">-</span>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Đến"
                                value={priceRange.max}
                                onChange={(e) =>
                                    setPriceRange({
                                        ...priceRange,
                                        max: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="col ">
                    {listProducts.length > 0 ? (
                        <>
                            <div className="d-flex flex-wrap justify-content-around">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="shadow card hover m-2"
                                        style={{ width: '30%' }}
                                    >
                                        <div className="card  position-relative ">
                                            {product.discountPrice && (
                                                <div
                                                    style={{
                                                        zIndex: '0',
                                                        backgroundColor: 'red',
                                                        width: '50px',
                                                    }}
                                                    className="position-absolute top-0 start-0 text-white rounded-pill m-2 fw-semibold d-flex justify-content-center"
                                                >
                                                    -{product.discountPercent}%
                                                </div>
                                            )}
                                            {product.imageBackground &&
                                            product.imageBackground.endsWith(
                                                '.mp4'
                                            ) ? (
                                                <video
                                                    style={{
                                                        height: '350px',
                                                        width: '100%',
                                                    }}
                                                    controls
                                                    autoplay
                                                    muted
                                                    src={
                                                        product.imageBackground
                                                    }
                                                ></video>
                                            ) : (
                                                <img
                                                    src={
                                                        product.imageBackground
                                                    }
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
                                                className="button border-white shadow fw-bold  add-to-cart-btn"
                                            >
                                                Chi tiết sản phẩm
                                            </Link>
                                        </div>

                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <span
                                                    className="fw-light"
                                                    style={{
                                                        fontSize: '14px',
                                                    }}
                                                >
                                                    +{product.totalColor} Màu
                                                    sắc
                                                </span>
                                                <span
                                                    className="fw-light"
                                                    style={{
                                                        fontSize: '14px',
                                                    }}
                                                >
                                                    +{product.totalSize} Kích
                                                    thước
                                                </span>
                                            </div>
                                            <h6 className=" mt-2">
                                                {product.productName}
                                            </h6>
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
                            <CustomPagination
                                totalPages={totalPages}
                                currentPage={parseInt(currentPage)}
                                totalItems={totalItems}
                            />
                        </>
                    ) : (
                        <div className="d-flex flex-wrap justify-content-around">
                            Chưa có sản phẩm trong danh mục này
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
