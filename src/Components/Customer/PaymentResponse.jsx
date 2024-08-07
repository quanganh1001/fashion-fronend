import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useCart from '../../CustomHooks/useCart';
import { Helmet } from 'react-helmet-async';

export default function PaymentResponse() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const success = queryParams.get('success');
    const { handleClearCart } = useCart();
    useEffect (()=> {
        if (success === '1') {
            handleClearCart();
        }
    }, [])
    
   
    return (
        <>
            <Helmet>
                <title>Thanh toán</title>
            </Helmet>
            <div className="d-flex my-5 flex-column align-items-center">
                {success === '1' ? (
                    <>
                        <div className='col-2'>
                            <img
                                className="col-12"
                                src={
                                    process.env.PUBLIC_URL +
                                    '/success-icon-10-300x300.png'
                                }
                                alt=""
                            />
                        </div>
                        <h1 className="mt-5">Đặt hàng thành công</h1>
                        <Link to="/" className="text-dark">
                            Về trang chủ
                        </Link>
                    </>
                ) : (
                    <div>Đặt hàng thất bại</div>
                )}
            </div>
        </>
    );
}
