import { useEffect, useState } from 'react';
import { getAllInvoice } from '../../../Services/InvoiceService';
import usePagination from '../../../CustomHooks/usePagination';
import Tittle from '../../Fragments/Tittle';
import useAuth from '../../../CustomHooks/useAuth';
import { getAllInvoiceStatus } from '../../../Services/EnumService';

export default function Invoice() {
    const { listInvoices, setListInvoice } = useState([]);

    const { listInvoiceStatus, setListInvoiceStatus } = useState([]);

    const { listEmployees, setListEmployees } = useState([]);

    const [totalPages, setTotalPages] = useState(1);

    const [totalInvoices, setTotalInvoices] = useState();

    const [currentPage, setCurrentPage] = useState();

    const { searchParams } = usePagination();

    const [accountId, setAccountId] = useState(0);

    const { auth } = useAuth();

    useEffect(() => {
        fetchListInvoiceStatus();
        fetchGetAllInvoices();
        
        if (auth.account.role === 'ROLE_MANAGER') {
            fetchGetAllEmployee();
        }
    }, [searchParams, accountId]);


    const fetchListInvoiceStatus = async () => {
        await getAllInvoiceStatus()
            .then((res) => {
            setListEmployees(res.data)
        })
    }


    const fetchGetAllInvoices = async () => {
        await getAllInvoice(searchParams, accountId).then((res) => {
            setListInvoice(res.data.productsRes);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
            setTotalInvoices(res.data.totalInvoices);
        });
    };

    const fetchGetAllEmployee = async () => {
        await getAllInvoice().then((res) => {
            setListEmployees(res.data);
        });
    };
    return (
        <>
            <Tittle tittle="Danh sách đơn hàng" />

            <div className="mt-5 bg-white p-5 shadow border">
                <div className="col-2 mt-2 mb-2">
                    <span>Chọn nhân viên lên đơn</span>
                    <select
                        className="form-control"
                        onChange={setAccountId((e) => e.target)}
                    >
                        <option value="0">Tất cả</option>
                        <option value="-1">Chưa chia</option>
                        {listEmployees.map((empl) => (
                            <option key={empl.id} value={empl.id}>
                                {empl.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div class=" d-flex flex-wrap justify-content-start">
                    {}
                    <div
                        class="filter btn border-dark bg-dark text-white  text-white-hover text-dark m-3 btn col-2 d-flex align-items-center justify-content-around py-3"
                        id="-1"
                        th:data-filter-status="-1"
                    >
                        <i
                            th:data-filter-status="-1"
                            class=" fa-2xl fa-solid fa-file-invoice-dollar"
                        ></i>
                        Tất cả đơn hàng
                    </div>

                    <div
                        class="filter btn border-dark text-dark  m-3 btn col-2 d-flex align-items-center justify-content-around py-3"
                        id="0"
                        th:data-filter-status="0"
                    >
                        <i
                            th:data-filter-status="0"
                            class=" fa-2xl fa-solid fa-xmark"
                        ></i>
                        Đơn đã hủy
                    </div>

                    <div
                        class="filter btn border-dark text-dark m-3 btn col-2 d-flex align-items-center justify-content-around py-3"
                        id="1"
                        th:data-filter-status="1"
                    >
                        <i
                            th:data-filter-status="1"
                            class=" fa-2xl fa-solid fa-cart-plus"
                        ></i>
                        Đơn mới
                    </div>

                    <div
                        class="filter btn border-dark text-dark m-3 btn col-2 d-flex align-items-center justify-content-around py-3"
                        id="2"
                        th:data-filter-status="2"
                    >
                        <i
                            th:data-filter-status="2"
                            class=" fa-2xl fa-solid fa-hourglass-half"
                        ></i>
                        Đơn đang xử lý
                    </div>

                    <div
                        class="filter btn border-dark text-dark m-3 btn col-2 d-flex align-items-center justify-content-around py-3"
                        id="3"
                        th:data-filter-status="3"
                    >
                        <i
                            th:data-filter-status="3"
                            class=" fa-2xl fa-solid fa-check"
                        ></i>
                        Đã lên đơn
                    </div>

                    <div
                        class="filter btn border-dark text-dark m-3 btn col-2 d-flex align-items-center justify-content-around py-3"
                        id="4"
                        th:data-filter-status="4"
                    >
                        <i
                            th:data-filter-status="4"
                            class=" fa-2xl fa-solid fa-truck-fast"
                        ></i>
                        Đơn đang giao
                    </div>

                    <div
                        class="filter btn border-dark text-dark m-3 btn col-2 d-flex align-items-center justify-content-around py-3"
                        id="5"
                        th:data-filter-status="5"
                    >
                        <i
                            th:data-filter-status="5"
                            class=" fa-2xl fa-solid fa-circle-check"
                        ></i>
                        Đơn thành công
                    </div>

                    <div
                        class="filter btn border-dark text-dark m-3 btn col-2 d-flex align-items-center justify-content-around py-3"
                        id="6"
                        th:data-filter-status="6"
                    >
                        <i
                            th:data-filter-status="6"
                            class=" fa-2xl fa-solid fa-ban"
                        ></i>
                        Đơn hoàn
                    </div>
                </div>

                <div
                    id="list-invoice"
                    th:include="~{admin/component/ListInvoice::ListInvoice}"
                ></div>
            </div>
        </>
    );
}
