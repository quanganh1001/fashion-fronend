import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    updateProductDetail,
    getProductDetail,
    updateBackgroundProductDetail,
} from '../../../Services/ProductDetailService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import Title from '../../Fragments/Title';
import { getSize } from '../../../Services/EnumService';
import { createColor, deleteColor, getAllColors } from '../../../Services/ColorService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useModal from '../../../CustomHooks/useModal';

export default function EditProductDetail() {
    const { pdid } = useParams();
    const [codeError, setCodeError] = useState('');
    const [listSize, setListSize] = useState([]);
    const [listColor, setListColor] = useState([]);
    const [quantityError, setQuantityError] = useState('');
    const [sizeError, setSizeError] = useState('');
    const [colorError, setColorError] = useState('');
    const { openModal } = useModal();
    const [colorCodeError, setColorCodeError] = useState('');
    const [colorNameError, setColorNameError] = useState('');
    const [isActivatedError, setIsActivatedError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imgBackground, setImgBackground] = useState(null);
    const [currentBackgound, setCurrentBackgound] = useState('');
    const [isLoadingDetail, setIsLoadingDetail] = useState(true);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [newColorCode, setNewColorCode] = useState('');
    const [newColorName, setNewColorName] = useState('');
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

    useEffect(() => {
        if (
            isOpenModal ||
            newColorName !== '' ||
            newColorCode !== '' ||
            colorNameError !== '' ||
            colorCodeError !== ''
        ) {
            openModal(
                'Danh sách mã màu',
                <>
                    <div>
                        <form onSubmit={addColor}>
                            <div className="row d-flex justify-content-center">
                                <div className="mb-3 col-6">
                                    <label>
                                        Mã màu
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        value={newColorCode}
                                        onChange={handleSetNewColorCode}
                                        type="text"
                                        className={
                                            colorCodeError !== ''
                                                ? 'border-danger form-control'
                                                : 'form-control'
                                        }
                                    />
                                    <span className="text-danger">
                                        {colorCodeError}
                                    </span>
                                </div>

                                <div className="mb-3 col-6">
                                    <label>
                                        Tên màu
                                        <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <input
                                        value={newColorName}
                                        onChange={handleSetNewColorName}
                                        type="text"
                                        className={
                                            colorNameError !== ''
                                                ? 'border-danger form-control'
                                                : 'form-control'
                                        }
                                    />
                                    <span className="text-danger">
                                        {colorNameError}
                                    </span>
                                </div>

                                <button className="col-4 button" type="submit">
                                    Thêm mã màu
                                </button>
                            </div>
                        </form>
                    </div>
                    <hr />
                    <div className="d-flex flex-wrap">
                        {listColor.map((color) => (
                            <div key={color.id} className="mb-3 col-6">
                                <FontAwesomeIcon
                                    onClick={() => handleDeleteColor(color.id)}
                                    icon="fa-solid fa-square-minus"
                                    style={{
                                        color: '#b30000',
                                        cursor: 'pointer',
                                    }}
                                    className="me-3"
                                />
                                {color.name} / {color.colorCode}
                            </div>
                        ))}
                    </div>
                </>,
                () => {},
                true
            );
        }
    }, [
        newColorCode,
        newColorName,
        isOpenModal,
        listColor,
        colorCodeError,
        colorNameError,
    ]);

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

    const fetchProductDetail = () => {
        getProductDetail(pdid)
            .then((res) => {
                setProductDetail({
                    code: res.data.code,
                    quantity: res.data.quantity,
                    colorId: res.data.colorId,
                    size: res.data.size,
                    isActivated: res.data.isActivated,
                });
                setCurrentBackgound(res.data.imageBackground);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoadingDetail(false);
            });
    };

    const addColor = (e) => {
        e.preventDefault();
        let isValid = true;

        if (newColorCode === '') {
            isValid = false;
            setColorCodeError('Chưa điền mã màu');
        } else if (newColorCode.length > 3) {
            isValid = false;
            setColorCodeError('Độ dài lớn hơn 3 ký tự');
        } else {
            setColorCodeError('');
        }
        if (newColorName === '') {
            isValid = false;
            setColorNameError('Chưa điền tên màu');
        } else {
            setColorNameError('');
        }

        if (isValid) {
            createColor({ newColorCode, newColorName })
                .then((res) => {
                    toast.success('Thêm thành công');
                    fetchListColor();
                })
                .catch((error) => {
                    if (error.response.status === 409) {
                        setColorCodeError('Mã màu đã tồn tại');
                        setIsOpenModal(true);
                    }
                    console.error(error);
                });
        }
    };

    const handleDeleteColor = (id) => {
        deleteColor(id)
            .then(() => {
                toast.success('Xóa thành công!');
                fetchListColor();
            })
            .catch((error) => {
                console.error(error);
                toast.error('"Không thể xóa màu này"');
            });
    };

    const handleSetNewColorCode = (e) => {
        setIsOpenModal(true);
        setNewColorCode(e.target.value);
    };

    const handleSetNewColorName = (e) => {
        setIsOpenModal(true);
        setNewColorName(e.target.value);
    };
    
    const openColor = async () => {
        await setIsOpenModal(false);
        await setIsOpenModal(true);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductDetail({ ...productDetail, [name]: value });
    };

    const handleFileChange = (event) => {
        setImgBackground(event.target.files[0]);
    };

    const updateProductDetailForm = (e) => {
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
            
            if (imgBackground != null) {
                console.log("a");
                
                setIsLoading(true);
                const formData = new FormData();
                formData.append('file', imgBackground);
                updateBackgroundProductDetail(pdid, formData)
                    .then(() => {
                        fetchProductDetail();
                    })
                    .catch((err) => {
                        console.error(err);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            } else {
                setIsLoading(false);
            }
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
                                <FontAwesomeIcon
                                    onClick={openColor}
                                    className="ms-2"
                                    icon="fa-regular fa-square-plus"
                                    style={{ cursor: 'pointer' }}
                                />

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

                            <div className="d-flex mb-5">
                                <div className=" col-6">
                                    <label className="form-label">
                                        Tải ảnh nền
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        name="imgBackground"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                {isLoading ? (
                                    <LoadingSpinner />
                                ) : (
                                    <div className="ms-3 mb-3 col-6 mt-3">
                                        <img
                                            className=" img-thumbnail"
                                            src={currentBackgound}
                                            width="150px"
                                            alt=""
                                        />
                                    </div>
                                )}
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
