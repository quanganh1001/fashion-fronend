import { useEffect, useState } from 'react';
import useCart from '../../CustomHooks/useCart';
import useAuth from '../../CustomHooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Cart() {
    const { cart, handleUpdateCart, handleRemove, totalPrice } = useCart();
    const { auth } = useAuth();
    const [inputQuantity, setInputQuantity] = useState(1);

    const [customerInfo, setCustomerInfo] = useState({
        name: auth?.account?.name || '',
        phone: auth?.account?.phone || '',
        address: auth?.account?.address || '',
        customerNote: auth?.account?.customerNote || '',
        shippingFee: 0,
        listProduct: cart.map((item) => ({
            productDetailId: item.productDetail.id,
            quantity: item.quantity,
        })),
    });

    const [totalBill, setTotalBill] = useState(
        totalPrice + (totalPrice >= 500000 ? 0 : 30000)
    );

    useEffect(() => {
        setCustomerInfo((prevState) => ({
            ...prevState,
            shippingFee: totalPrice >= 500000 ? 0 : 30000,
        }));
        setTotalBill(totalPrice + (totalPrice >= 500000 ? 0 : 30000));
    }, [totalPrice]);

    const handleChangeQuantity = (id, newQuantity) => {
        handleUpdateCart(id, newQuantity);
    };
    const handleRemoveCartItem = (id) => {
        handleRemove(id);
    };
    return (
        <>
            <style>{`
                #cart{
                    max-height: 80vh;
                    overflow-y: auto;
                }
            `}</style>
            <div
                class="col-12 d-flex flex-wrap justify-content-between container-xl mb-5"
                style={{ minHeight: '30vh' }}
            >
                <h3 class="text-danger my-5">Giỏ hàng của bạn</h3>
                <div class="  col-12 d-flex justify-content-between">
                    <div class="col-8">
                        {cart?.length > 0 ? (
                            <div id="cart" class="  d-flex flex-column">
                                {cart.map((c) => (
                                    <div class=" d-flex mt-3 align-items-center">
                                        <FontAwesomeIcon
                                            onClick={() => {
                                                handleRemoveCartItem(
                                                    c.productDetail.id
                                                );
                                            }}
                                            className="mx-3"
                                            icon="fa-solid fa-square-minus"
                                            size="2xl"
                                            style={{ color: '#750000' }}
                                        />
                                        <div class="border border-light-subtle p-2 d-flex align-items-center col-11">
                                            {c.productDetail.imageBackground.endsWith(
                                                '.mp4'
                                            ) ? (
                                                <video
                                                    controls
                                                    autoplay
                                                    muted
                                                    style={{
                                                        maxHeight: '150px',
                                                    }}
                                                    class="img-thumbnail col-2"
                                                ></video>
                                            ) : (
                                                <img
                                                    src={
                                                        c.productDetail
                                                            .imageBackground
                                                    }
                                                    alt="..."
                                                    style={{
                                                        maxHeight: '150px',
                                                    }}
                                                    class="img-thumbnail col-2"
                                                />
                                            )}

                                            <div class=" p-3 col-10 ">
                                                <div class="d-flex justify-content-between col-12 ">
                                                    <div>
                                                        <span class="overflow-wrap fw-bold">
                                                            {
                                                                c.productDetail
                                                                    .productName
                                                            }
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="fw-light">
                                                            {
                                                                c.productDetail
                                                                    .color
                                                            }{' '}
                                                            -{' '}
                                                            {
                                                                c.productDetail
                                                                    .size
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div class="mt-3 d-flex">
                                                    <div>
                                                        Giá tiền:{' '}
                                                        {c.productDetail
                                                            .discountPrice !==
                                                        null ? (
                                                            <span>
                                                                <span
                                                                    style={{
                                                                        textDecorationLine:
                                                                            'line-through',
                                                                    }}
                                                                >
                                                                    {c.productDetail.price.toLocaleString(
                                                                        'vi-VN',
                                                                        {
                                                                            style: 'currency',
                                                                            currency:
                                                                                'VND',
                                                                        }
                                                                    )}
                                                                </span>
                                                                <span className="ms-2">
                                                                    {c.productDetail.discountPrice.toLocaleString(
                                                                        'vi-VN',
                                                                        {
                                                                            style: 'currency',
                                                                            currency:
                                                                                'VND',
                                                                        }
                                                                    )}
                                                                </span>
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                {c.productDetail.price.toLocaleString(
                                                                    'vi-VN',
                                                                    {
                                                                        style: 'currency',
                                                                        currency:
                                                                            'VND',
                                                                    }
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div class="mt-3">
                                                    <div className="d-flex align-items-center">
                                                        <div>Số lượng:</div>
                                                        <div>
                                                            <input
                                                                class="form-control ms-2"
                                                                type="number"
                                                                defaultValue={
                                                                    c.quantity
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    handleChangeQuantity(
                                                                        c
                                                                            .productDetail
                                                                            .id,
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                min="1"
                                                                max="99"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mt-3">
                                                    Tổng:{' '}
                                                    <span
                                                        style={{
                                                            color: 'red',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        {c.totalPriceItem.toLocaleString(
                                                            'vi-VN',
                                                            {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                        )}
                    </div>

                    {cart?.length > 0 && (
                        <div class="align-self-top col-4 p-2">
                            <div class="border p-2 bg-light">
                                <div class="d-flex justify-content-between p-2">
                                    <span>Tổng tiền:</span>
                                    <span class="fw-bold">
                                        {totalPrice.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </span>
                                </div>
                                <div class="d-flex justify-content-between p-2">
                                    <span>Phí ship:</span>
                                    <span class="fw-bold">
                                        {totalPrice >= 500000
                                            ? (0).toLocaleString('vi-VN', {
                                                  style: 'currency',
                                                  currency: 'VND',
                                              })
                                            : (30000).toLocaleString('vi-VN', {
                                                  style: 'currency',
                                                  currency: 'VND',
                                              })}
                                    </span>
                                </div>
                                <div class="d-flex justify-content-between p-2">
                                    <span>Tổng đơn:</span>
                                    <h4
                                        style={{ color: 'red' }}
                                        class="fw-bold"
                                    >
                                        {totalBill.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </h4>
                                </div>
                                <p class="p-2 fw-light">
                                    *Miễn phí vận chuyển với đơn hàng từ
                                    500.000đ{' '}
                                </p>
                            </div>

                            <div class="border mt-5 p-3 bg-light">
                                <h4>Hình thức thanh toán</h4>
                                <div class="mt-3 border p-5 bg-white">
                                    <input
                                        class="form-check-input"
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                    />
                                    <img
                                        src="/image/kisspng-dollar-sign-united-states-dollar-dollar-sign-5a737456028001.6807977015175158620103.png"
                                        alt=""
                                        width="20px"
                                    />
                                    Thanh toán bằng tiền mặt
                                </div>
                                <div class="mt-3 border bg-white p-5">
                                    <input
                                        class="form-check-input"
                                        type="radio"
                                        name="paymentMethod"
                                        value="vnpay"
                                    />
                                    <img
                                        src="/image/assets_-M47Mjlovb1o8n1BkFz7_-MN7SxEcvT_Y3xuokNIN_-MN7THTOhIcyZG_wpSYr_Logo-VNPAYQR-update.png"
                                        alt=""
                                        width="50px"
                                    />
                                    Thanh toán qua VNPay
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* <div class="col-12 d-flex flex-wrap justify-content-between container-xl mb-5" style="min-height: 30vh">
  

    <div th:if="${#lists.size(CARTS) > 0}" class="col-12 d-flex justify-content-between">
        <div class="col-8 me-3">
            <h2 class="fw-bold">Giỏ hàng của bạn</h2>
            <div id="list-cart" >
                <div th:each="cart : ${CARTS}" class=" d-flex align-items-center">
                    <div class="me-3">
                        <a th:href="@{/carts/delete?prDetailCode=__${cart.code}__}">
                            <i class="fa-solid fa-x" style="color: red;"></i>
                        </a>
                    </div>
                    <div class="border border-collapse border-light-subtle p-2 d-flex align-items-center col-11">
                        <img th:unless="${cart.imgBackground.endsWith('.mp4')}"
                             th:src="${cart.imgBackground }" alt="..." style="max-height: 150px"
                             class="img-thumbnail col-2">

                        <video th:if="${cart.imgBackground.endsWith('.mp4')}"
                               controls autoplay muted
                               th:src="${cart.imgBackground}"
                               style="max-height: 150px"
                               class="img-thumbnail col-2"></video>


                        <div class="ps-3 col-10 ">
                            <div class="d-flex justify-content-between col-12 ">
                                <div>
                                    <span>Tên sản phẩm: </span>
                                    <span class="fw-bold" th:text="${cart.productName}"></span>
                                </div>
                                <div>
                                    <span class="fw-light" th:text="${cart.color} + ' - ' "></span>
                                    <span class="fw-light" th:text="${cart.size}"></span>
                                </div>
                            </div>
                            <div class="mt-3 d-flex">
                                <div>Giá tiền:</div>
                                <div th:if="${cart.discountPrice == null}">
                            <span th:text="${#numbers.formatDecimal(cart.price, 0, 'POINT', 0, 'POINT')} +' đ'"
                                  th:id="${cart.code} + '-price'"
                                  th:data-price="${cart.price}"
                                  class="fw-bold">
                            </span>
                                </div>

                                <div th:unless="${cart.discountPrice == null}">
                            <span th:text="${#numbers.formatDecimal(cart.price, 0, 'POINT', 0, 'POINT')} +' đ'"
                                  style="text-decoration: line-through;"></span>
                                    <span th:id="${cart.code} + '-price'"
                                          th:text="${#numbers.formatDecimal(cart.discountPrice, 0, 'POINT', 0, 'POINT')} +' đ'"
                                          th:data-price="${cart.discountPrice}"></span>

                                </div>
                            </div>
                            <div class="mt-3">Số lượng:
                                <input class="quantity col-1"
                                       type="number"
                                       th:data-prDetail="${cart.code}"
                                       th:value="${cart.quantity}"
                                       min="1" max="99">
                            </div>
                            <div class="mt-3">Tổng:
                                <span th:if="${cart.discountPrice == null}" th:id="${cart.code} + 'P'"
                                      th:text="${#numbers.formatDecimal(cart.quantity * cart.price, 0, 'POINT', 0, 'POINT')} +' đ'"
                                      class="text-danger fw-bold"></span>
                                <span th:unless="${cart.discountPrice == null}" th:id="${cart.code} + 'P'"
                                      th:text="${#numbers.formatDecimal(cart.quantity * cart.discountPrice, 0, 'POINT', 0, 'POINT')} +' đ'"
                                      class="text-danger fw-bold">
                        </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div th:if="${#lists.size(CARTS) > 0}" th:include="~{web/component/InfoCart::InfoCart}"
             class="align-self-top col-4 p-2"
             id="InfoCart"></div>

    </div>

    <div class="d-flex flex-column align-items-center col-12 mt-5">
        <h1 class="border-bottom p-2">Thông tin người nhận</h1>
        <form id="form" th:action="@{/checkout}" method="post">
            <div class="row">
                <div class="mb-3">
                    <label for="name" class="form-label">Họ Tên<span style="color:red">*</span></label>
                    <input type="text" class="form-control" id="name" name="name">
                    <span id="nameError" class="text-danger"></span>
                </div>

                <div class="mb-3">
                    <label th:for="phone" class="form-label">Số điện thoại<span style="color:red">*</span></label>
                    <input type="text" class="form-control" id="phone" name="phone">
                    <span id="phoneError" class="text-danger"></span>
                </div>

                <div class="mb-3">
                    <label th:for="address" class="form-label">Địa chỉ<span style="color:red">*</span></label>
                    <input type="text" class="form-control" id="address" name="address">
                    <span id="addressError" class="text-danger"></span>
                </div>

                <div class="mb-3">
                    <label th:for="customerNote" class="form-label">Lời nhắn của bạn</label>
                    <textarea class="form-control" id="customerNote" name="customerNote"></textarea>
                </div>

                <button th:if="${number == 0}" style="text-align: center;font-size: 2rem"
                        class="col-6 btn btn-dark disabled">Đặt hàng
                </button>
                <button th:unless="${number == 0}" style="text-align: center;font-size: 1rem" type="submit"
                        id="btn-submit"
                        class="col-4 btn btn-dark">Đặt hàng
                </button>
            </div>
        </form>
    </div> */}
        </>
    );
}
