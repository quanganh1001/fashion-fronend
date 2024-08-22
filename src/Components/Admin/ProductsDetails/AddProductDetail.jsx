import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSize } from '../../../Services/EnumService';
import { addProductDetail } from '../../../Services/ProductDetailService';
import { toast } from 'react-toastify';
import { createColor, deleteColor, getAllColors } from '../../../Services/ColorService';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import Title from '../../Fragments/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useModal from '../../../CustomHooks/useModal';


export default function AddProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listSize, setListSize] = useState([]);
    const [listColor, setListColor] = useState([]);
    const [sizeError, setSizeError] = useState('');
    const [codeError, setCodeError] = useState('');
    const [colorError, setColorError] = useState('');
    const [quantityError, setQuantityError] = useState('');
    const [colorCodeError, setColorCodeError] = useState('');
    const [colorNameError, setColorNameError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { openModal, closeModal } = useModal();
    const [ isOpenModal, setIsOpenModal ] = useState(false);
    const [newColorCode, setNewColorCode] = useState("");
    const [newColorName, setNewColorName] = useState("");
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

    useEffect(() => {
        if (isOpenModal || newColorName !== '' || newColorCode !== '' || colorNameError !== '' || colorCodeError !== '') {
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
       
    }, [newColorCode, newColorName, isOpenModal, listColor,colorCodeError,colorNameError]);

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

    const handleDeleteColor = (id) => {
         deleteColor(id)
             .then(() => {         
                toast.success('Xóa thành công!');
                fetchListColor();
            })
            .catch((error) => {
                console.error(error);
                toast.error('Có lỗi xảy ra!');
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
                })
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductDetail({ ...productDetail, [name]: value });
    };

    const handleSetNewColorCode = (e) => {
        setIsOpenModal(true);
        setNewColorCode(e.target.value);
    };
    
    const handleSetNewColorName = (e) => {
        setIsOpenModal(true);
        setNewColorName(e.target.value);
    };

    const addProductDetailForm = (e) => {
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
            setQuantityError('Số lượng không được để trống');
        } else if (
            productDetail.quantity !== '' &&
            isNaN(productDetail.quantity)
        ) {
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

        if (productDetail.colorId === '') {
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

    

    const openColor = async () => {
        await setIsOpenModal(false);
        await setIsOpenModal(true);
    };
    return (
        <>
            <Title title="Thêm chi tiết sản phẩm" />
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
                                <FontAwesomeIcon
                                    onClick={openColor}
                                    className="ms-2"
                                    icon="fa-regular fa-square-plus"
                                    style={{ cursor: 'pointer' }}
                                />
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

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="col-2 button"
                        >
                            Thêm mới
                        </button>
                        {isLoading && <LoadingSpinner />}
                    </div>
                </form>
            </div>
        </>
    );
}
