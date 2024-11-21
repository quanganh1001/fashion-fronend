import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import CustomPagination from '../../Fragments/CustomPagination';
import usePagination from '../../../CustomHooks/usePagination';
import SearchForm from '../../Fragments/SearchForm';
import {
    deleteProduct,
    getAllProducts,
} from '../../../Services/ProductService';
import useModal from '../../../CustomHooks/useModal';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import Title from '../../Fragments/Title';

export default function ProductAdmin() {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState();
    const [currentPage, setCurrentPage] = useState();
    const { searchParams } = usePagination();
    const { openModal, closeModal } = useModal();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
        setIsLoading(true);
    }, [searchParams]);

    const fetchProducts = () => {
        setIsLoading(true);
        getAllProducts(searchParams)
            .then((response) => {
                setProducts(response.data.productsRes);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.currentPage);
                setTotalItems(response.data.totalItems);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleDelete = (productId) => {
        openModal('Xóa sản phẩm', `Bạn có chắc muốn xóa sản phẩm này?`, () => {
            setIsLoading(true);
            deleteProduct(productId)
                .then(() => {
                    toast.success('Xóa sản phẩm thành công!');
                    fetchProducts();
                })
                .catch((err) => {
                    toast.error('"Không thể xóa sản phẩm này"');
                    setIsLoading(false);
                })
               
            closeModal();
        });
    };

    return (
        <>
            <Title title="Sản phẩm" />

            <div className="d-flex flex-wrap my-5 justify-content-between align-items-center">
                <div className="col">
                    <Link to="/admin/products/add">
                        <button className="button">Thêm sản phẩm</button>
                    </Link>
                </div>

                <div className="col-5">
                    <SearchForm
                        placeholder={'Nhập tên sản phẩm hoặc mã sản phẩm'}
                    />
                </div>
            </div>

            <table className="table table-striped table-hover table-bordered border">
                <thead>
                    <tr>
                        <th>Mã sản phẩm</th>
                        <th>Tên sản phâm</th>
                        <th>Danh mục</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                         <LoadingSpinner/>
                    ) : (
                        <>
                            {products.map((p) => (
                                <tr key={p.id} className="align-middle">
                                    <td>{p.productCode}</td>
                                    <td>{p.productName}</td>
                                    <td>{p.catName}</td>
                                    <td>
                                        {p.isActivated ? 'Kích hoạt' : 'Ẩn'}
                                    </td>
                                    <td>
                                        <Dropdown data-bs-theme="dark">
                                            <Dropdown.Toggle variant="dark bg-gradient btn-sm">
                                                Hành động
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item
                                                    as={Link}
                                                    to={`/admin/products/${p.id}/edit`}
                                                >
                                                    Xem/Sửa
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    onClick={() =>
                                                        handleDelete(p.id)
                                                    }
                                                >
                                                    Xóa
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
        </>
    );
}
