import { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import useModal from '../../../CustomHooks/useModal';
import { updateQuantity } from '../../../Services/InvoiceDetailService';
import { toast } from 'react-toastify';
import { GetAllInvoicesDetail, getAllInvoicesDetail, getInvoice } from '../../../Services/InvoiceService';
import EditInvoiceDetail from './EditInvoiceDetail';

export default function InvoicesDetails({ id, listInvoicesDetail }) {
    const { openModal, closeModal } = useModal();
    const [quantityError, setQuantityError] = useState('');
    const [newIdQuantity, setNewIdQuantity] = useState({
        id: '',
        quantity: '',
    });
  const [details, setDetails] = useState([]);
  useEffect(() => {
    if (newIdQuantity.quantity !== "") {
        openModal(
            'Thay đổi số lượng',
            <>
                <input
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
            () => {
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
        );
    }
  }, [newIdQuantity]);

  useEffect(() => {  
      setDetails(listInvoicesDetail);
  }, [listInvoicesDetail]);
  
    const handleShowModalQuantity = (id, quantity) => {
        setNewIdQuantity({ id, quantity });
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
  }

    return (
        <div className="mt-2 bg-white p-5 shadow border">
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
                    {details ? details.map((detail) => (
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
                                {detail.totalPrice.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </td>
                            <td>
                                <Dropdown data-bs-theme="dark" className="me-3">
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
                                        <Dropdown.Item>Xóa</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    )): ""}
                </tbody>
            </table>
        </div>
    );
}
