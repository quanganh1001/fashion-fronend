import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-bootstrap-daterangepicker';
import Title from '../Fragments/Title';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import {
    getSalesSent,
    getSalesSuccess,
    getTopProduct,
} from '../../Services/StoredService';
import { getAllStores } from '../../Services/StoreService';
import LoadingSpinner from '../Fragments/LoadingSpinner';

const HomeAdmin = () => {
    const [isLoadingTopProduct, setIsLoadingTopProduct] = useState(false);
    const [isLoadingSalesSend, setIsLoadingSalesSend] = useState(false);
    const [isLoadingSalesSuccess, setIsLoadingSalesSuccess] = useState(false);
    const [startDateTopProduct, setStartDateTopProduct] = useState(
        moment().subtract(365, 'days').startOf('day')
    );
    const [endDateTopProduct, setEndDateTopProduct] = useState(
        moment().endOf('day')
    );
    const [listTopProducts, setListTopProducts] = useState([]);

    const [startDateSalesSent, setStartDateSalesSent] = useState(
        moment().subtract(365, 'days').startOf('day')
    );
    const [endDateSalesSent, setEndDateSalesSent] = useState(
        moment().endOf('day')
    );
    const [salesSent, setSalesSent] = useState({
        totalSales: 0,
        totalInvoices: 0,
    });

    const [startDateSalesSuccess, setStartDateSalesSuccess] = useState(
        moment().subtract(365, 'days').startOf('day')
    );
    const [endDateSalesSuccess, setEndDateSalesSuccess] = useState(
        moment().endOf('day')
    );
    const [salesSuccess, setSalesSuccess] = useState({
        totalSales: 0,
        totalInvoices: 0,
    });
    const [selectTopProductAtStore, setSelectTopProductAtStore] = useState(0);
    const [selectSalesSuccessAtStore, setSelectSalesSuccessAtStore] =
        useState(0);
    const [listStore, setListStore] = useState([]);

    useEffect(() => {
        fetchListStore();
    }, []);

    useEffect(() => {
        fetchProductTop();
    }, [startDateTopProduct, endDateTopProduct, selectTopProductAtStore]);

    useEffect(() => {
        fetchSalesSent();
    }, [startDateSalesSent, endDateSalesSent]);

    useEffect(() => {
        fetchSalesSuccess();
    }, [startDateSalesSuccess, endDateSalesSuccess, selectSalesSuccessAtStore]);

    const fetchListStore = () => {
        getAllStores()
            .then((res) => {
                setListStore(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchSalesSent = () => {
        setIsLoadingSalesSend(true);
        getSalesSent(startDateSalesSent, endDateSalesSent)
            .then((res) => {
                setSalesSent({
                    totalSales: res.data.totalSales ?? 0,
                    totalInvoices: res.data.totalInvoices ?? 0,
                });
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoadingSalesSend(false);
            });
    };

    const fetchSalesSuccess = () => {
        setIsLoadingSalesSuccess(true);
        getSalesSuccess(
            startDateSalesSuccess,
            endDateSalesSuccess,
            selectSalesSuccessAtStore
        )
            .then((res) => {
                setSalesSuccess({
                    totalSales: res.data.totalSales ?? 0,
                    totalInvoices: res.data.totalInvoices ?? 0,
                });
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoadingSalesSuccess(false);
            });
    };

    const fetchProductTop = () => {
        setIsLoadingTopProduct(true)
        getTopProduct(
            startDateTopProduct,
            endDateTopProduct,
            selectTopProductAtStore
        )
            .then((res) => {
                setListTopProducts(res.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoadingTopProduct(false);
            });
    };

    const handleCallbackTopProduct = (start, end) => {
        setStartDateTopProduct(start);
        setEndDateTopProduct(end);
    };

    const handleApplyTopProduct = (event, picker) => {
        handleCallbackTopProduct(picker.startDate, picker.endDate);
    };

    const handleCallbackSalesSent = (start, end) => {
        setStartDateSalesSent(start);
        setEndDateSalesSent(end);
    };

    const handleApplySalesSent = (event, picker) => {
        handleCallbackSalesSent(picker.startDate, picker.endDate);
    };

    const handleCallbackSalesSuccess = (start, end) => {
        setStartDateSalesSuccess(start);
        setEndDateSalesSuccess(end);
    };

    const handleApplySalesSuccess = (event, picker) => {
        handleCallbackSalesSuccess(picker.startDate, picker.endDate);
    };

    return (
        <>
            <Title title="Trang chủ" />
            <div className="d-flex flex-wrap mt-5 justify-content-between">
                <div className="col-5">
                    <div className="card">
                        <div className="card-header border-0 bg-warning-subtle bg-gradient">
                            <div className="d-flex justify-content-between">
                                <h4 className="card-title ">
                                    Doanh số bán online đã gửi
                                </h4>
                            </div>
                        </div>
                        <div className="card-body bg-light">
                            <div className="col-6 mb-5">
                                <DateRangePicker
                                    initialSettings={{
                                        startDate: startDateSalesSent,
                                        endDate: endDateSalesSent,
                                        locale: {
                                            format: 'DD/M/YYYY',
                                        },
                                    }}
                                    onApply={handleApplySalesSent}
                                >
                                    <input
                                        type="text"
                                        className="form-control"
                                    />
                                </DateRangePicker>
                            </div>

                            <div className="card">
                                <div className="card-body table-responsive">
                                    <table className="table table-hover table-bordered border">
                                        {isLoadingSalesSend ? (
                                            <LoadingSpinner />
                                        ) : (
                                            <>
                                                <thead>
                                                    <tr>
                                                        <th>Số đơn</th>
                                                        <th>Doanh số</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            {
                                                                salesSent.totalInvoices
                                                            }
                                                        </td>
                                                        <td>
                                                            {salesSent.totalSales
                                                                ? salesSent.totalSales.toLocaleString(
                                                                      'vi-VN',
                                                                      {
                                                                          style: 'currency',
                                                                          currency:
                                                                              'VND',
                                                                      }
                                                                  )
                                                                : 0}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </>
                                        )}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-5">
                        <div className="card-header border-0 bg-success-subtle bg-gradient">
                            <div className="d-flex justify-content-between">
                                <h4 className="card-title ">
                                    Doanh số đã bán thành công
                                </h4>
                            </div>
                        </div>
                        <div className="card-body bg-light">
                            <div className="mb-5 d-flex flex-wrap justify-content-between">
                                <div className="col-5">
                                    <DateRangePicker
                                        initialSettings={{
                                            startDate: startDateSalesSuccess,
                                            endDate: endDateSalesSuccess,
                                            locale: {
                                                format: 'DD/M/YYYY',
                                            },
                                        }}
                                        onApply={handleApplySalesSuccess}
                                    >
                                        <input
                                            type="text"
                                            className="form-control"
                                        />
                                    </DateRangePicker>
                                </div>

                                <div className="col-5">
                                    <select
                                        className="form-control "
                                        onChange={(e) =>
                                            setSelectSalesSuccessAtStore(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="0">Tất cả</option>
                                        <option value="">Bán online</option>
                                        {listStore.map((store) => (
                                            <option
                                                key={store.id}
                                                value={store.id}
                                            >
                                                {store.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body table-responsive">
                                    <table className="table table-hover table-bordered border">
                                        {isLoadingSalesSuccess ? (
                                            <LoadingSpinner />
                                        ) : (
                                            <>
                                                <thead>
                                                    <tr>
                                                        <th>Số đơn</th>
                                                        <th>Doanh số</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            {
                                                                salesSuccess.totalInvoices
                                                            }
                                                        </td>
                                                        <td>
                                                            {salesSuccess.totalSales
                                                                ? salesSuccess.totalSales.toLocaleString(
                                                                      'vi-VN',
                                                                      {
                                                                          style: 'currency',
                                                                          currency:
                                                                              'VND',
                                                                      }
                                                                  )
                                                                : 0}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </>
                                        )}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-6">
                    <div className="card bg-light">
                        <div className="card-header border-0">
                            <div className="d-flex justify-content-between">
                                <h3 className="card-title">
                                    Top sản phẩm bán chạy
                                </h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="mb-5 d-flex flex-wrap justify-content-between">
                                <div className="col-5">
                                    <DateRangePicker
                                        initialSettings={{
                                            startDate: startDateTopProduct,
                                            endDate: endDateTopProduct,
                                            locale: {
                                                format: 'DD/M/YYYY',
                                            },
                                        }}
                                        onApply={handleApplyTopProduct}
                                    >
                                        <input
                                            type="text"
                                            className="form-control"
                                        />
                                    </DateRangePicker>
                                </div>

                                <div className="col-5">
                                    <select
                                        className="form-control "
                                        onChange={(e) =>
                                            setSelectTopProductAtStore(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="0">Tất cả</option>
                                        <option value="">Bán online</option>
                                        {listStore.map((store) => (
                                            <option
                                                key={store.id}
                                                value={store.id}
                                            >
                                                {store.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-striped table-hover table-bordered border">
                                        {isLoadingTopProduct ? (
                                            <LoadingSpinner />
                                        ) : (
                                            <>
                                                <thead>
                                                    <tr>
                                                        <th>STT</th>
                                                        <th>Product</th>
                                                        <th>Màu</th>
                                                        <th>Size</th>
                                                        <th>Số lượng</th>
                                                        <th>Doanh số</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {listTopProducts.map(
                                                        (product, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    {index + 1}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        product.productName
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        product.colorName
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        product.size
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        product.totalQuantitySold
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {product.totalSales.toLocaleString(
                                                                        'vi-VN',
                                                                        {
                                                                            style: 'currency',
                                                                            currency:
                                                                                'VND',
                                                                        }
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </>
                                        )}
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeAdmin;
