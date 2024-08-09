import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-bootstrap-daterangepicker';
import Title from '../Fragments/Title';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { getSalesSent, getSalesSuccess, getTopProduct } from '../../Services/StoredService';

const HomeAdmin = () => {
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
        totalInvoices: 0
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

    useEffect(() => {
        fetchProductTop();
    }, [startDateTopProduct, endDateTopProduct]);

    useEffect(() => {
        fetchSalesSent();
    }, [startDateSalesSent, endDateSalesSent]);

    useEffect(() => {
        fetchSalesSuccess();
    }, [startDateSalesSuccess, endDateSalesSuccess]);

    const fetchSalesSent = () => {
        getSalesSent(startDateSalesSent, endDateSalesSent)
            .then((res) => {
                setSalesSent({
                    totalSales: res.data.totalSales ?? 0,
                    totalInvoices: res.data.totalInvoices ?? 0,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const fetchSalesSuccess = () => {
        getSalesSuccess(startDateSalesSuccess, endDateSalesSuccess)
            .then((res) => {
                setSalesSuccess({
                    totalSales: res.data.totalSales ?? 0,
                    totalInvoices: res.data.totalInvoices ?? 0,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };


    const fetchProductTop = () => {
        getTopProduct(startDateTopProduct, endDateTopProduct)
            .then((res) => {
                setListTopProducts(res.data);
            })
            .catch((error) => {
                console.error(error);
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
                                <h4 className="card-title ">Doanh số đã gửi</h4>
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
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-hover table-bordered border">
                                        <thead>
                                            <tr>
                                                <th>Số đơn</th>
                                                <th>Doanh số</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    {salesSent.totalInvoices}
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
                                                        : 'N/A'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-5">
                        <div className="card-header border-0 bg-success-subtle bg-gradient">
                            <div className="d-flex justify-content-between">
                                <h4 className="card-title ">Doanh số thành công</h4>
                            </div>
                        </div>
                        <div className="card-body bg-light">
                            <div className="col-6 mb-5">
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

                            <div className="card">
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-hover table-bordered border">
                                        <thead>
                                            <tr>
                                                <th>Số đơn</th>
                                                <th>Doanh số</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    {salesSuccess.totalInvoices}
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
                                                        : 'N/A'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-6">
                    <div className="card">
                        <div className="card-header border-0">
                            <div className="d-flex justify-content-between">
                                <h3 className="card-title">
                                    Top sản phẩm bán chạy
                                </h3>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="col-6 mb-5">
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

                            <div className="card">
                                <div className="card-body table-responsive p-0">
                                    <table className="table table-striped table-hover table-bordered border">
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
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            {
                                                                product.productName
                                                            }
                                                        </td>
                                                        <td>
                                                            {product.colorName}
                                                        </td>
                                                        <td>{product.size}</td>
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
