import { useEffect, useState } from 'react';
import useCart from '../../CustomHooks/useCart';
import useAuth from '../../CustomHooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { checkoutVnpay } from '../../Services/InvoiceService';
import { toast } from 'react-toastify';

export default function Cart() {
    const { cart, handleUpdateCart, handleRemove, totalPrice } = useCart();
    const { auth } = useAuth();
    const [selectPay, setSelectPay] = useState('cash');
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [customerInfo, setCustomerInfo] = useState({
        name: auth?.account?.name || '',
        phone: auth?.account?.phone || '',
        address: auth?.account?.address || '',
        customerNote: auth?.account?.customerNote || '',
        shippingFee: 0,
        invoicesDetails: [],
    });

    const [totalBill, setTotalBill] = useState(
        totalPrice + (totalPrice >= 500000 ? 0 : 30000)
    );

    useEffect(() => {
        setCustomerInfo((prevState) => ({
            ...prevState,
            shippingFee: totalPrice >= 500000 ? 0 : 30000,
            invoicesDetails: cart.map((item) => ({
                productDetailId: item.productDetail.id,
                quantity: item.quantity,
            })),
        }));
        setTotalBill(totalPrice + (totalPrice >= 500000 ? 0 : 30000));
    }, [totalPrice]);

    const handleChangeQuantity = (id, newQuantity) => {
        handleUpdateCart(id, newQuantity);
    };
    const handleRemoveCartItem = (id) => {
        handleRemove(id);
    };
    const handlePaymentChange = (e) => {
        setSelectPay(e.target.value);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const isValid = true;

        if (customerInfo.name === '') {
            isValid = false;
            setNameError('Tên không được để trống');
        } else setNameError('');

        if (customerInfo.phone === '') {
            isValid = false;
            setPhoneError('Số điện thoại không được để trống');
        } else if (isNaN(customerInfo.phone)) {
            isValid = false;
            setPhoneError('Số điện thoại không hợp lệ');
        } else {
            setPhoneError('');
        }

        if (customerInfo.address === '') {
            isValid = false;
            setAddressError('Địa chỉ không được để trống');
        } else setAddressError('');

        if (isValid) {
            if (selectPay === 'vnpay') {
                
                checkoutVnpay(customerInfo)
                    .then((res) => {
                        window.location.href = res.data;
                    })
                    .catch((error) => {
                        toast.error(error);
                        console.error(error);
                    });
            }
        }
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

                            <div className="border mt-5 p-3 bg-light">
                                <h4>Hình thức thanh toán</h4>
                                <div className="mt-3 border p-5 bg-white">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={selectPay === 'cash'}
                                        onChange={handlePaymentChange}
                                    />
                                    <img
                                        className="mx-3"
                                        src={
                                            process.env.PUBLIC_URL +
                                            '/kisspng-cash-on-delivery-money-electronic-bill-payment-5c80924abdc4d0.4008274915519299307773.jpg'
                                        }
                                        alt=""
                                        width="20px"
                                    />
                                    Thanh toán bằng tiền mặt
                                </div>
                                <div className="mt-3 border bg-white p-5">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="paymentMethod"
                                        value="vnpay"
                                        checked={selectPay === 'vnpay'}
                                        onChange={handlePaymentChange}
                                    />
                                    <img
                                        className="ms-1"
                                        src={
                                            process.env.PUBLIC_URL +
                                            '/vnpay-logo_64dc3da9d7a11.jpg'
                                        }
                                        alt=""
                                        width="50px"
                                    />
                                    Thanh toán qua VNPay
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {cart?.length > 0 && (
                    <div class="d-flex flex-column align-items-center col-12 mt-5">
                        <h1 class="border-bottom p-2">Thông tin người nhận</h1>
                        <form onSubmit={handleSubmit}>
                            <div class="row">
                                <div class="mb-3">
                                    <label class="form-label">
                                        Họ Tên
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={
                                            nameError !== ''
                                                ? 'border-danger form-control'
                                                : 'form-control'
                                        }
                                        value={customerInfo.name}
                                        onChange={handleChange}
                                        name="name"
                                    />
                                    <span class="text-danger">{nameError}</span>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">
                                        Số điện thoại
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        value={customerInfo.phone}
                                        onChange={handleChange}
                                        type="text"
                                        className={
                                            phoneError !== ''
                                                ? 'border-danger form-control'
                                                : 'form-control'
                                        }
                                        name="phone"
                                    />
                                    <span class="text-danger">{phoneError}</span>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">
                                        Địa chỉ
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        value={customerInfo.address}
                                        onChange={handleChange}
                                        type="text"
                                        className={
                                            addressError !== ''
                                                ? 'border-danger form-control'
                                                : 'form-control'
                                        }
                                        name="address"
                                    />
                                    <span class="text-danger">{addressError}</span>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">
                                        Lời nhắn của bạn
                                    </label>
                                    <textarea
                                        value={customerInfo.customerNote}
                                        onChange={handleChange}
                                        class="form-control"
                                        name="customerNote"
                                    ></textarea>
                                </div>
                                <button class="mt-3 col-4 button" type="submit">
                                    Đặt hàng
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}
