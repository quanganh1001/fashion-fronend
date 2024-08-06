import { useState, useEffect } from 'react';
import {
    getProductForAdminPage,
    updateProduct,
} from '../../../Services/ProductService';
import { toast } from 'react-toastify';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    deleteProductDetail,
    getAllProductsDetails,
} from '../../../Services/ProductDetailService';
import { Dropdown } from 'react-bootstrap';
import useModal from '../../../CustomHooks/useModal';
import { getImagesSize } from '../../../Services/EnumService';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import Title from '../../Fragments/Title';

export default function EditProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState({
        productCode: '',
        productName: '',
        price: '',
        discountPrice: '',
        brand: 'TORANO',
        description: '',
        imageChooseSize: '',
        isActivated: true,
    });

    const [listProductsDetails, setListProductsDetails] = useState([]);

    const navigator = useNavigate();
    const [codeError, setCodeError] = useState('');
    const [nameError, setNameError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [brandError, setBrandError] = useState('');
    const [imgSizeError, setImgSizeError] = useState('');
    const [discountPriceError, setDiscountPriceError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState(true);
    const [isLoadingProduct, setIsLoadingProduct] = useState(true);

    const [imgSizeOptions, setImgSizeOptions] = useState([]);

    const { openModal, closeModal } = useModal();

    useEffect(() => {
        fetchProduct();
        fetchProductDetail();
        fetchImgSize();
    }, []);

    const fetchImgSize = async () => {
        await getImagesSize()
            .then((res) => {
                setImgSizeOptions(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    const fetchProduct = async () => {
        await getProductForAdminPage(id)
            .then((res) => {
                setProduct({
                    productCode: res.data.productCode,
                    productName: res.data.productName,
                    price: res.data.price,
                    discountPrice: res.data.discountPrice,
                    brand: res.data.brand,
                    description: res.data.description,
                    imageChooseSize: res.data.imageChooseSize,
                    isActivated: res.data.isActivated,
                });
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoadingProduct(false);
            });
    };

    const fetchProductDetail = () => {
        setIsLoadingDetail(true);
        getAllProductsDetails(id)
            .then((res) => {
                setListProductsDetails(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoadingDetail(false);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const updateProductForm = (e) => {
        e.preventDefault();
        let isValid = true;

        if (product.productCode === '') {
            isValid = false;
            setCodeError('Mã sản phẩm không được để trống');
        } else {
            setCodeError('');
        }

        if (product.productName === '') {
            isValid = false;
            setNameError('Tên sản phẩm không được để trống');
        } else {
            setNameError('');
        }

        if (product.price === '') {
            isValid = false;
            setPriceError('Giá sản phẩm không được để trống');
        } else if (isNaN(product.price)) {
            isValid = false;
            setPriceError('Giá sản phẩm không hợp lệ');
        } else {
            setPriceError('');
        }

        if (product.discountPrice !== '' && isNaN(product.discountPrice)) {
            isValid = false;
            setDiscountPriceError('Giá sản phẩm không hợp lệ');
        } else {
            setDiscountPriceError('');
        }

        if (product.brand === '') {
            isValid = false;
            setBrandError('Thương hiệu không được để trống');
        } else {
            setBrandError('');
        }

        if (product.imageChooseSize === '') {
            isValid = false;
            setImgSizeError('Ảnh chọn size không được để trống');
        } else {
            setImgSizeError('');
        }

        if (isValid) {
            setIsLoading(true);
            updateProduct(id, product)
                .then(() => {
                    navigator('/admin/products');
                    toast.success('Lưu thành công!');
                })
                .catch((err) => {
                    console.error(err);
                    if (err.response.status === 409) {
                        setCodeError('Mã sản phẩm đã tồn tại');
                        toast.error('Mã sản phẩm đã tồn tại');
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const handleDelete = (id) => {
        openModal(
            'Xóa chi tiết sản phẩm',
            `Bạn có chắc muốn xóa chi tiết sản phẩm này?`,
            () => {
                setIsLoadingDetail(true);
                deleteProductDetail(id)
                    .then(() => {
                        toast.success('Xóa sản phẩm thành công!');
                        fetchProductDetail();
                    })
                    .catch((err) => {
                        toast.error('Xảy ra lỗi!');
                    })
                    .finally(() => {
                        setIsLoadingDetail(false);
                    });
                closeModal();
            }
        );
    };

    return (
        <>
            <Title title="Sửa sản phẩm" />

            <div className="mt-4 d-flex flex-wrap justify-content-between">
                <div className="mb-4 col-12">
                    <Link to={'/admin/products/' + id + '/images'}>
                        <button className="button">Quản lý ảnh sản phẩm</button>
                    </Link>
                </div>
                <div className=" col-6 bg-white p-5 shadow border">
                    {isLoadingProduct ? (
                        <LoadingSpinner />
                    ) : (
                        <form onSubmit={updateProductForm}>
                            <div className="row">
                                <div className="mb-3">
                                    <label className="form-label">
                                        Mã sản phẩm
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        id="productCode"
                                        name="productCode"
                                        value={product.productCode ?? ''}
                                        type="text"
                                        className={
                                            codeError !== ''
                                                ? 'border-danger form-control'
                                                : 'form-control'
                                        }
                                        onChange={handleInputChange}
                                    />
                                    <span className="text-danger">
                                        {codeError}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Tên sản phẩm
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        id="productName"
                                        type="text"
                                        name="productName"
                                        className={
                                            nameError !== ''
                                                ? 'border-danger form-control'
                                                : 'form-control'
                                        }
                                        value={product.productName ?? ''}
                                        onChange={handleInputChange}
                                    />
                                    <span className="text-danger">
                                        {nameError}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Giá tiền
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        id="price"
                                        type="text"
                                        className={
                                            priceError !== ''
                                                ? 'border-danger form-control'
                                                : 'form-control'
                                        }
                                        name="price"
                                        value={product.price}
                                        onChange={handleInputChange}
                                    />
                                    <span className="text-danger">
                                        {priceError}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Giá khuyến mãi
                                    </label>
                                    <input
                                        id="discountPrice"
                                        type="text"
                                        className={
                                            discountPriceError !== ''
                                                ? 'border-danger form-control'
                                                : 'form-control'
                                        }
                                        name="discountPrice"
                                        value={product.discountPrice ?? ''}
                                        onChange={handleInputChange}
                                    />
                                    <span className="text-danger">
                                        {discountPriceError}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Thương hiệu
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        id="brand"
                                        type="text"
                                        className={
                                            brandError !== ''
                                                ? 'border-danger form-control'
                                                : 'form-control'
                                        }
                                        value={product.brand ?? ''}
                                        name="brand"
                                        onChange={handleInputChange}
                                    />
                                    <span className="text-danger">
                                        {brandError}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Mô tả</label>
                                    <textarea
                                        id="description"
                                        className="form-control"
                                        rows="4"
                                        cols="50"
                                        name="description"
                                        value={product.description ?? ''}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Ảnh hướng dẫn chọn size
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <select
                                        id="imgSize"
                                        className={
                                            imgSizeError !== ''
                                                ? 'border-danger form-control'
                                                : 'form-control'
                                        }
                                        value={product.imageChooseSize ?? ''}
                                        name="imageChooseSize"
                                        onChange={handleInputChange}
                                    >
                                        <option value="">--Chọn size--</option>
                                        {imgSizeOptions.map((option) => (
                                            <option
                                                key={option.key}
                                                value={option.key}
                                            >
                                                {option.value}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="text-danger">
                                        {imgSizeError}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Trạng thái
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        className="form-check-input bg-dark border-dark mx-2"
                                        type="checkbox"
                                        name="isActivated"
                                        checked={product.isActivated ?? true}
                                        onChange={(e) =>
                                            setProduct({
                                                ...product,
                                                isActivated: e.target.checked,
                                            })
                                        }
                                    />
                                    {product.isActivated ? 'Kích hoạt' : 'Ẩn'}
                                </div>
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    id="submit"
                                    className="col-4 button text-align-center"
                                >
                                    Lưu lại
                                </button>
                                {isLoading && <LoadingSpinner />}
                            </div>
                        </form>
                    )}
                </div>

                <div className=" col-5 bg-white p-3 pt-5 shadow border">
                    <h3>Mã phân loại chi tiết sản phẩm</h3>
                    <div className="col my-4">
                        <Link to={`/admin/products/${id}/productDetail/add`}>
                            <button className="button">Thêm mã</button>
                        </Link>
                    </div>
                    {isLoadingDetail ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {listProductsDetails.length === 0 ? (
                                <div>Chưa có mã phân loại sản phẩm</div>
                            ) : null}
                            <div
                                className="overflow-auto border ps-3 pb-3 mt-3"
                                style={{ maxHeight: '700px' }}
                            >
                                {listProductsDetails.map((pd) => (
                                    <div
                                        key={pd.id}
                                        className="d-flex align-items-center mt-3"
                                    >
                                        <Dropdown
                                            data-bs-theme="dark"
                                            className="me-3"
                                        >
                                            <Dropdown.Toggle variant="dark bg-gradient btn-sm">
                                                Hành động
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item
                                                    as={Link}
                                                    to={`/admin/products/${id}/productDetail/edit/${pd.id}`}
                                                >
                                                    Xem/Sửa
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    onClick={() =>
                                                        handleDelete(pd.id)
                                                    }
                                                >
                                                    Xóa
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>

                                        <div>{pd.code}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
