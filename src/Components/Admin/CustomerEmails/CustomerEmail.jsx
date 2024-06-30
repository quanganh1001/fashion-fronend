import { useState, useEffect } from 'react';
import { sendMail } from '../../../Services/CustomerEmailService';
import { toast } from 'react-toastify';

export default function CustomerEmail() {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [contentError, setContentError] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else {
            setIsButtonDisabled(false);
        }

        return () => clearInterval(timer);
    }, [countdown]);

    const handleSendEmail = () => {
        let isValid = true;

        if (subject === '') {
            setSubjectError('Tiêu đề không được để trống');
            isValid = false;
        } else {
            setSubjectError('');
        }

        if (content === '') {
            setContentError('Nội dung không được để trống');
            isValid = false;
        } else {
            setContentError('');
        }

        if (isValid) {
            sendMail({ subject, content })
                .then(() => {
                    toast.success('Đã gửi thành công!');
                    setIsButtonDisabled(true);
                    setCountdown(60);
                })
                .catch((error) => {
                    toast.error('Gửi thất bại');
                    console.error(error);
                });
        }
    };

    const handleChangeSubject = (e) => {
        setSubject(e.target.value);
    };

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    };

    return (
        <>
            <div className="content-admin p-4">
                <h2>Gửi email tới toàn bộ khách hàng</h2>
                <div className="mt-5 bg-white p-5 shadow border">
                    <div className="mb-3">Nhập nội dung:</div>
                    <label className="col-5 mb-3">
                        <input
                            type="text"
                            id="subject"
                            className={`form-control ${
                                subjectError !== '' ? 'border-danger' : ''
                            }`}
                            onChange={handleChangeSubject}
                            placeholder="Tiêu đề"
                        />
                    </label>
                    <label className="col-12 mb-3">
                        <textarea
                            className={`form-control ${
                                contentError !== '' ? 'border-danger' : ''
                            }`}
                            rows="4"
                            placeholder="Nội dung"
                            onChange={handleChangeContent}
                        ></textarea>
                    </label>

                    <button
                        className="button"
                        onClick={handleSendEmail}
                        disabled={isButtonDisabled}
                    >
                        {isButtonDisabled ? `Chờ ${countdown}s` : 'Gửi'}
                    </button>
                </div>
            </div>
        </>
    );
}
