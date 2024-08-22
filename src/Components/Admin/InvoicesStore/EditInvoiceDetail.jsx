// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import {
//     getAllHistory,
//     getInvoice,
//     updateInvoice,
// } from '../../../Services/InvoiceService';
// import { parseISO, format } from 'date-fns';
// import { getAllInvoiceStatus } from '../../../Services/EnumService';
// import { getAllEmployees } from '../../../Services/AccountService';
// import { toast } from 'react-toastify';

// import LoadingSpinner from '../../Fragments/LoadingSpinner';
// import useAuth from '../../../CustomHooks/useAuth';
// import Title from '../../Fragments/Title';
// import useModal from '../../../CustomHooks/useModal';

// export default function EditInvoiceDetailStore() {
//     const { id } = useParams();

//     const { openModal, closeModal } = useModal();

//     const [inputInvoice, setInputInvoice] = useState({
//         name: '',
//         phone: '',
//         address: '',
//         note: '',
//         accountId: '',
//         invoiceStatus: '',
//         isPaid: '',
//     });

//     const [listInvoicesDetail, setListInvoicesDetail] = useState([]);

//     const [invoice, setInvoice] = useState('');

//     const [nameError, setNameError] = useState('');
//     const [addressError, setAddressError] = useState('');
//     const [accountError, setAccountError] = useState('');
//     const [isLoadingInvoice, setIsLoadingInvoice] = useState(true);
//     const [isLoadingDetail, setIsLoadingDetail] = useState(true);
//     const [isLoadingButton, setIsLoadingButton] = useState(false);
//     const [listInvoiceStatus, setListInvoiceStatus] = useState([]);

//     const [listEmployees, setListEmployees] = useState([]);
//     const { auth } = useAuth();
//     useEffect(() => {
//         fetchGetAllInvoicesStatus();
//         if (auth.account.role === 'ROLE_MANAGER') {
//             fetchGetAllEmployee();
//         }
//     }, [inputInvoice]);

//     useEffect(() => {
//         fetchInvoice();
//     }, []);

//     const fetchInvoice = () => {
//         setIsLoadingDetail(true);
//         getInvoice(id)
//             .then((res) => {
//                 setInputInvoice({
//                     name: res.data.name,
//                     phone: res.data.phone,
//                     address: res.data.address,
//                     note: res.data.note,
//                     accountId: res.data.accountId,
//                     invoiceStatus: res.data.invoiceStatus,
//                     isPaid: res.data.isPaid,
//                 });
//                 setInvoice(res.data);
//                 setListInvoicesDetail(res.data.invoicesDetails);
//             })
//             .catch((err) => {
//                 console.error(err);
//             })
//             .finally(() => {
//                 setIsLoadingInvoice(false);
//                 setIsLoadingDetail(false);
//             });
//     };

//     const fetchGetAllEmployee = () => {
//         getAllEmployees()
//             .then((res) => {
//                 setListEmployees(res.data);
//             })
//             .catch((err) => {
//                 console.error(err);
//             });
//     };

//     const fetchGetAllInvoicesStatus = () => {
//         getAllInvoiceStatus()
//             .then((res) => {
//                 setListInvoiceStatus(res.data);
//             })
//             .catch((err) => {
//                 console.error(err);
//             });
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setInputInvoice({ ...inputInvoice, [name]: value });
//     };

//     const updateForm = (e) => {
//         e.preventDefault();
//         let isValid = true;

//         if (inputInvoice.name === '') {
//             isValid = false;
//             setNameError('Tên không được để trống');
//         } else {
//             setNameError('');
//         }

//         if (inputInvoice.address === '') {
//             isValid = false;
//             setAddressError('Địa chỉ không được để trống');
//         } else {
//             setAddressError('');
//         }

//         if (inputInvoice.accountId === 'null' || !inputInvoice.accountId) {
//             isValid = false;
//             setAccountError('Vui lòng chọn nhân viên');
//         } else {
//             setAccountError('');
//         }

//         if (isValid) {
//             setIsLoadingButton(true);

