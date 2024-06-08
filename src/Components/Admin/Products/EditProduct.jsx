import { useState, useEffect } from "react";
import { getAllCategories } from "../../../Services/CategoryService";
import { getProduct, updateProduct } from "../../../Services/ProductService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();

  const [product, setProduct] = useState({
    productCode: "",
    productName: "",
    price: "",
    discountPrice: "",
    brand: "TORANO",
    description: "",
    imageChooseSize: "",
    isActivated: true,
  });

  const navigator = useNavigate();
  const [codeError, setCodeError] = useState("");
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [brandError, setBrandError] = useState("");
  const [imgSizeError, setImgSizeError] = useState("");
  const [discountPriceError, setDiscountPriceError] = useState("");

  const imgSizeOptions = [
    { value: "IMAGE_1", label: "Size áo polo" },
    { value: "IMAGE_2", label: "Size áo sơ mi" },
    { value: "IMAGE_3", label: "Size quần âu" },
    { value: "IMAGE_4", label: "Size quần jean + kaki" },
    { value: "IMAGE_5", label: "Size áo khoác" },
  ];

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await getProduct(id);

      setProduct({
        productCode: response.data.productCode,
        productName: response.data.productName,
        price: response.data.price,
        discountPrice: response.data.discountPrice,
        brand: response.data.brand,
        description: response.data.description,
        imageChooseSize: response.data.imageChooseSize,
        isActivated: response.data.isActivated,
      });
    } catch (error) {}
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const updateProductForm = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (product.productCode === "") {
      isValid = false;
      setCodeError("Mã sản phẩm không được để trống");
    } else {
      setCodeError("");
    }

    if (product.productName === "") {
      isValid = false;
      setNameError("Tên sản phẩm không được để trống");
    } else {
      setNameError("");
    }

    if (product.price === "") {
      isValid = false;
      setPriceError("Giá sản phẩm không được để trống");
    } else if (isNaN(product.price)) {
      isValid = false;
      setPriceError("Giá sản phẩm không hợp lệ");
    } else {
      setPriceError("");
    }

    if (product.discountPrice !== "" && isNaN(product.discountPrice)) {
      isValid = false;
      setDiscountPriceError("Giá sản phẩm không hợp lệ");
    } else {
      setDiscountPriceError("");
    }

    if (product.brand === "") {
      isValid = false;
      setBrandError("Thương hiệu không được để trống");
    } else {
      setBrandError("");
    }

    if (product.imageChooseSize === "") {
      isValid = false;
      setImgSizeError("Ảnh chọn size không được để trống");
    } else {
      setImgSizeError("");
    }

    if (isValid) {
      try {
        await updateProduct(id, product);
        navigator("/admin/products");
        toast.success("Lưu thành công!");
      } catch (error) {
        console.log(error);
        if (error.response.status === 409) {
          setCodeError("Mã sản phẩm đã tồn tại");
          toast.error("Mã sản phẩm đã tồn tại");
        }
      }
    }
  };

  return (
    <>
      <h2>Sửa sản phẩm</h2>
      <div className="mt-5 bg-white p-5 shadow border">
        <form onSubmit={updateProductForm}>
          <div className="row">
            <div className="mb-3">
              <label className="form-label">
                Mã sản phẩm<span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="productCode"
                name="productCode"
                value={product.productCode ?? ""}
                type="text"
                className={
                  codeError !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
                onChange={handleInputChange}
              />
              <span className="text-danger">{codeError}</span>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Tên sản phẩm<span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="productName"
                type="text"
                name="productName"
                className={
                  nameError !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
                value={product.productName ?? ""}
                onChange={handleInputChange}
              />
              <span className="text-danger">{nameError}</span>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Giá tiền<span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="price"
                type="text"
                className={
                  priceError !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
                name="price"
                value={product.price}
                onChange={handleInputChange}
              />
              <span className="text-danger">{priceError}</span>
            </div>

            <div className="mb-3">
              <label className="form-label">Giá khuyến mãi</label>
              <input
                id="discountPrice"
                type="text"
                className={
                  discountPriceError !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
                name="discountPrice"
                value={product.discountPrice ?? ""}
                onChange={handleInputChange}
              />
              <span className="text-danger">{discountPriceError}</span>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Thương hiệu<span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="brand"
                type="text"
                className={
                  brandError !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
                value={product.brand ?? ""}
                name="brand"
                onChange={handleInputChange}
              />
              <span className="text-danger">{brandError}</span>
            </div>

            <div className="mb-3">
              <label className="form-label">Mô tả</label>
              <textarea
                id="description"
                className="form-control"
                rows="4"
                cols="50"
                name="description"
                value={product.description ?? ""}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Ảnh hướng dẫn chọn size<span style={{ color: "red" }}>*</span>
              </label>
              <select
                id="imgSize"
                className={
                  imgSizeError !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
                value={product.imageChooseSize ?? ""}
                name="imageChooseSize"
                onChange={handleInputChange}
              >
                <option value="">--Chọn size--</option>
                {imgSizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="text-danger">{imgSizeError}</span>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Trạng thái<span style={{ color: "red" }}>*</span>
              </label>
              <input
                className="form-check-input bg-dark border-dark mx-2"
                type="checkbox"
                name="isActivated"
                checked={product.isActivated ?? true}
                onChange={(e) =>
                  setProduct({ ...product, isActivated: e.target.checked })
                }
              />
              {product.isActivated ? "Kích hoạt" : "Ẩn"}
            </div>
            <button
              type="submit"
              id="submit"
              className="col-2 btn btn-dark bg-gradient text-align-center"
            >
              Lưu lại
            </button>
          </div>
        </form>
      </div>
      <div></div>
    </>
  );
}
