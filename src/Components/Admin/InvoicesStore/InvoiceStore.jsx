import { useEffect, useState } from 'react';
import {
    getAllInvoiceAtStore,
} from '../../../Services/InvoiceService';
import usePagination from '../../../CustomHooks/usePagination';
import CustomPagination from '../../Fragments/CustomPagination';
import SearchForm from '../../Fragments/SearchForm';
import { parseISO, format } from 'date-fns';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import Title from '../../Fragments/Title';
import { getAllStores } from '../../../Services/StoreService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export default function InvoiceStore() {
    const [listInvoice, setListInvoice] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState();
    const [currentPage, setCurrentPage] = useState();
    const { searchParams, setPage } = usePagination();
    const [isLoading, setIsLoading] = useState(true);
    const [store, setStore] = useState("0");
    const [listStore, setListStore] = useState([]);

    useEffect(() => {
        fetchGetAllStores();
    }, [])
    
    useEffect(() => {
        fetchGetAllInvoices();
        setIsLoading(true);
    }, [searchParams,store]);
    
    const fetchGetAllStores = () => {
        getAllStores()
            .then((res) => {
                setListStore(res.data)
            })
            .catch((error) => {
                console.error(error);
            })
    }

    const fetchGetAllInvoices = () => {
        getAllInvoiceAtStore(searchParams, store)
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

    const handleStoreIdChange = (e) => {
        setPage(1);
        const selectedValue = e.target.value;
        setStore(selectedValue);
    };

    
    return (
        <>
            <Title title="Danh sách đơn hàng bán tại cửa hàng" />
            <div className="mt-5 bg-white p-5 shadow border">
                <Link to="/admin/invoices/store/create">
                    <button className="button">Tạo đơn hàng</button>
                </Link>

                <div className=" mt-5 d-flex flex-wrap justify-content-between align-items-center">
                    <div className="col-2">
                        <span>Chọn cửa hàng</span>
                        <select
                            className="form-control mt-1"
                            onChange={handleStoreIdChange}
                        >
                            <option value="0">Tất cả</option>
                            {listStore.map((store) => (
                                <option key={store.id} value={store.id}>
                                    {store.name}
                                </option>
                            ))}
                        </select>
                    </div>

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
                                <th>Tên cửa hàng</th>
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
                                            <td>{invoice.store}</td>
                                            <td>
                                                {format(
                                                    parseISO(invoice.createdAt),
                                                    'HH:mm:ss - d/M/yyyy'
                                                )}
                                            </td>
                                            <td className=" ">
                                                <Link
                                                    to={
                                                        `/admin/invoices/store/detail/${invoice.id}`
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        className="button-non-active"
                                                        icon="fa-regular fa-eye"
                                                    />
                                                </Link>
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
