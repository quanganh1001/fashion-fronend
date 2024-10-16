import { useEffect, useState } from 'react';
import {
    activation,
    deleteAccount,
    getAllAccount,
    updateRole,
} from '../../../Services/AccountService';
import { Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useModal from '../../../CustomHooks/useModal';
import useAuth from '../../../CustomHooks/useAuth';
import { Link } from 'react-router-dom';
import { getAllRoles } from '../../../Services/EnumService';
import SearchForm from '../../Fragments/SearchForm';
import CustomPagination from '../../Fragments/CustomPagination';
import usePagination from '../../../CustomHooks/usePagination';
import { resetPass } from '../../../Services/Auth';
import LoadingSpinner from '../../Fragments/LoadingSpinner';
import Title from '../../Fragments/Title';

export default function Account() {
    const [listAccount, setListAccount] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { openModal, closeModal } = useModal();
    const { auth } = useAuth();
    const [listRoles, setListRoles] = useState([]);
    const [newIdRole, setNewIdRole] = useState({
        id: '',
        role: '',
    });
    const [newResetByEmail, setNewResetByEmail] = useState('');
    const { searchParams,setPage } = usePagination();
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState();
    const [currentPage, setCurrentPage] = useState();
    const [selectRole, setSelectRole] = useState("");

    useEffect(() => {
        fetchGetAllRoles();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchGetAllAccount();
    }, [searchParams, selectRole]);

    useEffect(() => {
        if (newIdRole.role !== '') {
            openModal(
                'Sửa quyền',
                <>
                    <select
                        className="form-control"
                        value={newIdRole.role}
                        onChange={(e) =>
                            setNewIdRole({ ...newIdRole, role: e.target.value })
                        }
                    >
                        {listRoles.map((r) => (
                            <option key={r.key} value={r.key}>
                                {r.value}
                            </option>
                        ))}
                    </select>
                </>,
                () => {
                    setIsLoading(true);
                    updateRole(newIdRole.id, newIdRole.role)
                        .then((res) => {
                            toast.success('Cập nhật quyền thành công!');
                            fetchGetAllAccount();
                        })
                        .catch((error) => {
                            console.error(error);
                            toast.error('Có lỗi xảy ra!');
                        })
                        .finally(() => {
                            setIsLoading(false);
                        });
                    closeModal();
                }
            );
        }
    }, [newIdRole]);

    useEffect(() => {
        if (newResetByEmail !== '') {
            openModal(
                'Cấp lại mật khẩu',
                `Bạn có chắc muốn cấp lại mật khẩu cho tải khoản này qua email ?`,
                () => {
                    setIsLoading(true);
                    resetPass(newResetByEmail)
                        .then((res) => {
                            console.log(res);
                            toast.success(
                                'Mật khẩu mới được gửi về email đăng ký!'
                            );
                        })
                        .catch((error) => {
                            toast.error('Có lỗi xảy ra!');
                        })
                        .finally(() => {
                            setIsLoading(false);
                        });
                    closeModal();
                }
            );
        }
    }, [newResetByEmail]);

    const fetchGetAllAccount = () => {
        getAllAccount(searchParams,selectRole)
            .then((res) => {
                setListAccount(res.data.accountsRes);
                setTotalPages(res.data.totalPages);
                setCurrentPage(res.data.currentPage);
                setTotalItems(res.data.totalItems);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const fetchGetAllRoles = () => {
        getAllRoles()
            .then((res) => {
                setListRoles(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleActivation = (id, isActivated) => {
        openModal(
            isActivated ? 'Hủy kích hoạt?' : 'Kích hoạt?',
            'Bạn có chắc muốn' +
                (isActivated ? ' hủy kích hoạt' : 'kích hoạt') +
                ' tài khoản này?',
            () => {
                setIsLoading(true);
                activation(id)
                    .then((res) => {
                        fetchGetAllAccount();
                    })
                    .catch((error) => {
                        console.error(error);
                        toast.error('Có lỗi xảy ra!');
                    });

                closeModal();
            }
        );
    };

    const handleDelete = (id) => {
        openModal(
            'Xóa tài khoản',
            `Bạn có chắc muốn xóa tài khoản này?`,
            () => {
                deleteAccount(id)
                    .then((res) => {
                        toast.success('Xóa tài khoản thành công!');
                        fetchGetAllAccount();
                    })
                    .catch((error) => {
                        console.error(error);
                        toast.error("Không thể xóa tài khoản này");
                    });
                closeModal();
            }
        );
    };

    const handleShowModalRole = (id, role) => {
        setNewIdRole({ id, role });
    };

    const handleResetPass = (email) => {
        setNewResetByEmail(email);
    };

    const handleShowAccountDetail = (account) => {
        openModal(
            'Thông tin tài khoản',
            <>
                <div className="m-5">
                    Tên: <span className="fw-bolder">{account.name}</span>
                </div>
                <div className="m-5">
                    Số điện thoại:{' '}
                    <span className="fw-bolder">{account.phone}</span>
                </div>
                <div className="m-5">
                    Email: <span className="fw-bolder">{account.email}</span>
                </div>
                <div className="m-5">
                    Địa chỉ:{' '}
                    <span className="fw-bolder">{account.address}</span>
                </div>
            </>,
            () => {},
            true
        );
    };

    const handleSelectRole = (role) => {
        setSelectRole(role);
        setPage(1);
    }
    return (
        <>
            <Title title="Quản lý tài khoản" />

            <div className="d-flex justify-content-between align-items-center mt-5">
                <Link to="/admin/accounts/add">
                    <button className="button">Tạo tài khoản mới</button>
                </Link>
                <div className="col-4">
                    <SearchForm placeholder={'Nhập tên hoặc số điện thoại'} />
                </div>
                <div className="col-3">
                    <select
                        className="form-select "
                        value={selectRole || ''}
                        onChange={(e) => handleSelectRole(e.target.value)}
                    >
                        <option value="">Tất cả</option>
                        <option value="ROLE_MANAGER">Quản lý</option>
                        <option value="ROLE_EMPLOYEE">Nhân viên</option>
                        <option value="ROLE_CUSTOMER">Khách hàng</option>
                    </select>
                </div>
            </div>
            <div className="mt-5 bg-white p-5 shadow border">
                <table className="table table-striped table-hover table-bordered border">
                    <thead>
                        <tr>
                            <th>Tên</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Quyền</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                {listAccount.map((acc) => (
                                    <tr key={acc.id}>
                                        <td>{acc.name}</td>
                                        <td>{acc.phone}</td>
                                        <td>{acc.email}</td>
                                        <td>{acc.role}</td>
                                        <td
                                            className={
                                                acc.isActivated
                                                    ? 'text-bg-success'
                                                    : 'text-bg-danger'
                                            }
                                        >
                                            {acc.isActivated
                                                ? 'Hoạt động'
                                                : 'Hủy kích hoạt'}
                                        </td>
                                        <td>
                                            {auth.account.id === acc.id ? (
                                                <>
                                                    <Link
                                                        to={
                                                            '/admin/accounts/edit'
                                                        }
                                                    >
                                                        <button className="button">
                                                            Xem/Sửa
                                                        </button>
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Dropdown data-bs-theme="dark">
                                                        <Dropdown.Toggle variant="dark bg-gradient btn-sm">
                                                            Hành động
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleShowAccountDetail(
                                                                        acc
                                                                    )
                                                                }
                                                            >
                                                                Xem thông tin
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleShowModalRole(
                                                                        acc.id,
                                                                        acc.role
                                                                    )
                                                                }
                                                            >
                                                                Sửa quyền
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleActivation(
                                                                        acc.id,
                                                                        acc.isActivated
                                                                    )
                                                                }
                                                            >
                                                                Hủy kích
                                                                hoạt/Kích hoạt
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleResetPass(
                                                                        acc.email
                                                                    )
                                                                }
                                                            >
                                                                Cấp lại mật khẩu
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        acc.id
                                                                    )
                                                                }
                                                            >
                                                                Xóa
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
                <CustomPagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    totalItems={totalItems}
                />
            </div>
        </>
    );
}
