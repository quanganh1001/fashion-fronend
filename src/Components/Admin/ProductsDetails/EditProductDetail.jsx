import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSize } from "../../../Services/SizeService.jsx";
import {
  updateProductDetail,
  getProductDetail,
} from "../../../Services/ProductDetailService";
import { toast } from "react-toastify";
import { getAllColors } from "../../../Services/ColorService";

export default function EditProductDetail() {
  const { id, pdid } = useParams();

  const navigate = useNavigate();

  const [listSize, setListSize] = useState([]);

  const [listColor, setListColor] = useState([]);

  const [sizeError, setSizeError] = useState("");

  const [codeError, setCodeError] = useState("");

  const [colorError, setColorError] = useState("");

  const [quantityError, setQuantityError] = useState("");

  const [productDetail, setProductDetail] = useState({
    code: "",
    quantity: "",
    size: "",
    colorId: "",
    productId: id,
  });

  useEffect(() => {
    fetchListSize();
    fetchListColor();
    fetchProductDetail();
  }, []);

  const fetchListSize = async () => {
    await getSize().then((res) => {
      setListSize(res.data);
    });
  };

  const fetchListColor = async () => {
    await getAllColors().then((res) => {
      setListColor(res.data);
    });
  };

  const fetchProductDetail = async () => {
      await getProductDetail(pdid).then((res) => {
      setProductDetail(res.data);
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

    if (productDetail.size === "") {
      isValid = false;
      setSizeError("Chưa chọn size");
    } else {
      setSizeError("");
    }

    if (productDetail.color === "") {
      isValid = false;
      setColorError("Chưa chọn màu");
    } else {
      setColorError("");
    }

    if (isValid) {
      console.log(productDetail);
      await updateProductDetail(productDetail)
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

            <div className="mb-3 col-6">
              <label className="form-label">
                Màu sắc<span style={{ color: "red" }}>*</span>
              </label>
              <select
                className={
                  sizeError !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
                              
                name="colorId"
                value={productDetail.colorId ?? ""}
                onChange={handleInputChange}
              >
                <option value="">--Chọn màu--</option>
                {listColor.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.colorCode} - {c.name}
                  </option>
                ))}
              </select>
              <span className="text-danger">{colorError}</span>
            </div>

            <div className="mb-3 col-6">
              <label className="form-label">
                Size<span style={{ color: "red" }}>*</span>
              </label>
              <select
                className={
                  sizeError !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
                value={productDetail.size ?? ""}
                name="size"
                onChange={handleInputChange}
              >
                <option value="">--Chọn size--</option>
                {listSize.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.value}
                  </option>
                ))}
              </select>
              <span className="text-danger">{sizeError}</span>
            </div>

            <button type="submit" className="col-2 btn btn-dark">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
