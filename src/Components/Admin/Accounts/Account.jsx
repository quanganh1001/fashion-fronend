import { useEffect, useState } from 'react';
import Tittle from '../../Fragments/Tittle';
import {
    activation,
    deleteAccount,
    getAllAccount,
} from '../../../Services/Account';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useModal from '../../../CustomHooks/useModal';
import useAuth from '../../../CustomHooks/useAuth';

export default function Account() {
    const [listAccount, setListAccount] = useState([]);
    const { openModal, closeModal } = useModal();
    const { auth } = useAuth()
    
    useEffect(() => {
        fetchGetAllAccount();
    }, []);

    const fetchGetAllAccount = async () => {
        await getAllAccount().then((res) => {
            setListAccount(res.data.accountsRes);
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
                        console.log(res);
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

    return (
        <>
            <Tittle tittle="Quản lý tài khoản" />
            <div className="mt-5 bg-white p-5 shadow border">
                <table className="table table-striped table-hover table-bordered border">
                    <thead>
                        <tr>
                            <th>Tên tài khoản</th>
                            <th>Quyền</th>
                            <th>Trạng thái</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listAccount.map((acc) => (
                            <tr key={acc.id}>
                                <td>{acc.username}</td>
                                <td>{acc.role}</td>
                                <td className={acc.isActivated ? "text-bg-success" : "text-bg-danger"}>
                                    {acc.isActivated
                                        ? 'Hoạt động'
                                        : 'Hủy kích hoạt'}
                                </td>
                                <td>
                                    <Dropdown data-bs-theme="dark">
                                        <Dropdown.Toggle variant="dark bg-gradient btn-sm">
                                            Hành động
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                as={Link}
                                                to={`/admin/account/edit/${acc.id}`}
                                            >
                                                Xem/Sửa
                                            </Dropdown.Item>
                                            {auth.account.id !== acc.id && (
                                            <>
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
                                                </>) }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
