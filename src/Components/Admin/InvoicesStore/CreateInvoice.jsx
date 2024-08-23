import { useEffect, useRef, useState } from 'react';
import useModal from '../../../CustomHooks/useModal';
import { toast } from 'react-toastify';
import {
    findAllProductsDetailByKey,
    getProductDetail,
} from '../../../Services/ProductDetailService';
import { Dropdown } from 'react-bootstrap';
import { createInvoiceAtStore } from '../../../Services/InvoiceService';
import { useNavigate } from 'react-router-dom';
import Title from '../../Fragments/Title';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import { getAllStores } from '../../../Services/StoreService';
import { error } from 'jquery';

export default function CreateInvoice() {
    const navigate = useNavigate();

    const [phoneError, setPhoneError] = useState('');
    const [nameError, setNameError] = useState('');
    const [isLoadingButton, setIsLoadingButton] = useState(false);

    const [inputInvoice, setInputInvoice] = useState({
        name: '',
        phone: '',
        store: '',
        note: '',
        invoicesDetails: [],
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
    const abortControllerRef = useRef(null);
    const [listStores, setListStores] = useState([]);
    const [totalBill, setTotalBill] = useState('');

    useEffect(() => {
        fetchListStores();
    }, []);

    useEffect(() => {
        calculateTotalAmount();
    }, [invoicesDetails]);

    const calculateTotalAmount = () => {
        setTotalBill(invoicesDetails.reduce((total, detail) => {
            return total + detail.price * detail.quantity;
        }, 0));
    };

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
                        if (Number(newIdQuantity.quantity) === 0) {
                            setInvoicesDetails((prevList) =>
                                prevList.filter(
                                    (detail) => detail.id !== newIdQuantity.id
                                )
                            );
                        } else {
                            setInvoicesDetails((list) =>
                                list.map((detail) =>
                                    detail.id === newIdQuantity.id
                                        ? {
                                              ...detail,
                                              quantity: newIdQuantity.quantity,
                                          }
                                        : detail
                                )
                            );
                        }

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

    const fetchListStores = () => {
        getAllStores()
            .then((res) => {
                setListStores(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const submitForm = (e) => {
        e.preventDefault();
        let isValid = true;

        if (inputInvoice.name === '') {
            isValid = false;
            setNameError('Tên không được để trống');
        } else {
            setNameError('');
        }

        if (inputInvoice.phone === '') {
            isValid = false;
            setPhoneError('Số điện thoại không được để trống');
        } else if (isNaN(inputInvoice.phone)) {
            isValid = false;
            setPhoneError('Số điện thoại không hợp lệ');
        } else if (inputInvoice.phone.length !== 10) {
            isValid = false;
            setPhoneError('Số điện thoại phải có 10 ký tự');
        } else {
            setPhoneError('');
        }

        if (isValid) {
            setIsLoadingButton(true);
            setInputInvoice((prevState) => ({
                ...prevState,
                invoicesDetails: invoicesDetails.map((detail) => ({
                    productDetailId: detail.id,
                    quantity: detail.quantity,
                })),
            }));
            createInvoiceAtStore(inputInvoice)
                .then(() => {
                    navigate('/admin/invoices/store');
                    toast.success('tạo đơn mới thành công');
                })
                .catch((err) => {
                    toast.error(err.response.data);
                })
                .finally(() => {
                    setIsLoadingButton(false);
                });
        }
    };

    const handleShowModalQuantity = (id, quantity) => {
        setNewIdQuantity({ id, quantity });
    };

    const fetchProductsDetail = (key, abortController) => {
        if (key !== '') {
            findAllProductsDetailByKey(key, {
                signal: abortController.signal,
            })
                .then((res) => {
                    setListProductsDetail(res.data);
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

    const handleDelete = (detailId) => {
        setInvoicesDetails((prevList) =>
            prevList.filter((detail) => detail.id !== detailId)
        );
    };

    const handleInputChange = (e) => {
        setKey(e.target.value);
    };

    const handleInputFormChange = (e) => {
        const { name, value } = e.target;
        setInputInvoice({ ...inputInvoice, [name]: value });
    };

    const handleAdd = (productDetailId, quantity) => {
        if (quantity > 0) {
            getProductDetail(productDetailId).then((res) => {
                const invoiceDetail = {
                    id: res.data.id,
                    imageBackground: res.data.imageBackground,
                    code: res.data.code,
                    productName: res.data.productName,
                    color: res.data.color,
                    size: res.data.size,
                    price:
                        res.data.discountPrice === null
                            ? res.data.price
                            : res.data.discountPrice,
                    quantity: 1,
                };

                setInvoicesDetails((prevList) => {
                    // Kiểm tra xem id đã tồn tại trong invoicesDetails hay chưa
                    const existingInvoice = prevList.find(
                        (detail) => detail.id === invoiceDetail.id
                    );

                    if (existingInvoice) {
                        // Nếu id đã tồn tại, cập nhật quantity
                        return prevList.map((detail) =>
                            detail.id === invoiceDetail.id
                                ? { ...detail, quantity: detail.quantity + 1 }
                                : detail
                        );
                    } else {
                        // Nếu id chưa tồn tại, thêm mới vào danh sách
                        return [...prevList, invoiceDetail];
                    }
                });
            });
        } else {
            toast.error('Sản phẩm đã hết hàng');
        }
    };

    return (
        <>
            <Title title="Tạo đơn hàng" />
            <div className="mt-5 bg-white p-5 shadow border">
                <div className="col-12 mb-3">
                    <form
                        onSubmit={submitForm}
                        className="d-flex flex-wrap justify-content-between align-items-center row"
                    >
                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Tên khách hàng
                                <span style={{ color: 'red' }}>*</span>
                            </label>

                            <input
                                value={inputInvoice.name}
                                name="name"
                                onChange={handleInputFormChange}
                                className={`form-control ${
                                    nameError ? 'border-danger' : ''
                                } `}
                            />
                            <span className="text-danger">{nameError}</span>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Số điện thoại
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                onChange={handleInputFormChange}
                                value={inputInvoice.phone}
                                type="text"
                                name="phone"
                                className={`form-control ${
                                    phoneError ? 'border-danger' : ''
                                } `}
                            />
                            <span className="text-danger">{phoneError}</span>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Chọn cửa hàng
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <select
                                onChange={handleInputFormChange}
                                name="store"
                                className="form-control"
                            >
                                {listStores.map((store) => (
                                    <>
                                        <option key={store.id} value={store.id}>
                                            {store.name}
                                        </option>
                                    </>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">Ghi chú</label>
                            <textarea
                                name="note"
                                value={inputInvoice.note}
                                onChange={handleInputFormChange}
                                className="form-control"
                                rows="4"
                                cols="50"
                            ></textarea>
                        </div>

                        <div className="d-flex justify-content-between">
                            <button
                                disabled={isLoadingButton}
                                style={{ textAlign: 'center' }}
                                type="submit"
                                className="mt-3 button col-4"
                            >
                                Tạo đơn hàng
                            </button>
                            {isLoadingButton && <LoadingSpinner />}
                        </div>
                    </form>
                </div>
            </div>

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
                                            {listProductsDetail.map((pd) => (
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
                                                        pd.quantity > 0
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
                                                            {pd.productName} |{' '}
                                                            {pd.size} |{' '}
                                                            {pd.color}
                                                        </span>

                                                        <div className="d-flex justify-content-between">
                                                            <span>
                                                                {pd.discountPrice !=
                                                                null ? (
                                                                    <>
                                                                        <span className="text-decoration-line-through">
                                                                            {pd.price.toLocaleString(
                                                                                'vi-VN',
                                                                                {
                                                                                    style: 'currency',
                                                                                    currency:
                                                                                        'VND',
                                                                                }
                                                                            )}
                                                                        </span>
                                                                        -
                                                                        <span>
                                                                            {pd.discountPrice.toLocaleString(
                                                                                'vi-VN',
                                                                                {
                                                                                    style: 'currency',
                                                                                    currency:
                                                                                        'VND',
                                                                                }
                                                                            )}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    pd.price.toLocaleString(
                                                                        'vi-VN',
                                                                        {
                                                                            style: 'currency',
                                                                            currency:
                                                                                'VND',
                                                                        }
                                                                    )
                                                                )}
                                                            </span>

                                                            <span className="fw-lighter">
                                                                Số lượng:{' '}
                                                                {pd.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
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
                        {invoicesDetails.length > 0 ? (
                            invoicesDetails.map((detail) => (
                                <tr key={detail.id}>
                                    <td>
                                        {detail.imageBackground.endsWith(
                                            '.mp4'
                                        ) ? (
                                            <video width="250px" controls>
                                                <source
                                                    src={detail.imageBackground}
                                                    type="video/mp4"
                                                />
                                            </video>
                                        ) : (
                                            <img
                                                src={detail.imageBackground}
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
                                        {detail.price.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </td>
                                    <td>{detail.quantity}</td>
                                    <td>
                                        {(
                                            detail.price * detail.quantity
                                        ).toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
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
                                                        handleDelete(detail.id);
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
                                    <td colSpan={7} className="fw-bolder">
                                        Thành tiền
                                    </td>
                                    <td colSpan={7} className="">
                                        <div className="d-flex flex-wrap text-danger fw-semibold fs-3">
                                            {totalBill.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            </>
                        ) : null}
                    </tbody>
                </table>

                <div>
              
                </div>
            </div>
        </>
    );
}
