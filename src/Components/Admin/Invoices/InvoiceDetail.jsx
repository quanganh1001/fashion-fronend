import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import useModal from '../../../CustomHooks/useModal';
import {
    deleteInvoiceDetail,
    updateQuantity,
} from '../../../Services/InvoiceDetailService';
import { toast } from 'react-toastify';
import {
    addInvoiceDetail,
    getAllInvoicesDetail,
} from '../../../Services/InvoiceService';
import { findAllProductsDetailByKey } from '../../../Services/ProductDetailService';

export default function InvoicesDetails({ id, listInvoicesDetail }) {
    const { openModal, closeModal } = useModal();
    const [quantityError, setQuantityError] = useState('');
    const [newIdQuantity, setNewIdQuantity] = useState({
        id: '',
        quantity: '',
    });
    const [isShowAddDetail, setIsShowAddDetail] = useState(false);
    const [details, setDetails] = useState([]);
    const [listProductsDetail, setListProductsDetail] = useState([]);

    const [key, setKey] = useState('');

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
                        console.log('Số lượng không được để trống');
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
                        updateQuantity(newIdQuantity.id, newIdQuantity.quantity)
                            .then(() => {
                                toast.success('Cập nhật số lượng thành công!');
                                fetchDetail();
                            })
                            .catch((err) => {
                                console.error(err);
                                toast.error('Cập nhật số lượng thất bại.');
                            });

                        closeModal();
                    }
                }
            );
        }
    }, [newIdQuantity, quantityError]);

    useEffect(() => {
        setDetails(listInvoicesDetail);
    }, [listInvoicesDetail]);

    useEffect(() => {
        setKey("")
        setIsShowAddDetail(false);
    }, [details])
    
    useEffect(() => {
        if (key !== '') {
            fetchProductsDetail();
        }
    }, [key]);

    const handleShowModalQuantity = (id, quantity) => {
        setNewIdQuantity({ id, quantity });
    };

    const fetchProductsDetail = async () => {
        if (key !== '') {
            await findAllProductsDetailByKey(key).then((res) => {
                setListProductsDetail(res.data);
            });
        } else {
            setListProductsDetail([]);
        }
    };

    const fetchDetail = async () => {
        await getAllInvoicesDetail(id)
            .then((res) => {
                setDetails(res.data);
            })
            .catch((err) => {
                console.error(err);
                toast.error(err);
            });
    };

    const handleDelete = async (detailId) => {
        await deleteInvoiceDetail(detailId)
            .then((res) => {
                toast.success('Xóa thành công!');
                fetchDetail();
            })
            .catch((err) => {
                console.error(err);
                toast.error('Có lỗi xảy ra!');
            });
    };

    const handleInputChange = (e) => {
        setKey(e.target.value);
    };

    const handleAdd = async (productDetailId, quantity) => {
        if (quantity > 0) {
            await addInvoiceDetail(id, productDetailId)
                .then(() => {
                    toast.success('Thêm thành công!');
                    fetchDetail();
                })
                .catch((err) => {
                    toast.error(err);
                    console.log(err);
                });
        } else {
            toast.error("Sản phẩm đã hết hàng")
        }
        
    };
    return (
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
                                        className="col-12 border list-group position-absolute overflow-auto"
                                        style={{
                                            bottom: '60px',
                                            maxHeight: '70vh',
                                        }}
                                    >
                                        {listProductsDetail.map((pd) => (
                                            <li
                                                onClick={() => handleAdd(pd.id,pd.quantity)}
                                                className={
                                                    pd.quantity > 0
                                                        ? 'd-flex align-items-center list-group-item'
                                                        : 'text-decoration-line-through d-flex align-items-center list-group-item'
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
                                                        src={pd.imageBackground}
                                                        width="50px"
                                                        alt=""
                                                    />
                                                )}
                                                <div>
                                                    <span>
                                                        {pd.productName} |{' '}
                                                        {pd.size} | {pd.color}
                                                    </span>

                                                    <div className="d-flex justify-content-between">
                                                        <span>
                                                            {pd.discountPrice !=
                                                            null
                                                                ? pd.discountPrice
                                                                : pd.price}
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
                    {details
                        ? details.map((detail) => (
                              <tr key={detail.id}>
                                  <td>
                                      {detail.imgUrl.endsWith('.mp4') ? (
                                          <video width="250px" controls>
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
                                      {detail.price.toLocaleString('vi-VN', {
                                          style: 'currency',
                                          currency: 'VND',
                                      })}
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
                        : ''}
                </tbody>
            </table>

            <div className='justify-content-end'>
                <div>Tổng: <span></span></div>
            </div>
        </div>
    );
}
