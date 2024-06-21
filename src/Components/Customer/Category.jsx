import { useEffect, useState } from 'react';
import { getAllProductByCategory } from '../../Services/ProductService';
import { Link, useParams } from 'react-router-dom';
import { error } from 'jquery';

export default function Category() {
    let { catId } = useParams();
    const [listProducts, setListProducts] = useState([]);

    useEffect(() => {
        fetchGetProductByCategory();
    }, []);

    const fetchGetProductByCategory = async () => {
        if (catId === 'sale') {
            catId = 0;
        }
        await getAllProductByCategory(catId)
            .then((res) => {
                console.log(res.data);
                setListProducts(res.data.productsRes);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    return (
        <>
            <div className="d-flex flex-wrap container-xl p-0 ">
                <div className="col-3 bg-light p-3 align-self-start">
                    <h4 className="fw-bold">Bộ lọc</h4>

                    <div className="mt-5">
                        Sắp xếp theo:
                        <select className="form-control">
                            <option value="">--Chọn--</option>
                            <option value="name-up">
                                Sắp xếp theo tên tăng dần
                            </option>
                            <option value="name-down">
                                Sắp xếp theo tên giảm dần
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
                        <input
                            type="text"
                            className="form-control"
                            name="price_range"
                        />
                        <div className="d-flex justify-content-between mt-3">
                            <div>
                                Từ:<strong></strong>
                            </div>
                            <div>
                                Đến: <strong></strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col d-flex flex-wrap justify-content-around">
                    {listProducts.length > 0 ? (
                        <>
                            {listProducts.map((product) => (
                                <>
                                    <div
                                        key={product.id}
                                        class="shadow card hover m-2"
                                        style={{ width: '30%' }}
                                    >
                                        <div class="card  position-relative ">
                                            {product.discountPrice && (
                                                <div
                                                    style={{
                                                        zIndex: '1',
                                                        backgroundColor: 'red',
                                                        width: '50px',
                                                    }}
                                                    class="position-absolute top-0 start-0 text-white rounded-pill m-2 fw-bold d-flex justify-content-center"
                                                >
                                                    {product.discountPrice}
                                                </div>
                                            )}
                                            {product.imageBackground.endsWith(
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
                                                style={{ width: '80%' }}
                                                class="button border-white shadow fw-bold  add-to-cart-btn"
                                            >
                                                Chi tiết sản phẩm
                                            </Link>
                                        </div>

                                        <div class="card-body">
                                            <div class="d-flex justify-content-between">
                                                <span
                                                    class="fw-light"
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    +{product.totalColor} Màu
                                                    sắc
                                                </span>
                                                <span
                                                    class="fw-light"
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    +{product.totalSize} Kích
                                                    thước
                                                </span>
                                            </div>
                                            <h6 class=" mt-2">
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
                                                        {product.price}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ))}
                        </>
                    ) : (
                        <div>Chưa có sản phẩm trong danh mục này</div>
                    )}
                </div>
            </div>
        </>
    );
}
