import { useEffect, useRef, useState } from 'react';
import useModal from '../../../CustomHooks/useModal';
import { toast } from 'react-toastify';
import { findAllProductsDetailByKey } from '../../../Services/ProductDetailService';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import { Dropdown } from 'react-bootstrap';

export default function CreateInvoice() {
    const [invoice, setInvoice] = useState({
        name: '',
        phone: '',
        address: '',
        customerNote: '',
        shippingFee: 0,
    });

    const { openModal, closeModal } = useModal();
    const [quantityError, setQuantityError] = useState('');
    const [newIdQuantity, setNewIdQuantity] = useState({
        id: '',
        quantity: '',
    });
    const [isShowAddDetail, setIsShowAddDetail] = useState(false);
    const [invoicesDetails, setInvoicesDetails] = useState([]);
    const [listProductsDetail, setListProductsDetail] = useState([]);
    const [key, setKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState(true);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (newIdQuantity.quantity !== '') {
            openModal(
                'Thay đổi số lượng',
                <>
                    <input
                        type="text"
                        value={newIdQuantity.quantity}
                        className="form-control"
                        onChange={(e) =>
                            setNewIdQuantity({
                                ...newIdQuantity,
                                quantity: e.target.value,
                            })
                        }
                    />
                    <span className="text-danger">{quantityError}</span>
                </>,
                (e) => {
                    e.preventDefault();
                    let isValid = true;

                    if (newIdQuantity.quantity === '') {
                        isValid = false;
                        setQuantityError('Số lượng không được để trống');
                    } else if (
                        newIdQuantity.quantity !== '' &&
                        isNaN(newIdQuantity.quantity)
                    ) {
                        isValid = false;
                        setQuantityError('Số lượng không đúng định dạng');
                    } else if (
                        newIdQuantity.quantity !== '' &&
                        newIdQuantity.quantity < 0
                    ) {
                        isValid = false;
                        setQuantityError('Số lượng không đúng định dạng');
                    } else {
                        setQuantityError('');
                    }

                    if (isValid) {
                        setIsLoadingDetail(true);

                        closeModal();
                    }
                }
            );
        }
    }, [newIdQuantity, quantityError]);

    useEffect(() => {
        if (key !== '') {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Tạo AbortController mới cho yêu cầu mới
            abortControllerRef.current = new AbortController();

            fetchProductsDetail(key, abortControllerRef.current);

            // Cleanup function to abort the fetch on unmount or key change
            return () => {
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
            };
        }
    }, [key]);

    const handleShowModalQuantity = (id, quantity) => {
        setNewIdQuantity({ id, quantity });
    };

    const fetchProductsDetail = (key, abortController) => {
        setIsLoading(true);
        if (key !== '') {
            findAllProductsDetailByKey(key, {
                signal: abortController.signal,
            })
                .then((res) => {
                    setListProductsDetail(res.data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    if (err.name === 'AbortError') {
                        console.log('Fetch aborted');
                    } else {
                        console.error(err);
                    }
                });
        } else {
            setListProductsDetail([]);
        }
    };

    const handleDelete = (detailId) => {};

    const handleInputChange = (e) => {
        setKey(e.target.value);
    };

    const handleAdd = (productDetailId, quantity) => {
        if (quantity > 0) {
            setIsLoadingDetail(true);
        } else {
            toast.error('Sản phẩm đã hết hàng');
        }
    };

    return (
        <>
            <div className="mt-2 bg-white p-5 shadow border">
                <div className="d-flex flex-wrap">
                    {!isShowAddDetail ? (
                        <button
                            className="mb-3 button"
                            onClick={() => setIsShowAddDetail(true)}
                        >
                            Thêm
                        </button>
                    ) : (
                        <>
                            <button
                                className="btn btn-danger me-3 mb-3"
                                onClick={() => {
                                    setKey('');
                                    setIsShowAddDetail(false);
                                }}
                            >
                                Đóng
                            </button>
                            <div className="col-10 position-relative">
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Nhập mã sản phẩm hoặc tên sản phẩm..."
                                    className=" form-control"
                                />
                                {isShowAddDetail && key !== '' ? (
                                    <>
                                        <ul
                                            className="  col-12 border list-group position-absolute overflow-auto"
                                            style={{
                                                bottom: '60px',
                                                maxHeight: '70vh',
                                            }}
                                        >
                                            {isLoading ? (
                                                <LoadingSpinner />
                                            ) : (
                                                <>
                                                    {listProductsDetail.map(
                                                        (pd) => (
                                                            <li
                                                                onClick={() =>
                                                                    handleAdd(
                                                                        pd.id,
                                                                        pd.quantity
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: 'pointer',
                                                                }}
                                                                className={
                                                                    pd.quantity >
                                                                    0
                                                                        ? ' d-flex align-items-center list-group-item'
                                                                        : ' text-decoration-line-through d-flex align-items-center list-group-item'
                                                                }
                                                                key={pd.id}
                                                            >
                                                                {pd.imageBackground.endsWith(
                                                                    '.mp4'
                                                                ) ? (
                                                                    <video
                                                                        width="150px"
                                                                        controls
                                                                    >
                                                                        <source
                                                                            src={
                                                                                pd.imageBackground
                                                                            }
                                                                            type="video/mp4"
                                                                        />
                                                                    </video>
                                                                ) : (
                                                                    <img
                                                                        src={
                                                                            pd.imageBackground
                                                                        }
                                                                        width="50px"
                                                                        alt=""
                                                                    />
                                                                )}
                                                                <div>
                                                                    <span>
                                                                        {
                                                                            pd.productName
                                                                        }{' '}
                                                                        |{' '}
                                                                        {
                                                                            pd.size
                                                                        }{' '}
                                                                        |{' '}
                                                                        {
                                                                            pd.color
                                                                        }
                                                                    </span>

                                                                    <div className="d-flex justify-content-between">
                                                                        <span>
                                                                            {pd.discountPrice !=
                                                                            null
                                                                                ? pd.discountPrice
                                                                                : pd.price}
                                                                        </span>

                                                                        <span className="fw-lighter">
                                                                            Số
                                                                            lượng:{' '}
                                                                            {
                                                                                pd.quantity
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    )}
                                                </>
                                            )}
                                        </ul>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <table className="table table-striped table-hover table-bordered border">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Mã sản phẩm</th>
                            <th>Tên sản phẩm</th>
                            <th>Màu sắc</th>
                            <th>Size</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Tổng tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingDetail ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                {invoicesDetails.length > 0 ? (
                                    invoicesDetails.map((detail) => (
                                        <tr key={detail.id}>
                                            <td>
                                                {detail.imgUrl.endsWith(
                                                    '.mp4'
                                                ) ? (
                                                    <video
                                                        width="250px"
                                                        controls
                                                    >
                                                        <source
                                                            src={detail.imgUrl}
                                                            type="video/mp4"
                                                        />
                                                    </video>
                                                ) : (
                                                    <img
                                                        src={detail.imgUrl}
                                                        width="100px"
                                                        alt=""
                                                    />
                                                )}
                                            </td>
                                            <td>{detail.code}</td>
                                            <td>{detail.productName}</td>
                                            <td>{detail.color}</td>
                                            <td>{detail.size}</td>
                                            <td>
                                                {detail.price.toLocaleString(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }
                                                )}
                                            </td>
                                            <td>{detail.quantity}</td>
                                            <td>
                                                {detail.totalPrice.toLocaleString(
                                                    'vi-VN',
                                                    {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    }
                                                )}
                                            </td>
                                            <td>
                                                <Dropdown
                                                    data-bs-theme="dark"
                                                    className="me-3"
                                                >
                                                    <Dropdown.Toggle variant="dark bg-gradient btn-sm">
                                                        Hành động
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleShowModalQuantity(
                                                                    detail.id,
                                                                    detail.quantity
                                                                )
                                                            }
                                                        >
                                                            Sửa số lượng
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() => {
                                                                handleDelete(
                                                                    detail.id
                                                                );
                                                            }}
                                                        >
                                                            Xóa
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9}>Chưa có sản phẩm</td>
                                    </tr>
                                )}
                                {invoicesDetails.length > 0 ? (
                                    <>
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="fw-bolder"
                                            >
                                                Thành tiền
                                            </td>
                                            <td colSpan={7} className="">
                                                <div className="d-flex flex-wrap text-danger fw-semibold fs-3">
                                                    {invoice.totalBill.toLocaleString(
                                                        'vi-VN',
                                                        {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        }
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                ) : null}
                            </>
                        )}
                    </tbody>
                </table>

                <div>
                    {/* <span>
                        Ghi chú:
                        <br />- Đơn đã thanh toán thì không thể chỉnh sửa sản
                        phẩm mua, phí ship
                        <br />- Đơn đã chốt thì không thể sửa thông tin đơn hàng
                    </span> */}
                </div>
            </div>
        </>
    );
}
