export default function AddProduct() {
  return (
    <>
      <h2>THÊM MỚI SẢN PHẨM</h2>
      <div className="mt-5 bg-white p-5 shadow border">
        <form>
          <div className="row">
            <div className="mb-3 col-6">
              <label for="product-id" className="form-label">
                Mã sản phẩm<span style={{ color: "red" }}>*</span>
              </label>
              <input type="text" className="form-control" id="product-id" />
              <span id="idError" className="text-danger"></span>
            </div>

            <div className="mb-3 col-6">
              <label for="pr-name" className="form-label">
                Tên sản phẩm<span style={{ color: "red" }}>*</span>
              </label>
              <input type="text" className="form-control" id="pr-name" />
              <span id="nameError" className="text-danger"></span>
            </div>

            <div className="mb-3 col-6">
              <label for="price" className="form-label">
                Giá tiền<span style={{ color: "red" }}>*</span>
              </label>
              <input type="text" className="form-control" id="price" />
              <span id="priceError" className="text-danger"></span>
            </div>

            <div className="mb-3 col-6">
              <label className="form-label">
                Danh mục sản phẩm<span style={{ color: "red" }}>*</span>
              </label>
              <select className="form-control category">
                <option value="">--Chọn danh mục--</option>
                <option></option>
              </select>
              <select className="form-control">
                <option value="">--Chọn danh mục--</option>
                <option></option>
              </select>
              <span id="categoryError" className="text-danger"></span>
            </div>

            <div className="mb-3 col-6">
              <label for="discount-price" className="form-label">
                Giá khuyến mãi
              </label>
              <input type="text" className="form-control" id="discount-price" />
              <span id="discountError" className="text-danger"></span>
            </div>

            <div className="mb-3 col-6">
              <label for="brand" className="form-label">
                Thương hiệu<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="brand"
                value="TORANO"
              />
              <span id="brandError" className="text-danger"></span>
            </div>

            <div className="mb-3">
              <label for="description" className="form-label">
                Mô tả
              </label>
              <textarea
                className="form-control"
                id="description"
                rows="4"
                cols="50"
              ></textarea>
            </div>

            <div className="mb-3">
              <label for="imgSize" className="form-label">
                Ảnh hướng dẫn chọn size<span style={{ color: "red" }}>*</span>
              </label>
              <select className="form-control" id="imgSize">
                <option></option>
              </select>
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
