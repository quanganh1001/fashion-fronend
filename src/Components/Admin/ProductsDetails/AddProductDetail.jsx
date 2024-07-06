import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSize } from '../../../Services/EnumService';
import { addProductDetail } from '../../../Services/ProductDetailService';
import { toast } from 'react-toastify';
import { getAllColors } from '../../../Services/ColorService';
import LoadingSpinner from '../../Fragments/LoadingSpinner';

export default function AddProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listSize, setListSize] = useState([]);
    const [listColor, setListColor] = useState([]);
    const [sizeError, setSizeError] = useState('');
    const [codeError, setCodeError] = useState('');
    const [colorError, setColorError] = useState('');
    const [quantityError, setQuantityError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productDetail, setProductDetail] = useState({
        code: '',
        quantity: '',
        size: '',
        colorId: '',
        productId: id,
    });

    useEffect(() => {
        fetchListSize();
        fetchListColor();
    }, []);

    const fetchListSize =  () => {
         getSize()
             .then((res) => {
                 setListSize(res.data);
             })
             .catch((err) => {
                 console.error(err);
             });
    };

    const fetchListColor =  () => {
         getAllColors()
             .then((res) => {
                 setListColor(res.data);
             })
             .catch((err) => {
                 console.error(err);
             });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductDetail({ ...productDetail, [name]: value });
    };

    const addProductDetailForm =  (e) => {
        e.preventDefault();
        let isValid = true;

        if (productDetail.code === '') {
            isValid = false;
            setCodeError('Mã phân loại sản phẩm không được để trống');
        } else {
            setCodeError('');
        }

        if (productDetail.quantity === '') {
            isValid = false;
            console.log('Số lượng không được để trống');
            setQuantityError('Số lượng không được để trống');
        } else if (
            productDetail.quantity !== '' &&
            isNaN(productDetail.quantity)
        ) {
            console.log('Số lượng không đúng định dạng');
            isValid = false;
            setQuantityError('Số lượng không đúng định dạng');
        } else if (
            productDetail.quantity !== '' &&
            productDetail.quantity < 0
        ) {
            isValid = false;
            setQuantityError('Số lượng không đúng định dạng');
        } else {
            setQuantityError('');
        }

        if (productDetail.size === '') {
            isValid = false;
            setSizeError('Chưa chọn size');
        } else {
            setSizeError('');
        }

        if (productDetail.color === '') {
            isValid = false;
            setColorError('Chưa chọn màu');
        } else {
            setColorError('');
        }

        if (isValid) {
            setIsLoading(true);
             addProductDetail(productDetail)
                .then((res) => {
                    toast.success('Thêm thành công');
                    navigate(`/admin/products/${id}/edit`);
                })
                .catch((error) => {
                    toast.error('Có lỗi xảy ra, không thể thêm');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };
    return (
        <>
            <h1>Thêm mã phân loại mới</h1>
            <hr />
            <div className="mt-5 bg-white p-5 shadow border">
                <form onSubmit={addProductDetailForm}>
                    <div className="row">
                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Mã code chi tiết sản phẩm
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="code"
                                onChange={handleInputChange}
                                className={
                                    codeError !== ''
                                        ? 'border-danger form-control'
                                        : 'form-control'
                                }
                            />
                            <span className="text-danger">{codeError}</span>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Số lượng<span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="quantity"
                                onChange={handleInputChange}
                                className={
                                    quantityError !== ''
                                        ? 'border-danger form-control'
                                        : 'form-control'
                                }
                            />
                            <span className="text-danger">{quantityError}</span>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Màu sắc<span style={{ color: 'red' }}>*</span>
                            </label>
                            <select
                                className={
                                    sizeError !== ''
                                        ? 'border-danger form-control'
                                        : 'form-control'
                                }
                                name="colorId"
                                onChange={handleInputChange}
                            >
                                <option value="">--Chọn màu--</option>
                                {listColor.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.colorCode} - {c.name}
                                    </option>
                                ))}
                            </select>
                            <span className="text-danger">{colorError}</span>
                        </div>

                        <div className="mb-3 col-6">
                            <label className="form-label">
                                Size<span style={{ color: 'red' }}>*</span>
                            </label>
                            <select
                                className={
                                    sizeError !== ''
                                        ? 'border-danger form-control'
                                        : 'form-control'
                                }
                                name="size"
                                onChange={handleInputChange}
                            >
                                <option value="">--Chọn size--</option>
                                {listSize.map((option) => (
                                    <option
                                        key={option.key}
                                        value={option.value}
                                    >
                                        {option.value}
                                    </option>
                                ))}
                            </select>
                            <span className="text-danger">{sizeError}</span>
                        </div>

                        <button disabled={isLoading} type="submit" className="col-2 button">
                            Thêm mới
                        </button>
                        {isLoading && <LoadingSpinner />}
                    </div>
                </form>
            </div>
        </>
    );
}
