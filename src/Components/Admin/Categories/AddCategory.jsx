import { useState, useEffect } from "react";
import {
  createCategory,
  getAllCategories,
} from "../../../Services/CategoryService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
  const [category, setCategory] = useState({
    categoryCode: "",
    catName: "",
    catParent: "",
  });

  const [listCategories, setListCategories] = useState([]);

  const navigator = useNavigate();
  const [categoryCodeErorr, setCategoryCodeErorr] = useState("");
  const [catNameErorr, setCatNameErorr] = useState("");

  useEffect(() => {
    fetchListCategories();
  }, []);

  const fetchListCategories = async () => {
    try {
      const response = await getAllCategories();
      setListCategories(response.data);
    } catch (error) {
      console.error("Error fetching list categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const addCategoryForm = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (category.categoryCode === "") {
      isValid = false;
      setCategoryCodeErorr("Mã danh mục không được để trống");
    } else {
      setCategoryCodeErorr("");
    }

    if (category.catName === "") {
      isValid = false;
      setCatNameErorr("Tên danh mục không được để trống");
    } else {
      setCatNameErorr("");
    }

    if (isValid) {
      await createCategory(category)
        .then(() => {
          navigator("/admin/categories");
          toast.success("Thêm mới thành công");
        })
        .catch((error) => {
          if (error.response.status === 409) {
            if (error.response.data.startsWith("Category code")) {
              setCategoryCodeErorr("Mã danh mục đã tồn tại");
              toast.error("Mã danh mục đã tồn tại");
            } else {
              setCatNameErorr("Tên danh mục đã tồn tại");
              toast.error("Tên danh mục đã tồn tại");
            }
          }
        });
    }
  };

  return (
    <>
      <h2>Thêm mới danh mục</h2>
      <div className="mt-5 bg-white p-5 shadow border">
        <form onSubmit={addCategoryForm}>
          <div className="row">
            <div className="mb-3 col-6">
              <label className="form-label">
                Mã danh mục<span style={{ color: "red" }}>*</span>
              </label>
              <input
                name="categoryCode"
                value={category.categoryCode}
                type="text"
                className={
                  categoryCodeErorr !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
                onChange={handleInputChange}
              />
              <span className="text-danger">{categoryCodeErorr}</span>
            </div>

            <div className="mb-3 col-6">
              <label className="form-label">
                Tên danh mục<span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="catName"
                className={
                  catNameErorr !== ""
                    ? "border-danger form-control"
                    : "form-control"
                }
                value={category.catName}
                onChange={handleInputChange}
              />
              <span className="text-danger">{catNameErorr}</span>
            </div>

            <div className="mb-3 col-6">
              <label className="form-label">Nằm trong danh mục</label>
              <select
                className="form-control"
                value={category.catParent}
                name="catParent"
                onChange={handleInputChange}
              >
                <option value="">Không</option>
                {listCategories.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.categoryCode} - {option.catName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 mt-5">
              <button
                type="submit"
                className="col-2 btn btn-dark bg-gradient text-align-center"
              >
                Thêm danh mục
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
