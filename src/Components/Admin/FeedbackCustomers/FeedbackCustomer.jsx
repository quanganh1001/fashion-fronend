import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseISO, format } from 'date-fns';
import CustomPagination from '../../Fragments/CustomPagination';
import usePagination from '../../../CustomHooks/usePagination';
import useFeedback from '../../../CustomHooks/useFeedback';
import { getAllFeedback } from '../../../Services/FeedbackCustomerService';
import LoadingSpinner from '../../Fragments/LoadingSpinner';

export default function FeedbackCustomer() {
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState();
    const [currentPage, setCurrentPage] = useState();
    const [listFeedback, setListFeedback] = useState([]);
    const { searchParams } = usePagination();
    const { handleReadFeedback, handleUnread, totalFeedbackUnread } =useFeedback();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAllFeedback();
    }, [searchParams, totalFeedbackUnread]);

    const fetchAllFeedback = () => {
        setIsLoading(true);
        getAllFeedback(searchParams).then((res) => {
            setListFeedback(res.data.feedbackCustomers);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
            setTotalItems(res.data.totalItems);
            setIsLoading(false)
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setIsLoading(false)
        });
    };

    const showFeedBack = (fb) => {
        setIsLoading(true)
        handleReadFeedback(fb);
    };

    const handleUnreadFeedback = (id) => {
        setIsLoading(true);
        handleUnread(id);
    };

    return (
        <>
            <h2>Phản hồi khách hàng</h2>
            <div className="mt-5 bg-white p-5 shadow border">
                <table className="table table-striped table-hover table-bordered border mt-5">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Tên khách hàng</th>
                            <th>Email khách hàng</th>
                            <th>Nội dung phản hồi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            <>
                                {listFeedback.map((fb) => (
                                    <tr key={fb.id}>
                                        <td>
                                            {format(
                                                parseISO(fb.createdAt),
                                                'HH:mm:ss - d/M/yyyy'
                                            )}
                                        </td>
                                        <td>{fb.name}</td>
                                        <td>{fb.email}</td>
                                        <td>
                                            {!fb.readed ? (
                                                <>
                                                    <span className="fw-bold ">
                                                        Phản hồi mới{' '}
                                                    </span>
                                                    <FontAwesomeIcon
                                                        onClick={() =>
                                                            showFeedBack(fb)
                                                        }
                                                        icon="fa-regular fa-eye"
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <span className="me-2">
                                                        {fb.feedback.length > 5
                                                            ? `${fb.feedback.substring(
                                                                  0,
                                                                  5
                                                              )}...`
                                                            : fb.feedback}
                                                    </span>
                                                    <FontAwesomeIcon
                                                        onClick={() =>
                                                            handleUnreadFeedback(
                                                                fb.id
                                                            )
                                                        }
                                                        icon="fa-regular fa-eye-slash"
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                    />
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
