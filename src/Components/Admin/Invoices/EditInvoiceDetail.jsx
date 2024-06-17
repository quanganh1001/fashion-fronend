import Tittle from '../../Fragments/Tittle';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getInvoice, updateInvoice } from '../../../Services/InvoiceService';
import { parseISO, format } from 'date-fns';
import { getAllInvoiceStatus } from '../../../Services/EnumService';
import { getAllEmployees } from '../../../Services/AccountService';
import { toast } from 'react-toastify';
import InvoicesDetails from './InvoiceDetail';

export default function EditInvoiceDetail() {
    const { id } = useParams();

    const [inputInvoice, setInputInvoice] = useState({
        name: '',
        phone: '',
        address: '',
        note: '',
        accountId: '',
        invoiceStatus: '',
    });

    const [listInvoicesDetail, setListInvoicesDetail] = useState([]);

    const [invoice, setInvoice] = useState('');

    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [accountId, setAccountId] = useState();

    const [listInvoiceStatus, setListInvoiceStatus] = useState([]);

    const [listEmployees, setListEmployees] = useState([]);

    useEffect(() => {
        fetchGetAllInvoicesStatus();
        fetchGetAllEmployee();
    }, [inputInvoice]);

    useEffect(() => {
        fetchInvoice();
    }, []);

    const fetchInvoice = async () => {
        await getInvoice(id).then((res) => {
            setInputInvoice({
                name: res.data.name,
                phone: res.data.phone,
                address: res.data.address,
                note: res.data.note,
                accountId: res.data.accountId,
                invoiceStatus: res.data.invoiceStatus,
            });
            setInvoice(res.data);
            setListInvoicesDetail(res.data.invoicesDetails);
        }).catch((err) => {
            console.error(err)
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

    const updateForm = async (e) => {
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
            setPhoneError('Số điện thoại không đúng');
        } else {
            setPhoneError('');
        }

        if (inputInvoice.address === '') {
            isValid = false;
            setAddressError('Địa chỉ không được để trống');
        } else {
            setAddressError('');
        }

        if (inputInvoice.accountId === 'null') {
            isValid = false;
            setAccountId('Vui lòng chọn nhân viên');
        } else {
            setAccountId('');
        }

        if (isValid) {
            await updateInvoice(id, inputInvoice).then(() => {
                toast.success('Cập nhập thành công');
            });
        }
    };

    return (
        <>
            <Tittle tittle="Chi tiết đơn hàng" />
            <div className="mt-5 bg-white p-5 shadow border">
                <div className="col-12 mb-3">
                    <form
                        onSubmit={updateForm}
                        className="d-flex flex-wrap justify-content-between align-items-center row"
                    >
                        <div className="mb-5 d-flex flex-wrap justify-content-between align-items-center">
                            {invoice ? (
                                <div className="col-3">
                                    Ngày tạo:{' '}
                                    <span className="fw-bolder">
                                        {format(
                                            parseISO(invoice.createdAt),
                                            'HH:mm:ss -d/M/yyyy'
                                        )}
                                    </span>
                                    <div className=" d-flex mt-3">
                                        Mã đơn hàng:{'   '}
                                        <span className="fw-bolder">
                                            {invoice.invoiceCode}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}

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
                                <span className="text-danger">{accountId}</span>
                            </div>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Tên khách hàng
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                value={inputInvoice.name}
                                name="name"
                                onChange={handleInputChange}
                                className=" form-control"
                            />
                            <span className="text-danger">{nameError}</span>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Số điện thoại
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                value={inputInvoice.phone}
                                name="phone"
                                onChange={handleInputChange}
                                type="text"
                                className=" form-control"
                            />

                            <span className="text-danger">{phoneError}</span>
                        </div>

                        <div className="mb-3 col-12">
                            <label className="form-label">
                                Địa chỉ
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                value={inputInvoice.address}
                                name="address"
                                onChange={handleInputChange}
                                className="address form-control"
                            />

                            <span className="text-danger">{addressError}</span>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">Ghi chú nội bộ</label>
                            <textarea
                                name="note"
                                value={inputInvoice.note}
                                onChange={handleInputChange}
                                className="form-control"
                                rows="4"
                                cols="50"
                            ></textarea>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Ghi chú của khách hàng: {'  '}
                            </label>

                            <span className="bg-warning">
                                {invoice.customerNote}
                            </span>
                        </div>
                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Trạng thái đơn hàng: {'  '}
                            </label>

                            <select
                                className="form-control"
                                onChange={handleInputChange}
                                name="invoiceStatus"
                                value={inputInvoice.invoiceStatus}
                            >
                                {listInvoiceStatus.map((status) => (
                                    <option
                                        key={status.key}
                                        value={status.value}
                                    >
                                        {status.value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div></div>
                        <button
                            style={{ textAlign: 'center' }}
                            type="submit"
                            className="mt-3 button col-4"
                        >
                            Cập nhập đơn hàng
                        </button>
                    </form>
                </div>
            </div>
            <div className="col-12">
                <InvoicesDetails
                    id={id}
                    listInvoicesDetail={listInvoicesDetail}
                />
            </div>
        </>
    );
}