//             updateInvoice(id, inputInvoice)
//                 .then(() => {
//                     fetchInvoice();
//                     toast.success('Cập nhập thành công');
//                 })
//                 .catch((err) => {
//                     toast.error(err.response.data);
//                 })
//                 .finally(() => {
//                     setIsLoadingButton(false);
//                 });
//         }
//     };

//     const checkStatusInvoice = (status) => {
//         if (
//             status === 'Đơn đã lên' ||
//             status === 'Đơn đang chuyển' ||
//             status === 'Đơn thành công' ||
//             status === 'Đơn hoàn'
//         ) {
//             return true;
//         } else return false;
//     };

//     const getHistory = () => {
//         getAllHistory(id)
//             .then((res) => {
//                 openModal(
//                     'Lịch sử đơn hàng',
//                     res.data.length > 0 ? (
//                         <ul>
//                             {res.data.map((h) => (
//                                 <li key={h.content}>
//                                     {' '}
//                                     <span
//                                         dangerouslySetInnerHTML={{
//                                             __html: h.content,
//                                         }}
//                                     ></span>
//                                     <div className="fw-lighter fs-9 mb-4">
//                                         {h.createAt}
//                                     </div>
//                                 </li>
//                             ))}
//                         </ul>
//                     ) : (
//                         <div>Chưa có thông tin</div>
//                     ),
//                     true,
//                     () => {}
//                 );
//             })
//             .catch((err) => {
//                 console.error(err);
//             });
//     };

//     const showHistory = () => {
//         getHistory();
//         closeModal();
//     };

//     return (
//         <>
//             <Title title="Chi tiết đơn hàng" />
//             <div className="mt-5 bg-white p-5 shadow border">
//                 <div className="col-12 mb-3">
//                     {isLoadingInvoice ? (
//                         <LoadingSpinner />
//                     ) : (
//                         <form
//                             onSubmit={updateForm}
//                             className="d-flex flex-wrap justify-content-between align-items-center row"
//                         >
//                             <div className="mb-5 d-flex flex-wrap justify-content-between align-items-center">
//                                 {invoice ? (
//                                     <div className="col-3">
//                                         Ngày tạo:{' '}
//                                         <span className="fw-bolder">
//                                             {format(
//                                                 parseISO(invoice.createdAt),
//                                                 'HH:mm:ss -d/M/yyyy'
//                                             )}
//                                         </span>
//                                         <div className=" d-flex mt-3">
//                                             Mã đơn hàng:{'   '}
//                                             <span className="fw-bolder">
//                                                 {invoice.invoiceCode}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 ) : (
//                                     ''
//                                 )}

//                                 {auth.account.role === 'ROLE_MANAGER' && (
//                                     <div className="mb-3 col-3">
//                                         <label className="form-label">
//                                             Nhân viên phụ trách:{' '}
//                                             <span style={{ color: 'red' }}>
//                                                 *
//                                             </span>
//                                         </label>

//                                         <select
//                                             className={`form-control ${
//                                                 accountError
//                                                     ? 'border-danger'
//                                                     : ''
//                                             } `}
//                                             onChange={handleInputChange}
//                                             name="accountId"
//                                             value={
//                                                 invoice
//                                                     ? inputInvoice.accountId
//                                                     : 'null'
//                                             }
//                                         >
//                                             <option value="null">
//                                                 Chưa chọn
//                                             </option>
//                                             {listEmployees.map((emlp) => (
//                                                 <option
//                                                     key={emlp.id}
//                                                     value={emlp.id}
//                                                 >
//                                                     {emlp.name}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         <span className="text-danger">
//                                             {accountError}
//                                         </span>
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="mb-3 col-6">
//                                 <label className="form-label">
//                                     Tên khách hàng
//                                     <span style={{ color: 'red' }}>*</span>
//                                 </label>
//                                 {!checkStatusInvoice(invoice.invoiceStatus) ? (
//                                     <>
//                                         <input
//                                             value={inputInvoice.name}
//                                             name="name"
//                                             onChange={handleInputChange}
//                                             className={`form-control ${
//                                                 nameError ? 'border-danger' : ''
//                                             } `}
//                                         />
//                                         <span className="text-danger">
//                                             {nameError}
//                                         </span>
//                                     </>
//                                 ) : (
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         disabled
//                                         value={inputInvoice.name}
//                                     />
//                                 )}
//                             </div>

