import { useState, useEffect } from 'react';
import {
    deleteCategory,
    getCategory,
    getChildCategories,
} from '../../../Services/CategoryService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AlertLink, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useModal from '../../../CustomHooks/useModal';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import Title from '../../Fragments/Title';

export default function Category() {
    const [id, setId] = useState('');

    const [oldCatName, setOldCatName] = useState('');

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { openModal, closeModal } = useModal();

    useEffect(() => {
        fetchListCategories();
    }, [id]);

    const fetchListCategories = () => {
        setIsLoading(true);
        getChildCategories(id)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const fetchOldCategory = () => {
        setIsLoading(true);
        getCategory(id)
            .then((res) => {
                setId(res.data.catParent);
                setOldCatName(res.data.catParentName);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleDelete = (id) => {
        openModal('Xóa sản phẩm', `Bạn có chắc muốn xóa sản phẩm này?`, () => {
            setIsLoading(true);
            deleteCategory(id)
                .then(() => {
                    toast.success('Xóa thành công!');
                    fetchListCategories();
                })
                .catch((error) => {
                    toast.error('Không thể xóa!');
                    setIsLoading(false);
                })
                
            closeModal();
        });
    };

    return (
        <>
            <Title title="Danh mục sản phẩm" />
            <div className="mt-5 bg-white p-5 shadow border">
                <div>
                    <span className="text-dark link-underline-dark link-underline-opacity-0 link-underline-opacity-100-hover">
                        <i className="fa-solid fa-arrow-left"></i>
                    </span>
                    <span
                        href="/admin/category?parent="
                        className="text-dark link-underline-dark link-underline-opacity-0 link-underline-opacity-100-hover"
                    ></span>
                    <div className="mt-3 mb-5">
                        <span>
                            <Link to="/admin/categories/add">
                                <button className="button">
                                    Thêm danh mục
                                </button>
                            </Link>
                        </span>
                    </div>
                </div>
                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        {id ? (
                            <div
                                className=" my-3"
                                onClick={() => {
                                    fetchOldCategory();
                                }}
                            >
                                <FontAwesomeIcon icon="fa-solid fa-backward" />
                                <AlertLink className="ms-2 link-dark">
                                    {oldCatName}
                                </AlertLink>
                            </div>
                        ) : (
                            ''
                        )}
                        <table className="table table-striped table-hover table-bordered border">
                            <thead>
                                <tr>
                                    <th>Mã danh mục</th>
                                    <th>Tên danh mục</th>
                                    <th>Nằm trong danh mục</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr className="bg-body-secondary">
                                        <td colSpan="7" className="text-center">
                                            Không có danh mục con
                                        </td>
                                    </tr>
                                ) : null}

                                {categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td
                                            onClick={() => {
                                                setId(cat.id);
                                                setOldCatName(cat.catName);
                                            }}
                                        >
                                            <AlertLink className="ms-2 link-dark">
                                                {cat.categoryCode}{' '}
                                                <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" />
                                            </AlertLink>
                                        </td>
                                        <td>{cat.catName}</td>
                                        <td>{cat.catParentName ?? 'Không'}</td>
                                        <td>
                                            <Dropdown data-bs-theme="dark">
                                                <Dropdown.Toggle variant="dark bg-gradient btn-sm">
                                                    Hành động
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item
                                                        as={Link}
                                                        to={`/admin/categories/${cat.id}/edit`}
                                                    >
                                                        Xem/Sửa
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() =>
                                                            handleDelete(cat.id)
                                                        }
                                                    >
                                                        Xóa
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </>
    );
}
