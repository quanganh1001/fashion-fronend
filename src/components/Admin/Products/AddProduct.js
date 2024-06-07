import { useState,useEffect } from "react";
import api from "../../../Ultils/AxiosCustomize";

export default function AddProduct() {
  const [product, setProduct] = useState({
    productCode: "",
    productName: "",
    price: "",
    category: "",
    discountPrice: "",
    brand: "TORANO",
    description: "",
    imgSize: "",
  });

  const [codeError, setCodeError] = useState(''); 
  const [nameError, setNameError] = useState(""); 
  const [priceError, setPriceError] = useState(""); 
  const [categoryError, setCategoryError] = useState(''); 
  const [brandError, setBrandError] = useState("");
  const [imgSizeError, setImgSizeError] = useState("");
  const [listCategories, setListCategories] = useState([]);

  const imgSizeOptions = [
    { value: "IMAGE_1", label: "Size áo polo" },
    { value: "IMAGE_2", label: "Size áo sơ mi" },
    { value: "IMAGE_3", label: "Size quần âu" },
    { value: "IMAGE_4", label: "Size quần jean + kaki" },
    { value: "IMAGE_5", label: "Size áo khoác" },
  ];

  useEffect(() => {
    fetchListCategories();
  }, []);

  const fetchListCategories = async () => {
    try {
      const response = await api.get("/categories");
      console.log(response);
      setListCategories(response)
    } catch (error) {
      console.error("Error fetching list categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const addProduct = (e) => {
    e.preventDefault();
    let isValid = true;

    if (product.productCode === '') {
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
    } else if (!(product.price).match(/^[0-9]+$/)) {
      setPriceError("Giá sản phẩm không hợp lệ");
    }else {
      setPriceError("");
    }

    if (product.category === "") {
      isValid = false;
      setCategoryError("Danh mục không được để trống")
    } else {
      setCategoryError("")
    }

    if (product.brand === "") {
      isValid = false;
      setBrandError("Thương hiệu không được để trống");
    } else {
      setBrandError("");
    }

    if (product.imgSize === "") {
      isValid = false;
      setImgSizeError("Ảnh chọn size không được để trống");
    } else {
      setImgSizeError("");
    }

  };

  return (
    <>
      <h2>THÊM MỚI SẢN PHẨM</h2>
      <div className="mt-5 bg-white p-5 shadow border">
        <form onSubmit={addProduct}>
          <div className="row">
            <div className="mb-3 col-6">
              <label className="form-label">
                Mã sản phẩm<span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="productCode"
                name="productCode"
                value={product.productCode}
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

            <div className="mb-3 col-6">
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
                value={product.productName}
                onChange={handleInputChange}
              />
              <span className="text-danger">{nameError}</span>
            </div>

            <div className="mb-3 col-6">
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

            <div className="mb-3 col-6">
              <label className="form-label">
                Danh mục sản phẩm<span style={{ color: "red" }}>*</span>
              </label>
              <select
                id="category"
                className={
                  categoryError !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
                value={product.category}
                name="category"
                onChange={handleInputChange}
              >
                <option value="">--Chọn danh mục--</option>
                {listCategories.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.catName}
                  </option>
                ))}
              </select>
              <span value={categoryError} className="text-danger"></span>
            </div>

            <div className="mb-3 col-6">
              <label className="form-label">Giá khuyến mãi</label>
              <input
                id="discountPrice"
                type="text"
                className="form-control"
                value={product.discountPrice}
                name="discountPrice"
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3 col-6">
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
                value={product.brand}
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
                value={product.description}
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
                value={product.imgSize}
                name="imgSize"
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

            <button
              type="submit"
              id="submit"
              className="col-2 btn btn-dark text-align-center"
            >
              Thêm sản phẩm
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
