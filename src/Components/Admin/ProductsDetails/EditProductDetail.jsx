import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    updateProductDetail,
    getProductDetail,
} from '../../../Services/ProductDetailService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Fragments/LoadingSpinner';

export default function EditProductDetail() {
    const { id, pdid } = useParams();

    const navigate = useNavigate();

    const [codeError, setCodeError] = useState('');

    const [quantityError, setQuantityError] = useState('');

    const [isActivatedError, setIsActivatedError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDetail, setIsLoadingDetail] = useState(true);
    const [productDetail, setProductDetail] = useState({
        code: '',
        quantity: '',
        isActivated: '',
    });

    const [color ,setColor] = useState("")
    const [size, setSize] = useState("")
    
    useEffect(() => {
        fetchProductDetail();
    }, []);

    const fetchProductDetail = async () => {
        await getProductDetail(pdid).then((res) => {
            setProductDetail({
                code: res.data.code,
                quantity: res.data.quantity,
                isActivated: res.data.isActivated,
            });
            setColor(res.data.color);
            setSize(res.data.size);
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

    const updateProductDetailForm = async (e) => {
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

        if (isValid) {
            await updateProductDetail(pdid, productDetail)
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
            <h1>Sửa mã phân loại</h1>
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

                            <div className="my-4 col-6 d-flex justify-content-between">
                                <span>Màu sắc: {color}</span>
                            </div>
                            <div className="my-4 col-6 d-flex justify-content-between">
                                <span>Kích cỡ: {size}</span>
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
