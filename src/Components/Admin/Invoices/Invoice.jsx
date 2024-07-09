import { useEffect, useState } from 'react';
import {
    getAllInvoice,
    updateStatusInvoice,
} from '../../../Services/InvoiceService';
import usePagination from '../../../CustomHooks/usePagination';
import useAuth from '../../../CustomHooks/useAuth';
import { getAllInvoiceStatus } from '../../../Services/EnumService';
import { getAllEmployees } from '../../../Services/AccountService';
import CustomPagination from '../../Fragments/CustomPagination';
import SearchForm from '../../Fragments/SearchForm';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { parseISO, format } from 'date-fns';
import useModal from '../../../CustomHooks/useModal';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import Title from '../../Fragments/Title';

export default function Invoice() {
    const [listInvoice, setListInvoice] = useState([]);
    const [invoiceStatus, setInvoiceStatus] = useState(null);
    const [listInvoiceStatus, setListInvoiceStatus] = useState([]);
    const [listEmployees, setListEmployees] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState();
    const [currentPage, setCurrentPage] = useState();
    const { searchParams, setPage } = usePagination();
    const [accountId, setAccountId] = useState(0);
    const [invoiceId, setInvoiceId] = useState('');
    const { auth } = useAuth();
    const { openModal, closeModal } = useModal();
    const [newStatus, setNewStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);

    useEffect(() => {
        fetchGetAllInvoicesStatus();
        fetchGetAllInvoices();
        if (auth.account.role === 'ROLE_MANAGER') {
            fetchGetAllEmployee();
        }
        setIsLoading(true);
    }, [searchParams, accountId, invoiceStatus, auth.account.role]);

    useEffect(() => {
        if (newStatus !== '') {
            openModal(
                'Đổi trạng thái',
                <>
                    <select
                        className="form-control"
                        name="statusInvoice"
                        value={newStatus}
                        onChange={(e) => {
                            setNewStatus(e.target.value);
                        }}
                    >
                        {listInvoiceStatus.map((status) => (
                            <option key={status.key} value={status.value}>
                                {status.value}
                            </option>
                        ))}
                    </select>
                </>,
                () => {
                    setIsLoading(true);
                    updateStatusInvoice(invoiceId, newStatus)
                        .then(() => {
                            toast.success('Cập nhật trạng thái thành công!');
                            fetchGetAllInvoices();
                        })
                        .catch((err) => {
                            console.error(err);
                            toast.error(err.response.data);
                        })
                        .finally(() => {
                            setIsLoading(false);
                        });

                    closeModal();
                }
            );
        }
        setNewStatus('');
    }, [invoiceId, newStatus]);

    const fetchGetAllInvoicesStatus = () => {
        getAllInvoiceStatus()
            .then((res) => {
                setListInvoiceStatus(res.data);
            })

            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoadingStatus(false);
            });
    };

    const fetchGetAllInvoices = () => {
        getAllInvoice(searchParams, accountId, invoiceStatus)
            .then((res) => {
                setListInvoice(res.data.invoices);
                setTotalPages(res.data.totalPages);
                setCurrentPage(res.data.currentPage);
                setTotalItems(res.data.totalItems);
            })

            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const fetchGetAllEmployee = () => {
        setIsLoading(true);
        getAllEmployees()
            .then((res) => {
                setListEmployees(res.data);
            })

            .catch((err) => {
                console.error(err);
            });
    };

    const handleAccountIdChange = (e) => {
        setPage(1);
        const selectedValue = e.target.value === 'null' ? null : e.target.value;
        setAccountId(selectedValue);
    };

    const handleSelectInvoiceStatus = (value) => {
        setPage(1);
        setInvoiceStatus(value);
    };

    const handleShowModalStatus = (id, status) => {
        setInvoiceId(id);
        setNewStatus(status);
    };
    return (
        <>
            <Title title="Danh sách đơn hàng" />
            <div className="mt-5 bg-white p-5 shadow border">
                <div className="mt-5 d-flex flex-wrap justify-content-start">
                    {isLoadingStatus ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div
                                onClick={() => handleSelectInvoiceStatus(null)}
                                className={
                                    invoiceStatus == null
                                        ? 'button m-3 col-2 d-flex align-items-center justify-content-around py-3'
                                        : 'button-non-active m-3 col-2 d-flex align-items-center justify-content-around py-3'
                                }
                            >
                                Tất cả đơn hàng
                            </div>
                            {listInvoiceStatus.map((status) => (
                                <div
                                    key={status.key}
                                    onClick={() =>
                                        handleSelectInvoiceStatus(status.key)
                                    }
                                    className={
                                        invoiceStatus === status.key
                                            ? 'button m-3 col-2 d-flex align-items-center justify-content-around py-3'
                                            : 'button-non-active m-3 col-2 d-flex align-items-center justify-content-around py-3'
                                    }
                                >
                                    {status.value}
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <div className=" mt-5 d-flex flex-wrap justify-content-between align-items-center">
                    {auth.account.role === 'ROLE_MANAGER' ? (
                        <div className="col-2">
                            <span>Lọc nhân viên</span>
                            <select
                                className="form-control mt-1"
                                onChange={handleAccountIdChange}
                            >
                                <option value="0">Tất cả</option>
                                <option value="null">Chưa chia</option>
                                {listEmployees.map((empl) => (
                                    <option key={empl.id} value={empl.id}>
                                        {empl.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : null}
                    <div className="col-5">
                        <SearchForm placeholder="Nhập mã đơn hàng hoặc số điện thoại" />
                    </div>
                </div>
                <div className="mt-5">
                    <table className="mt-5 table table-striped table-hover table-bordered border">
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Tên khách hàng</th>
                                <th>Số điện thoại</th>
                                <th>Trạng thái</th>
                                <th>Nhân viên phụ trách</th>
                                <th>Ngày đặt hàng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    {listInvoice.map((invoice) => (
                                        <tr key={invoice.id}>
                                            <td>{invoice.invoiceCode}</td>
                                            <td>{invoice.name}</td>
                                            <td>{invoice.phone}</td>
                                            <td>{invoice.invoiceStatus}</td>
                                            <td>{invoice.accountName}</td>
                                            <td>
                                                {format(
                                                    parseISO(invoice.createdAt),
                                                    'HH:mm:ss - d/M/yyyy'
                                                )}
                                            </td>
                                            <td className=" ">
                                                <Dropdown
                                                    data-bs-theme="dark"
                                                    className=" position-relative"
                                                >
                                                    <Dropdown.Toggle variant="dark bg-gradient btn-sm">
                                                        Hành động
                                                        {invoice.isPaid && (
                                                            <img
                                                                className=" position-absolute translate-middle-y start-100 top-50"
                                                                src={
                                                                    process.env
                                                                        .PUBLIC_URL +
                                                                    '/vn-11134201-23030-b580c684i4nv82.png.png'
                                                                }
                                                                style={{
                                                                    width: '100px',
                                                                }}
                                                                alt=""
                                                            />
                                                        )}
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            as={Link}
                                                            to={`/admin/invoices/${invoice.id}/invoicesDetail`}
                                                        >
                                                            Xem/Sửa
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            onClick={() =>
                                                                handleShowModalStatus(
                                                                    invoice.id,
                                                                    invoice.invoiceStatus
                                                                )
                                                            }
                                                        >
                                                            Đổi trạng thái
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>

                    <CustomPagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        totalItems={totalItems}
                    />
                </div>
            </div>
        </>
    );
}
