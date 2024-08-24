import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    getInvoiceAtStore,
} from '../../../Services/InvoiceService';
import { parseISO, format } from 'date-fns';

import Title from '../../Fragments/Title';

export default function InvoiceDetailAtStore() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState('');

    useEffect(() => {
        fetchInvoice();
    }, []);

    const fetchInvoice = () => {
        getInvoiceAtStore(id)
            .then((res) => {
                console.log(res.data);
                
                setInvoice(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            
    };

    return (
        <>
            <Title title="Chi tiết đơn hàng" />
            <div className="mt-5 bg-white p-5 shadow border">
                <div className="mt-3">
                    <span className="fw-bold">Tên khách hàng:</span>{' '}
                    <span>{invoice.name}</span>
                </div>
                <div className="mt-3">
                    <span className="fw-bold">Số điện thoại:</span>{' '}
                    <span>{invoice.phone}</span>
                </div>
                <div className="mt-3">
                    <span className="fw-bold">Mua tại cửa hàng: </span>{' '}
                    <span>{invoice.store}</span>
                </div>
                <div className="mt-3">
                    <span className="fw-bold">Nhân viên bán hàng:</span>{' '}
                    <span>{invoice.accountName}</span>
                </div>
                <div className="mt-3">
                    <span className="fw-bold">Ngày mua hàng: </span>
                    <span>
                        {invoice &&
                            format(
                                parseISO(invoice.createdAt),
                                'HH:mm:ss - d/M/yyyy'
                            )}
                    </span>
                </div>
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
                    {invoice &&
                    invoice.invoicesDetails &&
                    invoice.invoicesDetails.length > 0 ? (
                        invoice.invoicesDetails.map((detail) => (
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
                                    {(
                                        detail.price * detail.quantity
                                    ).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9}>Chưa có sản phẩm</td>
                        </tr>
                    )}
                    {invoice && invoice.invoicesDetails.length > 0 ? (
                        <>
                            <tr>
                                <td colSpan={7} className="fw-bolder d-fle">
                                    <span>Thành tiền</span>
                                </td>
                                <td colSpan={7} className="">
                                    <div className="text-danger fw-semibold fs-3">
                                        <div>
                                            {invoice.totalBill.toLocaleString(
                                                'vi-VN',
                                                {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                }
                                            )}
                                        </div>
                                        <div>(Đã thanh toán)</div>
                                    </div>
                                </td>
                            </tr>
                        </>
                    ) : null}
                </tbody>
            </table>
        </>
    );
      
}