//                             <div className="mb-3 col-6">
//                                 <label className="form-label">
//                                     Số điện thoại
//                                     <span style={{ color: 'red' }}>*</span>
//                                 </label>

//                                 <input
//                                     value={inputInvoice.phone}
//                                     type="text"
//                                     disabled
//                                     className="form-control"
//                                 />
//                             </div>

//                             <div className="mb-3 col-12">
//                                 <label className="form-label">
//                                     Địa chỉ
//                                     <span style={{ color: 'red' }}>*</span>
//                                 </label>
//                                 {!checkStatusInvoice(invoice.invoiceStatus) ? (
//                                     <>
//                                         <input
//                                             value={inputInvoice.address}
//                                             name="address"
//                                             onChange={handleInputChange}
//                                             className={`form-control ${
//                                                 addressError
//                                                     ? 'border-danger'
//                                                     : ''
//                                             } `}
//                                         />
//                                     </>
//                                 ) : (
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         disabled
//                                         value={inputInvoice.address}
//                                     />
//                                 )}

//                                 <span className="text-danger">
//                                     {addressError}
//                                 </span>
//                             </div>

//                             <div className="mb-3 col-6">
//                                 <label className="form-label">
//                                     Ghi chú nội bộ
//                                 </label>
//                                 <textarea
//                                     name="note"
//                                     value={inputInvoice.note}
//                                     onChange={handleInputChange}
//                                     className="form-control"
//                                     rows="4"
//                                     cols="50"
//                                 ></textarea>
//                             </div>

//                             <div className="mb-3 col-6">
//                                 <label className="form-label">
//                                     Ghi chú của khách hàng: {'  '}
//                                 </label>
//                                 <textarea
//                                     disabled
//                                     value={invoice.customerNote}
//                                     className="form-control"
//                                     rows="4"
//                                     cols="50"
//                                 ></textarea>
//                             </div>

//                             <div className="mb-3 col-6">
//                                 <label className="form-label">
//                                     Trạng thái đơn hàng: {'  '}
//                                 </label>

//                                 <select
//                                     className="form-control"
//                                     onChange={handleInputChange}
//                                     name="invoiceStatus"
//                                     value={inputInvoice.invoiceStatus}
//                                 >
//                                     {listInvoiceStatus.map((status) => (
//                                         <option
//                                             key={status.key}
//                                             value={status.value}
//                                         >
//                                             {status.value}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="mb-3">
//                                 <input
//                                     className="form-check-input bg-dark border-dark mx-2"
//                                     type="checkbox"
//                                     name="isPaid"
//                                     checked={inputInvoice.isPaid ?? false}
//                                     onChange={(e) =>
//                                         setInputInvoice({
//                                             ...inputInvoice,
//                                             isPaid: e.target.checked,
//                                         })
//                                     }
//                                 />
//                                 {inputInvoice.isPaid ? (
//                                     <span>'Đã thanh toán'</span>
//                                 ) : (
//                                     <span>'Chưa thanh toán'</span>
//                                 )}
//                             </div>

//                             <div className="d-flex justify-content-between">
//                                 <button
//                                     disabled={isLoadingButton}
//                                     style={{ textAlign: 'center' }}
//                                     type="submit"
//                                     className="mt-3 button col-4"
//                                 >
//                                     Cập nhập đơn hàng
//                                 </button>
//                                 {isLoadingButton && <LoadingSpinner />}
//                                 <div
//                                     onClick={() => showHistory()}
//                                     className=" text-decoration-underline"
//                                     style={{ cursor: 'pointer' }}
//                                 >
//                                     Xem lịch sử đơn hàng
//                                 </div>
//                             </div>
//                         </form>
//                     )}
//                 </div>
//             </div>

//             <div className="col-12">
//                 {/* {isLoadingDetail ? (
//                     <LoadingSpinner />
//                 ) : (
//                     // <InvoiceDeta
//                     //     checkStatusInvoice={checkStatusInvoice}
//                     //     id={id}
//                     //     listInvoicesDetail={listInvoicesDetail}
//                     // />
//                 )} */}
//             </div>
//         </>
//     );
// }
