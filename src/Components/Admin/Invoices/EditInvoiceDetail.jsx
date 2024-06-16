import { Link } from 'react-router-dom';
import Tittle from '../../Fragments/Tittle';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getInvoice } from '../../../Services/InvoiceService';
import { parseISO, format } from 'date-fns';
import { getAllInvoiceStatus } from '../../../Services/EnumService';
import { getAllEmployees } from '../../../Services/AccountService';
import { logout } from '../../../Services/Auth';

export default function EditInvoiceDetail() {
    const { id } = useParams();

    const [inputInvoice, setInputInvoice] = useState({
        name: '',
        phone: '',
        address: '',
        note: '',
        accountId: '',
    });

    const [invoice, setInvoice] = useState();

    const [listInvoiceStatus, setListInvoiceStatus] = useState([]);

    const [listEmployees, setListEmployees] = useState([]);

    useEffect(() => {
        fetchInvoice();
        fetchGetAllInvoicesStatus();
        fetchGetAllEmployee();
    }, [inputInvoice]);


    const fetchInvoice = async () => {
      await getInvoice(id).then((res) => {
            setInputInvoice({
                name: res.data.name,
                phone: res.data.phone,
                address: res.data.address,
                note: res.data.note,
                accountId: res.data.accountId,
            });
        
            setInvoice(res.data);
        });
    };

    const fetchGetAllEmployee = async () => {
        await getAllEmployees()
            .then((res) => {
                setListEmployees(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const fetchGetAllInvoicesStatus = async () => {
        await getAllInvoiceStatus()
            .then((res) => {
                setListInvoiceStatus(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputInvoice({ ...inputInvoice, [name]: value });
    };
    return (
        <>
            <Tittle tittle="Chi tiết đơn hàng" />
            <div className="mt-5 bg-white p-5 shadow border">
                <div class="col-12 mt-3 mb-3">
                    <form className="d-flex flex-wrap justify-content-between align-items-center row">
                        <div className="mb-5 d-flex flex-wrap justify-content-between align-items-center">
                            {invoice ? (
                                <div className="col-3">
                                    Ngày tạo:{' '}
                                    <span>
                                        {format(
                                            parseISO(invoice.createdAt),
                                            'HH:mm:ss -d/M/yyyy'
                                        )}
                                    </span>
                                </div>
                            ) : (
                                'Loading...'
                            )}

                            <div className=" col-3 d-flex">
                                <label className="form-label">
                                    Mã đơn hàng:{' '}
                                </label>
                                {invoice ? (
                                    <div>{invoice.invoiceCode}</div>
                                ) : (
                                    'Loading...'
                                )}
                            </div>

                            <div className="mb-3 col-3">
                                <label className="form-label">
                                    Nhân viên phụ trách:{' '}
                                    <span style={{ color: 'red' }}>*</span>
                                </label>

                                <select
                                    className="form-control"
                                    onChange={handleInputChange}
                                    name="accountId"
                                    value={invoice ? invoice.accountId : 'null'}
                                >
                                    <option value="null">Chưa chọn</option>
                                    {listEmployees.map((emlp) => (
                                        <option key={emlp.id} value={emlp.id}>
                                            {emlp.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Tên khách hàng
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                name="name"
                                onChange={handleInputChange}
                                className=" form-control"
                            />
                            <span className="text-danger"></span>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Số điện thoại
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                name="phone"
                                onChange={handleInputChange}
                                type="text"
                                className=" form-control"
                            />

                            <span className="text-danger"></span>
                        </div>

                        <div className="mb-3 col-12">
                            <label className="form-label">
                                Địa chỉ
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                name="address"
                                onChange={handleInputChange}
                                className="address form-control"
                            />

                            <span className="text-danger"></span>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">Ghi chú nội bộ</label>
                            <textarea
                                name="note"
                                onChange={handleInputChange}
                                className="form-control"
                                rows="4"
                                cols="50"
                            ></textarea>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Ghi chú của khách hàng: {"  "}
                            </label>
                            {invoice ? (
                                <span className="bg-warning">
                                    {invoice.customerNote}
                                </span>
                            ) : (
                                'Loading...'
                            )}
                        </div>

                        <button
                            style={{ textAlign: 'center' }}
                            type="submit"
                            className="mt-3 col-2 button"
                        >
                            Cập nhập đơn hàng
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
