import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../../../Services/AccountService';
import { getAllRoles } from '../../../Services/EnumService';
import Title from '../../Fragments/Title';
import LoadingSpinner from '../../Fragments/LoadingSpinner';

export default function AddAccount() {
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [roleError, setRoleError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [account, setAccount] = useState({
        phone: '',
        name: '',
        email: '',
        address: '',
        role: '',
    });

    const [listRoles, setListRoles] = useState([]);

    useEffect(() => {
        fetchGetAllRoles();
    }, []);

    const fetchGetAllRoles = () => {
        getAllRoles()
            .then((res) => {
                setListRoles(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccount({ ...account, [name]: value });
    };

    const addAccountForm = (e) => {
        e.preventDefault();
        let isValid = true;

        if (account.name === '') {
            isValid = false;
            setNameError('Tên không được để trống');
        } else {
            setNameError('');
        }

        if (account.phone === '') {
            isValid = false;
            setPhoneError('Số điện thoại không được để trống');
        } else if (isNaN(account.phone)) {
            isValid = false;
            setPhoneError('Số điện thoại không hợp lệ');
        } else if (account.phone.length !== 10) {
            isValid = false;
            setPhoneError('Số điện thoại phải có 10 ký tự');
        } else {
            setPhoneError('');
        }

        if (account.email === '') {
            isValid = false;
            setEmailError('Email không được để trống');
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                String(account.email).toLowerCase()
            )
        ) {
            isValid = false;
            setEmailError('Email không hợp lệ');
        } else {
            setEmailError('');
        }

        if (account.role === '') {
            isValid = false;
            setRoleError('Phân quyền không được để trống');
        } else {
            setRoleError('');
        }

        if (isValid) {
            setIsLoading(true);
            createAccount(account)
                .then(() => {
                    toast.success('Thêm mới thành công');
                    navigate('/admin/accounts');
                })
                .catch((error) => {
                    if (error.response.status === 409) {
                        if (error.response.data.startsWith('Phone')) {
                            toast.error('Số điện thoại đã tồn tại');
                            setPhoneError('Số điện thoại đã tồn tại');
                        } else if (error.response.data.startsWith('Email')) {
                            toast.error('Email đã tồn tại');
                            setEmailError('Email đã tồn tại');
                        } else {
                            toast.error('Có lỗi xảy ra');
                            console.error(error);
                        }
                    }
                })
                .finally(()=>{setIsLoading(false);});
        }
    };
    return (
        <>
            <Title title="Thêm mới tài khoản" />
            <div className="mt-5 bg-white p-5 shadow border">
                <form onSubmit={addAccountForm}>
                    <div className="row">
                        <div className="mb-3">
                            <label className="form-label">
                                Tên<span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                name="name"
                                type="text"
                                className={
                                    nameError !== ''
                                        ? 'border-danger form-control'
                                        : 'form-control'
                                }
                                onChange={handleInputChange}
                            />
                            <span className=" text-danger">{nameError}</span>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                Số điện thoại
                                <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                name="phone"
                                type="text"
                                className={
                                    phoneError !== ''
                                        ? 'border-danger form-control'
                                        : 'form-control'
                                }
                                value={account.phone}
                                onChange={handleInputChange}
                            />
                            <span className=" text-danger">{phoneError}</span>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Email<span style={{ color: 'red' }}>*</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                className={
                                    emailError !== ''
                                        ? 'border-danger form-control'
                                        : 'form-control'
                                }
                                value={account.email}
                                onChange={handleInputChange}
                            />
                            <span className=" text-danger">{emailError}</span>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Địa chỉ</label>
                            <input
                                name="address"
                                type="text"
                                className="form-control"
                                value={account.address}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Quyền truy cập</label>
                            <select
                                name="role"
                                className="form-control"
                                onChange={handleInputChange}
                            >
                                <option value="">--Chọn--</option>
                                {listRoles.map((r) => (
                                    <option key={r.key} value={r.key}>
                                        {r.value}
                                    </option>
                                ))}
                            </select>
                            <span className=" text-danger">{roleError}</span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="button me-1">
                            Thêm mới
                        </button>
                        {isLoading && <LoadingSpinner />}
                    </div>
                </form>
            </div>
        </>
    );
}
