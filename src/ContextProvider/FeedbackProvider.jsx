import { useEffect, useState } from "react";
import { getTotalUnread, readFeedback, unread } from "../Services/FeedbackCustomerService";
import useModal from "../CustomHooks/useModal";
import { toast } from "react-toastify";
import { FeedbackContext } from "./Context";

export default function FeedbackProvider({ children }) {
    const [totalFeedbackUnread, setTotalFeedbackUnread] = useState('');
    const { openModal } = useModal();
 

    useEffect(() => {
        fetchTotalFeedbackUnread();
    }, [])
    
    

    const fetchTotalFeedbackUnread = () => {
        getTotalUnread().then((res) => {
            
            setTotalFeedbackUnread(res.data);
        }).catch((err) => { console.error(err) })
    }

    const handleReadFeedback = (fb) => {
        readFeedback(fb.id)
            .then(() => {
                fetchTotalFeedbackUnread();
                openModal(
                    'Thông tin phản hồi',
                    <>
                        <div className="m-5">
                            Tên: <span className="fw-bolder">{fb.name}</span>
                        </div>
                        <div className="m-5">
                            Email: <span className="fw-bolder">{fb.email}</span>
                        </div>
                        <div className="m-5">
                            Phản hồi:{' '}
                            <span className="fw-bolder">{fb.feedback}</span>
                        </div>
                    </>,
                    () => {},
                    true
                );
            })
            .catch((err) => {
                console.error(err);
                toast.error('Không thể đọc');
            });
    }
    const handleUnread = (id) => {
        unread(id)
            .then(() => {
                fetchTotalFeedbackUnread();
                toast.success('Đã đánh dấu là chưa đọc');
            })
            .catch((err) => {
                console.error(err);
                toast.error('Không thể đóng');
            });
    };
    return (
        <FeedbackContext.Provider
            value={{
                totalFeedbackUnread,
                handleReadFeedback,
                handleUnread,
            }}
        >
            {children}
        </FeedbackContext.Provider>
    );
}