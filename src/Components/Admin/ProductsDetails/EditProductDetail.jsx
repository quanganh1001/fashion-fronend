import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    updateProductDetail,
    getProductDetail,
} from '../../../Services/ProductDetailService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import Title from '../../Fragments/Title';
import { getSize } from '../../../Services/EnumService';
import { getAllColors } from '../../../Services/ColorService';

export default function EditProductDetail() {
    const { id, pdid } = useParams();
    const navigate = useNavigate();
    const [codeError, setCodeError] = useState('');
    const [listSize, setListSize] = useState([]);
    const [listColor, setListColor] = useState([]);
    const [quantityError, setQuantityError] = useState('');
    const [sizeError, setSizeError] = useState('');
    const [colorError, setColorError] = useState('');
    const [isActivatedError, setIsActivatedError] = useState('');
    const [isLoading] = useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState(true);
    const [productDetail, setProductDetail] = useState({
        code: '',
        quantity: '',
        colorId: '',
        size: '',
        isActivated: '',
    });

    useEffect(() => {
        fetchListSize();
        fetchListColor();
    }, []);

    const fetchListSize = () => {
        getSize()
            .then((res) => {
                setListSize(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const fetchListColor = () => {
        getAllColors()
            .then((res) => {
                setListColor(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };
    
    useEffect(() => {
        fetchProductDetail();
    }, []);

    const fetchProductDetail =  () => {
         getProductDetail(pdid).then((res) => {
            setProductDetail({
                code: res.data.code,
                quantity: res.data.quantity,
                colorId: res.data.colorId,
                size: res.data.size,
                isActivated: res.data.isActivated,
            });
            
        }).catch ((err) => {
           console.error(err); 
        }).finally(() => {
            setIsLoadingDetail(false)
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductDetail({ ...productDetail, [name]: value });
    };

    const updateProductDetailForm =  (e) => {
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
            updateProductDetail(pdid, productDetail)
                .then((res) => {
                    toast.success('Sửa thành công');
                    navigate(`/admin/products/${id}/edit`);
                })
                .catch((error) => {
                    if (error.response.status === 409) {
                        setCodeError('Mã danh mục đã tồn tại');
                        toast.error('Mã danh mục đã tồn tại');
                    } else setCodeError('');

                    if (error.response.status === 400) {
                        setIsActivatedError(
                            'Sản phẩm đang ẩn nên không thể kích hoạt mã phân loại'
                        );
                        toast.error(
                            'Sản phẩm đang ẩn nên không thể kích hoạt mã phân loại'
                        );
                    } else setIsActivatedError('');
                });
        }
    };

    return (
        <>
            <Title title="Sửa mã phân loại" />
            <hr />
            <div className="mt-5 bg-white p-5 shadow border">
                {isLoadingDetail ? (
                    <LoadingSpinner />
                ) : (
                    <form onSubmit={updateProductDetailForm}>
                        <div className="row">
                            <div className="mb-3 col-6">
                                <label className="form-label">
                                    Mã code chi tiết sản phẩm
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={productDetail.code ?? ''}
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
                                    Số lượng
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="quantity"
                                    value={productDetail.quantity ?? ''}
                                    onChange={handleInputChange}
                                    className={
                                        quantityError !== ''
                                            ? 'border-danger form-control'
                                            : 'form-control'
                                    }
                                />
                                <span className="text-danger">
                                    {quantityError}
                                </span>
                            </div>

                            <div className="mb-3 col-6">
                                <label className="form-label">
                                    Màu sắc
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <select
                                    className={
                                        sizeError !== ''
                                            ? 'border-danger form-control'
                                            : 'form-control'
                                    }
                                    name="colorId"
                                    value={productDetail.colorId}
                                    onChange={handleInputChange}
                                >
                                    <option value="">--Chọn màu--</option>
                                    {listColor.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.colorCode} - {c.name}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-danger">
                                    {colorError}
                                </span>
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
                                    value={productDetail.size}
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

                            <div className="mb-3">
                                <label className="form-label">
                                    Trạng thái
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    className="form-check-input bg-dark border-dark mx-2"
                                    type="checkbox"
                                    name="isActivated"
                                    checked={productDetail.isActivated ?? true}
                                    onChange={(e) =>
                                        setProductDetail({
                                            ...productDetail,
                                            isActivated: e.target.checked,
                                        })
                                    }
                                />
                                {productDetail.isActivated ? 'Kích hoạt' : 'Ẩn'}
                            </div>
                            <span className="text-danger">
                                {isActivatedError}
                            </span>
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="col-2 button"
                            >
                                Lưu
                            </button>
                            {isLoading && <LoadingSpinner />}
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
