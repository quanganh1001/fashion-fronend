import { useEffect, useState } from 'react';
import {
    getCurrentAccount,
    updateAccount,
} from '../../../Services/AccountService';
import Tittle from '../../Fragments/Tittle';
import { toast } from 'react-toastify';

export default function EditAccount() {
    const [phoneError, setPhoneError] = useState('');

    const [emailError, setEmailError] = useState('');

    const [nameError, setNameError] = useState('');

    const [account, setAccount] = useState({
        phone: '',
        name: '',
        email: '',
        address: '',
    });

    useEffect(() => {
        fetchAccount();
    }, []);

    const fetchAccount = async () => {
        await getCurrentAccount()
            .then((res) => {
                setAccount({
                    phone: res.data.phone,
                    name: res.data.name,
                    email: res.data.email,
                    address: res.data.address,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccount({ ...account, [name]: value });
    };

    const editAccountForm = async (e) => {
        e.preventDefault();
        let isValid = true;


        if (account.phone === '') {
            isValid = false;
            setPhoneError('Số điện thoại không được để trống');
        } else if (isNaN(account.phone)) {
            isValid = false;
            setPhoneError('Số điện thoại không hợp lệ');
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

        if (account.name === '') {
            isValid = false;
            setNameError('Tên không được để trống');
        } else {
            setNameError('');
        }

        if (isValid) {
            await updateAccount(account)
                .then(() => {
                    toast.success('Sửa thành công');
                })
                .catch((error) => {
                    if (error.response.status === 409) {
                        if (error.response.message.startsWith('Phone')) {
                            toast.error('Số điện thoại đã tồn tại');
                            setPhoneError('Số điện thoại đã tồn tại');
                        } else {
                            toast.error('Email đã tồn tại');
                            setPhoneError('Email đã tồn tại');
                        }
                    }
                });
        }
    };

    return (
        <>
            <Tittle tittle="Thông tin tài khoản" />
            <div className="mt-5 bg-white p-5 shadow border">
                <form onSubmit={editAccountForm}>
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
                                value={account.name}
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
                                type="text"
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
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="button">
                            Lưu lại
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
