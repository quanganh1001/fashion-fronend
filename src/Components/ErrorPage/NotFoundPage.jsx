import { Link } from "react-router-dom";


export default function NotFoundPage() {
  
  return (
      <>
          <div
              className="container-xl my-5 col-12 d-flex flex-column align-items-center justify-content-center"
              style={{ minHeight: '30vh' }}
      >
              
              <h1 className="mb-5">Không tìm thấy trang bạn yêu cầu!</h1>
              <Link to="/" className="btn btn-warning">
                  Về trang chủ
              </Link>
          </div>
      </>
  );
 }