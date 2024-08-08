import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { DateRangePicker } from 'react-bootstrap-daterangepicker';
import Title from '../Fragments/Title';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { getTopProduct } from '../../Services/ProductService';

const HomeAdmin = () => {
    const [startDate, setStartDate] = useState(
        moment().subtract(365, 'days').startOf('day')
    );
    const [endDate, setEndDate] = useState(moment().endOf('day'));
    const [listTopProducts, setListTopProducts] = useState([]);
    useEffect(() => {
        fetchProductTop();
    }, [startDate, endDate]);

    const fetchProductTop = () => {
        getTopProduct(startDate, endDate)
            .then((res) => {
                setListTopProducts(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleCallback = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    const handleApply = (event, picker) => {
        handleCallback(picker.startDate, picker.endDate);
    };

    return (
        <>
            <Title title="Trang chủ" />

            <div className="col-5 mt-5">
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
                                    startDate: startDate,
                                    endDate: endDate,
                                    locale: {
                                        format: 'DD/M/YYYY',
                                    },
                                }}
                                onApply={handleApply}
                            >
                                <input type="text" className="form-control" />
                            </DateRangePicker>
                        </div>

                        <div className="card">
                            <div className="card-body table-responsive p-0">
                                <table className="table  table-striped">
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
                                                        {product.productName}
                                                    </td>
                                                    <td>{product.colorName}</td>
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
                                                                currency: 'VND',
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
        </>
    );
};

export default HomeAdmin;
