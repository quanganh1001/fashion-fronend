import { useState, useEffect } from 'react';
import {
    getAllCategories,
    getCategory,
    updateBackgroundCategory,
    updateCategory,
} from '../../../Services/CategoryService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import { useParams } from 'react-router-dom';
import Title from '../../Fragments/Title';

export default function EditCategory() {
    const [category, setCategory] = useState({
        categoryCode: '',
        catName: '',
        catParent: "",
    });
    const [catBackground, setCatBackground] = useState(null);
    const [currentBackgound, setCurrentBackgound] = useState('');
    const { id } = useParams();
    const [categoryCodeErorr, setCategoryCodeErorr] = useState('');
    const [catParentError, setCatParentError] = useState('');
    const [catNameErorr, setCatNameErorr] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCategory, setIsLoadingCategory] = useState(true);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [listCategories, setListCategories] = useState([]);

    useEffect(() => {
        fetchCategory();
        fetchListCategories();
    }, []);


    const fetchListCategories = () => {
        getAllCategories()
            .then((res) => {
                setListCategories(res.data);
            })
            .catch((error) => {
                console.error('Error fetching list categories:', error);
            });
    };

    const fetchCategory = () => {
        getCategory(id)
            .then((res) => {
                setCategory({
                    categoryCode: res.data.categoryCode,
                    catName: res.data.catName,
                    catParent: res.data.catParent
                });
                setCurrentBackgound(res.data.catBackground);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally((res) => {
                setIsLoadingCategory(false);
                setIsLoading(false);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };

    const handleFileChange = (event) => {
        setCatBackground(event.target.files[0]);
    };

    const editCategoryForm = (e) => {
        e.preventDefault();
        let isValid = true;

        if (category.categoryCode === '') {
            isValid = false;
            setCategoryCodeErorr('Mã danh mục không được để trống');
        } else {
            setCategoryCodeErorr('');
        }

        if (category.catName === '') {
            isValid = false;
            setCatNameErorr('Tên danh mục không được để trống');
        } else {
            setCatNameErorr('');
        }

        if (isValid) {
            setIsLoadingButton(true);
            updateCategory(id, category)
                .then(() => {
                    // navigator("/admin/categories");

                    toast.success('Sửa thành công thành công');
                })
                .catch((error) => {
                    
                    if (error.response.status === 409) {
                        setCategoryCodeErorr('Mã danh mục đã tồn tại');
                        toast.error('Mã danh mục đã tồn tại');
                    } else if (error.response.status === 400) {
                        setCatParentError(error.response.data);
                        toast.error(error.response.data);
                    } else{console.error(error);
                    }
                })
                .finally(() => {
                    setIsLoadingButton(false);
                });

            if (catBackground != null) {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('file', catBackground);
                updateBackgroundCategory(id, formData)
                    .then(() => {
                        fetchCategory();
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
            <Title title="Sửa danh mục" />

            <div className="mt-5 bg-white p-5 shadow border">
                {isLoadingCategory ? (
                    <LoadingSpinner />
                ) : (
                    <form onSubmit={editCategoryForm}>
                        <div className="row">
                            <div className="mb-3 col-6">
                                <label className="form-label">
                                    Mã danh mục
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    name="categoryCode"
                                    value={category.categoryCode}
                                    type="text"
                                    className={
                                        categoryCodeErorr !== ''
                                            ? 'border-danger form-control'
                                            : 'form-control'
                                    }
                                    onChange={handleInputChange}
                                />
                                <span className="text-danger">
                                    {categoryCodeErorr}
                                </span>
                            </div>

                            <div className="mb-3 col-6">
                                <label className="form-label">
                                    Tên danh mục
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="catName"
                                    className={
                                        catNameErorr !== ''
                                            ? 'border-danger form-control'
                                            : 'form-control'
                                    }
                                    value={category.catName}
                                    onChange={handleInputChange}
                                />
                                <span className="text-danger">
                                    {catNameErorr}
                                </span>
                            </div>

                            <div className="mb-3 col-6">
                                <label className="form-label">
                                    Nằm trong danh mục
                                </label>
                                <select
                                    className={
                                        catParentError !== ''
                                            ? 'border-danger form-control'
                                            : 'form-control'
                                    }
                                    value={category.catParent}
                                    name="catParent"
                                    onChange={handleInputChange}
                                >
                                    <option value="">Không</option>
                                    {listCategories.map((option) => (
                                        <option
                                            key={option.id}
                                            value={option.id}
                                        >
                                            {option.categoryCode} -{' '}
                                            {option.catName}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-danger">
                                    {catParentError}
                                </span>
                            </div>

                            <div className="mb-3 col-6">
                                <label className="form-label">
                                    Tải ảnh nền
                                    <span className="text-danger">*</span>
                                </label>
                                <input
                                    className="form-control"
                                    type="file"
                                    name="catBackground"
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

                            <div className="col-12 mt-3">
                                <button
                                    disabled={isLoadingButton}
                                    type="submit"
                                    className="col-2 button text-align-center"
                                >
                                    Sửa danh mục
                                </button>
                                {isLoadingButton && <LoadingSpinner />}
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
