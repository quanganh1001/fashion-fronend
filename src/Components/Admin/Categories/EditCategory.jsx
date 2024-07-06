import { useState, useEffect } from 'react';
import {
    getCategory,
    updateBackgroundCategory,
    updateCategory,
} from '../../../Services/CategoryService';
import { toast } from 'react-toastify';
import Tittle from '../../Fragments/Tittle';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import { useParams } from 'react-router-dom';

export default function EditCategory() {
    const [category, setCategory] = useState({
        categoryCode: '',
        catName: '',
    });
    const [catBackground, setCatBackground] = useState(null);
    const [currentBackgound, setCurrentBackgound] = useState('');
    const { id } = useParams();
    const [categoryCodeErorr, setCategoryCodeErorr] = useState('');
    const [catNameErorr, setCatNameErorr] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCategory, setIsLoadingCategory] = useState(true);
    const [isLoadingButton, setIsLoadingButton] = useState(false);

    useEffect(() => {
        fetchCategory();
    }, []);

    const fetchCategory = () => {
         getCategory(id)
             .then((res) => {
                 setCategory({
                     categoryCode: res.data.categoryCode,
                     catName: res.data.catName,
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
                    }
                    return;
                }).finally(() => {
                    
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
                    }).finally(() => {
                        setIsLoading(false);
                    });
            } else {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <Tittle tittle="Sửa danh mục" />

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
                                <div className="mb-3 col-6 mt-3">
                                    <img
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
