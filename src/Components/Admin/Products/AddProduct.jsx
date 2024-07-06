import { useState, useEffect } from 'react';
import { getAllCategories } from '../../../Services/CategoryService';
import { createProduct } from '../../../Services/ProductService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getImagesSize } from '../../../Services/EnumService';
import Tittle from '../../Fragments/Tittle';
import LoadingSpinner from '../../Fragments/LoadingSpinner';

export default function AddProduct() {
    const [product, setProduct] = useState({
        productCode: '',
        productName: '',
        price: '',
        catId: '',
        discountPrice: '',
        brand: 'TORANO',
        description: '',
        imageChooseSize: '',
    });
    const navigator = useNavigate();
    const [codeError, setCodeError] = useState('');
    const [nameError, setNameError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [discountPriceError, setDiscountPriceError] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [brandError, setBrandError] = useState('');
    const [imgSizeError, setImgSizeError] = useState('');
    const [listCategories, setListCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [imgSizeOptions, setImgSizeOptions] = useState([]);

    useEffect(() => {
        fetchListCategories();
        fetchImgSize();
    }, []);

    const fetchImgSize =  () => {
         getImagesSize()
            .then((res) => {
                
                setImgSizeOptions(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchListCategories =  () => {
        try {
            const response =  getAllCategories();
            setListCategories(response.data);
        } catch (error) {
            console.error('Error fetching list categories:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const addProductForm =  (e) => {
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
        } else if (!product.price.match(/^[0-9]+$/)) {
            setPriceError('Giá sản phẩm không hợp lệ');
        } else {
            setPriceError('');
        }

        if (
            product.discountPrice !== '' &&
            !product.discountPrice.match(/^[0-9]+$/)
        ) {
            isValid = false;
            setDiscountPriceError('Giá sản phẩm không hợp lệ');
        } else {
            setDiscountPriceError('');
        }

        if (product.catId === '') {
            isValid = false;
            setCategoryError('Danh mục không được để trống');
        } else {
            setCategoryError('');
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
            try {
                
                 createProduct(product);
                navigator('/admin/products');
                toast.success('Thêm mới thành công');
            } catch (error) {
                if (error.response.status === 409) {
                    setCodeError('Mã sản phẩm đã tồn tại');
                    toast.error('Mã sản phẩm đã tồn tại');
                }
            } finally {
                 setIsLoading(false);
            }
        }
    };

    return (
        <>
            <Tittle tittle="Thêm mới sản phẩm" />
            <div className="mt-5 bg-white p-5 shadow border">
                <form onSubmit={addProductForm}>
                    <div className="row">
                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Mã sản phẩm
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                id="productCode"
                                name="productCode"
                                value={product.productCode}
                                type="text"
                                className={
                                    codeError !== ''
                                        ? 'border-danger form-control'
                                        : 'form-control'
                                }
                                onChange={handleInputChange}
                            />
                            <span className="text-danger">{codeError}</span>
                        </div>

                        <div className="mb-3 col-6">
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
                                value={product.productName}
                                onChange={handleInputChange}
                            />
                            <span className="text-danger">{nameError}</span>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Giá tiền<span style={{ color: 'red' }}>*</span>
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
                            <span className="text-danger">{priceError}</span>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Danh mục sản phẩm
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <select
                                id="category"
                                className={
                                    categoryError !== ''
                                        ? 'border-danger form-control'
                                        : 'form-control'
                                }
                                value={product.catId}
                                name="catId"
                                onChange={handleInputChange}
                            >
                                <option value="">--Chọn danh mục--</option>
                                {listCategories.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.categoryCode} - {option.catName}
                                    </option>
                                ))}
                            </select>
                            <span className="text-danger">{categoryError}</span>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">Giá khuyến mãi</label>
                            <input
                                id="discountPrice"
                                type="text"
                                className={
                                    discountPriceError !== ''
                                        ? 'border-danger form-control'
                                        : 'form-control'
                                }
                                name="discountPrice"
                                value={product.discountPrice}
                                onChange={handleInputChange}
                            />
                            <span className="text-danger">
                                {discountPriceError}
                            </span>
                        </div>

                        <div className="mb-3 col-6">
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
                                value={product.brand}
                                name="brand"
                                onChange={handleInputChange}
                            />
                            <span className="text-danger">{brandError}</span>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mô tả</label>
                            <textarea
                                id="description"
                                className="form-control"
                                rows="4"
                                cols="50"
                                name="description"
                                value={product.description}
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
                                value={product.imageChooseSize}
                                name="imageChooseSize"
                                onChange={handleInputChange}
                            >
                                <option value="">--Chọn size--</option>
                                {imgSizeOptions.map((option) => (
                                    <option key={option.key} value={option.key}>
                                        {option.value}
                                    </option>
                                ))}
                            </select>
                            <span className="text-danger">{imgSizeError}</span>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            id="submit"
                            className="col-2 button text-align-center"
                        >
                            Thêm sản phẩm
                        </button>
                        {isLoading && <LoadingSpinner />}
                    </div>
                </form>
            </div>
        </>
    );
}
