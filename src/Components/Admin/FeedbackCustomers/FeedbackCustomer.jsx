import { useState, useEffect } from 'react';
import {
    getAllFeedback,
    readFeedback,
    unread,
} from '../../../Services/FeedbackCustomerService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseISO, format } from 'date-fns';
import useModal from '../../../CustomHooks/useModal';
import { toast } from 'react-toastify';
import CustomPagination from '../../Fragments/CustomPagination';
import usePagination from '../../../CustomHooks/usePagination';

export default function FeedbackCustomer() {
    const [listFeedback, setListFeedback] = useState([]);
    const { openModal } = useModal();
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState();
  const [currentPage, setCurrentPage] = useState();
      const { searchParams } = usePagination();

  useEffect(() => {
      fetchAllFeedback();
  }, [searchParams]);

    const fetchAllFeedback = () => {
      getAllFeedback(searchParams).then((res) => {
          setListFeedback(res.data.feedbackCustomers);
          setTotalPages(res.data.totalPages);
          setCurrentPage(res.data.currentPage);
          setTotalItems(res.data.totalItems);
      });
    };

    const showFeedBack = (fb) => {
        readFeedback(fb.id)
          .then(() => {
              fetchAllFeedback();
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
  };
  
  const handleUnread = (id) => {
    unread(id).then(() => {
      fetchAllFeedback()
      toast.success("Đã đánh dấu là chưa đọc")
    }).catch((err) => {
      console.error(err);
      toast.error('Không thể đóng');
    })
  }
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
                                                onClick={() => showFeedBack(fb)}
                                                icon="fa-regular fa-eye"
                                                style={{ cursor: 'pointer' }}
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
                                                    handleUnread(fb.id)
                                                }
                                                icon="fa-regular fa-eye-slash"
                                                style={{ cursor: 'pointer' }}
                                            />
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
                    totalItems={totalItems}
                />
            </div>
        </>
    );
}
