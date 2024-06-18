import { useEffect, useState } from 'react';
import Tittle from '../../Fragments/Tittle';
import {
    activation,
    deleteAccount,
    getAccount,
    getAllAccount,
    updateRole,
} from '../../../Services/AccountService';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useModal from '../../../CustomHooks/useModal';
import useAuth from '../../../CustomHooks/useAuth';
import { Link } from 'react-router-dom';
import { getAllRoles } from '../../../Services/EnumService';
import SearchForm from '../../Fragments/SearchForm';
import CustomPagination from '../../Fragments/CustomPagination';
import usePagination from '../../../CustomHooks/usePagination';

export default function Account() {
    const [listAccount, setListAccount] = useState([]);
    const [account, setAccount] = useState({
        phone: '',
        email: '',
        address: '',
        name: '',
    });
    const { openModal, closeModal } = useModal();
    const { auth } = useAuth();
    const [show, setShow] = useState(false);
    const [listRoles, setListRoles] = useState([]);
    const [newIdRole, setNewIdRole] = useState({
        id: '',
        role: '',
    });
    const { searchParams } = usePagination();
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState();
    const [currentPage, setCurrentPage] = useState();

    const handleClose = () => setShow(false);

    const handleShow = async (id) => {
        await getAccount(id).then((res) => {
            setAccount({
                name: res.data.name,
                phone: res.data.phone,
                email: res.data.email,
                address: res.data.address,
            });
        });
        setShow(true);
    };

    useEffect(() => {
        fetchGetAllRoles();
    }, []);

     useEffect(() => {
         fetchGetAllAccount();
     }, [searchParams]);

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
                async () => {
                    await updateRole(newIdRole.id, newIdRole.role)
                        .then((res) => {
                            toast.success('Cập nhật quyền thành công!');
                            fetchGetAllAccount();
                        })
                        .catch((error) => {
                            console.error(error);
                            toast.error('Có lỗi xảy ra!');
                        });
                    closeModal();
                }
            );
        }
    }, [newIdRole]);

    const fetchGetAllAccount = async () => {
        await getAllAccount(searchParams).then((res) => {
            setListAccount(res.data.accountsRes);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
            setTotalProducts(res.data.totalProduct);
        });
    };

    const fetchGetAllRoles = async () => {
        await getAllRoles().then((res) => {
            setListRoles(res.data);
        });
    };

    const handleActivation = async (id, isActivated) => {
        openModal(
            isActivated ? 'Hủy kích hoạt?' : 'Kích hoạt?',
            'Bạn có chắc muốn' +
                (isActivated ? ' hủy kích hoạt' : 'kích hoạt') +
                ' tài khoản này?',
            () => {
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
                        toast.error('Có lỗi xảy ra!');
                    });
                closeModal();
            }
        );
    };

    const handleShowModalRole = async (id, role) => {
        setNewIdRole({ id, role });
    };
    return (
        <>
            <Tittle tittle="Quản lý tài khoản" />

            <div className="d-flex justify-content-between align-items-center mt-5">
                <Link to="/admin/accounts/add">
                    <button className="button">Tạo tài khoản mới</button>
                </Link>
                <div className='col-4'>
                    <SearchForm placeholder={'Nhập tên hoặc số điện thoại'} />
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
                                            <Link to={'/admin/accounts/edit'}>
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
                                                            handleShow(acc.id)
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
                                                        Hủy kích hoạt/Kích hoạt
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() =>
                                                            handleDelete(acc.id)
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
                    </tbody>
                </table>
                <CustomPagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    totalProducts={totalProducts}
                />
            </div>

            <Modal size="lg" show={show}>
                <Modal.Header closeButton onClick={() => handleClose()}>
                    <Modal.Title>Thông tin tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="m-5">
                        Tên: <span className="fw-bolder">{account.name}</span>
                    </div>
                    <div className="m-5">
                        Số điện thoại:{' '}
                        <span className="fw-bolder">{account.phone}</span>
                    </div>
                    <div className="m-5">
                        Email:{' '}
                        <span className="fw-bolder">{account.email}</span>
                    </div>
                    <div className="m-5">
                        Địa chỉ:{' '}
                        <span className="fw-bolder">{account.address}</span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
