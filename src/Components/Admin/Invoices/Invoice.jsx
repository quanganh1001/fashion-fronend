import { useEffect, useState } from 'react';
import { getAllInvoice } from '../../../Services/InvoiceService';
import usePagination from '../../../CustomHooks/usePagination';
import Tittle from '../../Fragments/Tittle';
import useAuth from '../../../CustomHooks/useAuth';
import { getAllInvoiceStatus } from '../../../Services/EnumService';
import { getAllEmployees } from '../../../Services/AccountService';
import CustomPagination from '../../Fragments/CustomPagination';
import SearchForm from '../../Fragments/SearchForm';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { parseISO, format } from 'date-fns';


export default function Invoice() {
    const [listInvoice, setListInvoice] = useState([]);

    const [invoiceStatus, setInvoiceStatus] = useState(null);

    const [listEmployees, setListEmployees] = useState([]);

    const [totalPages, setTotalPages] = useState(1);

    const [totalInvoices, setTotalInvoices] = useState();

    const [currentPage, setCurrentPage] = useState();

    const { searchParams, setPage } = usePagination();

    const [accountId, setAccountId] = useState(0);

    const { auth } = useAuth();


    useEffect(() => {
        fetchGetAllInvoices();
        if (auth.account.role === 'ROLE_MANAGER') {
            fetchGetAllEmployee();
      }
     
    }, [searchParams, accountId, invoiceStatus, auth.account.role]);



  const fetchGetAllInvoices = async () => {
    await getAllInvoice(searchParams, accountId, invoiceStatus).then((res) => {
        
            setListInvoice(res.data.invoices);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
            setTotalInvoices(res.data.totalInvoices);
        })
          .catch((err) => {
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

  const handleAccountIdChange = (e) => {
    setPage(1);
        const selectedValue = e.target.value === 'null' ? null : e.target.value;
        setAccountId(selectedValue);
  };

  const handleSelectInvoiceStatus = (value) => {
    setPage(1);
    setInvoiceStatus(value)
  };
  

    return (
        <>
            <Tittle tittle="Danh sách đơn hàng" />
            <div className="mt-5 bg-white p-5 shadow border">
                <Link>
                    <button className="button">Tạo đơn hàng</button>
                </Link>

                <div className="mt-5  d-flex flex-wrap justify-content-start">
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

                    <div
                        onClick={() => handleSelectInvoiceStatus('CANCEL')}
                        className={
                            invoiceStatus === 'CANCEL'
                                ? 'button m-3 col-2 d-flex align-items-center justify-content-around py-3'
                                : 'button-non-active m-3 col-2 d-flex align-items-center justify-content-around py-3'
                        }
                    >
                        Đơn đã hủy
                    </div>

                    <div
                        onClick={() => handleSelectInvoiceStatus('NEW')}
                        className={
                            invoiceStatus === 'NEW'
                                ? 'button m-3 col-2 d-flex align-items-center justify-content-around py-3'
                                : 'button-non-active m-3 col-2 d-flex align-items-center justify-content-around py-3'
                        }
                    >
                        Đơn mới
                    </div>

                    <div
                        onClick={() => handleSelectInvoiceStatus('PROCESS')}
                        className={
                            invoiceStatus === 'PROCESS'
                                ? 'button m-3 col-2 d-flex align-items-center justify-content-around py-3'
                                : 'button-non-active m-3 col-2 d-flex align-items-center justify-content-around py-3'
                        }
                    >
                        Đơn đang xử lý
                    </div>

                    <div
                        onClick={() =>
                            handleSelectInvoiceStatus('ORDER_CREATED')
                        }
                        className={
                            invoiceStatus === 'ORDER_CREATED'
                                ? 'button m-3 col-2 d-flex align-items-center justify-content-around py-3'
                                : 'button-non-active m-3 col-2 d-flex align-items-center justify-content-around py-3'
                        }
                    >
                        Đã lên đơn
                    </div>

                    <div
                        onClick={() => handleSelectInvoiceStatus('DELIVERING')}
                        className={
                            invoiceStatus === 'DELIVERING'
                                ? 'button m-3 col-2 d-flex align-items-center justify-content-around py-3'
                                : 'button-non-active m-3 col-2 d-flex align-items-center justify-content-around py-3'
                        }
                    >
                        Đơn đang giao
                    </div>

                    <div
                        onClick={() => handleSelectInvoiceStatus('SUCCESS')}
                        className={
                            invoiceStatus === 'SUCCESS'
                                ? 'button m-3 col-2 d-flex align-items-center justify-content-around py-3'
                                : 'button-non-active m-3 col-2 d-flex align-items-center justify-content-around py-3'
                        }
                    >
                        Đơn thành công
                    </div>

                    <div
                        onClick={() => handleSelectInvoiceStatus('RETURN')}
                        className={
                            invoiceStatus === 'RETURN'
                                ? 'button m-3 col-2 d-flex align-items-center justify-content-around py-3'
                                : 'button-non-active m-3 col-2 d-flex align-items-center justify-content-around py-3'
                        }
                    >
                        Đơn hoàn
                    </div>
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
                                    <Dropdown data-bs-theme="dark">
                                        <Dropdown.Toggle variant="dark bg-gradient btn-sm">
                                            Hành động
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                as={Link}
                                                to={`/admin/invoices/${invoice.id}/invoicesDetail`}
                                            >
                                                Xem/Sửa
                                            </Dropdown.Item>
                                            <Dropdown.Item>Xóa</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <CustomPagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        totalItems={totalInvoices}
                    />
                </div>
            </div>
        </>
    );
}
