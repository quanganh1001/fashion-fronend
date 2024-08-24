import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    getInvoiceAtStore,
} from '../../../Services/InvoiceService';
import { parseISO, format } from 'date-fns';

import { toast } from 'react-toastify';

import Title from '../../Fragments/Title';
import useModal from '../../../CustomHooks/useModal';

export default function InvoiceDetailAtStore() {
    const { id } = useParams();
    const [invoice, setInvoice] = useState('');

    useEffect(() => {
        fetchInvoice();
    }, []);

    const fetchInvoice = () => {
        getInvoiceAtStore(id)
            .then((res) => {
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
                <div>
                    <span>
                        Tên khách hàng: <span>{invoice.name}</span>
                    </span>
                </div>
                <div>
                    <span>
                        Số điện thoại: <span>{invoice.phone}</span>
                    </span>
                </div>
                <div>
                    <span>
                        Mua tại cửa hàng: <span>{invoice.store}</span>
                    </span>
                </div>
                <div>
                    <span>
                        Nhân viên bán hàng: <span>{invoice.accountName}</span>
                    </span>
                </div>
                <div>
                    <span>
                        Ngày mua hàng:{' '}
                        <span>
                            {format(
                                parseISO(invoice.createdAt),
                                'HH:mm:ss - d/M/yyyy'
                            )}
                        </span>
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
                    {invoice.invoicesDetails.length > 0 ? (
                        invoice.invoicesDetails.map((detail) => (
                            <tr key={detail.id}>
                                <td>
                                    {detail.imageBackground.endsWith('.mp4') ? (
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
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9}>Chưa có sản phẩm</td>
                        </tr>
                    )}
                    {invoice.invoicesDetails.length > 0 ? (
                        <>
                            <tr>
                                <td colSpan={7} className="fw-bolder">
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
                </tbody>
            </table>
        </>
    );
      
}
