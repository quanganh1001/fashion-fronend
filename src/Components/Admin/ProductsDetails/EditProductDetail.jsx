import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateProductDetail,
  getProductDetail,
} from "../../../Services/ProductDetailService";
import { toast } from "react-toastify";


export default function EditProductDetail() {
  const { id, pdid } = useParams();

  const navigate = useNavigate();

  const [codeError, setCodeError] = useState("");

  const [quantityError, setQuantityError] = useState("");

  const [productDetail, setProductDetail] = useState({
    code: "",
    quantity: "",
    isActivated: "",
  });

  useEffect(() => {
    fetchProductDetail();
  }, []);


  const fetchProductDetail = async () => {
      await getProductDetail(pdid).then((res) => {
        setProductDetail({
          code: res.data.code,
          quantity: res.data.quantity,
          isActivated: res.data.isActivated,
        });
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetail({ ...productDetail, [name]: value });
  };

  const updateProductDetailForm = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (productDetail.code === "") {
      isValid = false;
      setCodeError("Mã phân loại sản phẩm không được để trống");
    } else {
      setCodeError("");
    }

    if (productDetail.quantity === "") {
      isValid = false;
      console.log("Số lượng không được để trống");
      setQuantityError("Số lượng không được để trống");
    } else if (productDetail.quantity !== "" && isNaN(productDetail.quantity)) {
      console.log("Số lượng không đúng định dạng");
      isValid = false;
      setQuantityError("Số lượng không đúng định dạng");
    } else if (productDetail.quantity !== "" && productDetail.quantity < 0) {
      isValid = false;
      setQuantityError("Số lượng không đúng định dạng");
    } else {
      setQuantityError("");
    }

    if (isValid) {
      console.log(productDetail);
      await updateProductDetail(pdid,productDetail)
        .then((res) => {
          toast.success("Sửa thành công");
          navigate(`/admin/products/${id}/edit`);
        })
        .catch((error) => {
          toast.error("Có lỗi xảy ra, không thể sửa");
          console.error(error);
        });
    }
  };

 

  return (
    <>
      <h1>Sửa mã phân loại</h1>
      <hr />
      <div className="mt-5 bg-white p-5 shadow border">
        <form onSubmit={updateProductDetailForm}>
          <div className="row">
            <div className="mb-3 col-6">
              <label className="form-label">
                Mã code chi tiết sản phẩm
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="code"
                value={productDetail.code ?? ""}
                onChange={handleInputChange}
                className={
                  codeError !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
              />
              <span className="text-danger">{codeError}</span>
            </div>

            <div className="mb-3 col-6">
              <label className="form-label">
                Số lượng<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="quantity"
                value={productDetail.quantity ?? ""}
                onChange={handleInputChange}
                className={
                  quantityError !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
              />
              <span className="text-danger">{quantityError}</span>
            </div>
            <div className="mb-3">
              <label className="form-label">
                Trạng thái<span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="form-check-input bg-dark border-dark mx-2"
                type="checkbox"
                name="isActivated"
                checked={productDetail.isActivated ?? true}
                onChange={(e) =>
                  setProductDetail({
                    ...productDetail,
                    isActivated: e.target.checked,
                  })
                }
              />
              {productDetail.isActivated ? "Kích hoạt" : "Ẩn"}
            </div>

            <button type="submit" className="col-2 button">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
