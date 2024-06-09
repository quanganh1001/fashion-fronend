import { useState, useEffect } from "react";
import {
  deleteCategory,
  getCategory,
  getChildCategories,
} from "../../../Services/CategoryService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AlertLink, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import useModal from "../../../CustomHooks/useModal";
import { toast } from "react-toastify";

export default function Category() {
  const [id, setId] = useState("");

  const [oldCatName, setOldCatName] = useState("");

  const [categories, setCategories] = useState([]);

  const { openModal, closeModal } = useModal();

  useEffect(() => {
    fetchListCategories();
  }, [id]);

  const fetchListCategories = async () => {
    await getChildCategories(id)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchOldCategory = async () => {
    await getCategory(id)
      .then((res) => {
        setId(res.data.catParent);
        setOldCatName(res.data.catParentName);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDelete = (id) => {
    openModal("Xóa sản phẩm", `Bạn có chắc muốn xóa sản phẩm này?`, () => {
      deleteCategory(id)
        .then(() => {
          toast.success("Xóa thành công!");
          fetchListCategories();
        })
        .catch((error) => {
          toast.error("Không thể xóa!");
        });
      closeModal();
    });
  };

  return (
    <>
      <h1>Danh mục sản phẩm </h1>
      <hr />
      <div className="mt-5 bg-white p-5 shadow border">
        <div>
          <span className="text-dark link-underline-dark link-underline-opacity-0 link-underline-opacity-100-hover">
            <i className="fa-solid fa-arrow-left"></i>
          </span>
          <span
            href="/admin/category?parent="
            className="text-dark link-underline-dark link-underline-opacity-0 link-underline-opacity-100-hover"
          ></span>
          <div className="mt-3 mb-5">
            <span>
              <Link to="/admin/categories/add">
                <button className="btn btn-dark bg-gradient">
                  Thêm danh mục
                </button>
              </Link>
            </span>
          </div>
        </div>
        {id ? (
          <div
            className=" my-3"
            onClick={() => {
              fetchOldCategory();
            }}
          >
            <FontAwesomeIcon icon="fa-solid fa-backward" />
            <AlertLink className="ms-2 link-dark">{oldCatName}</AlertLink>
          </div>
        ) : (
          ""
        )}
        <table className="table table-striped table-hover table-bordered border">
          <thead>
            <tr>
              <th>Mã danh mục</th>
              <th>Tên danh mục</th>
              <th>Nằm trong danh mục</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr className="bg-body-secondary">
                <td colSpan="7" className="text-center">
                  Không có danh mục con
                </td>
              </tr>
            ) : null}

            {categories.map((cat) => (
              <tr key={cat.id}>
                <td
                  onClick={() => {
                    setId(cat.id);
                    setOldCatName(cat.catName);
                  }}
                >
                  <AlertLink className="ms-2 link-dark">
                    {cat.categoryCode}{" "}
                    <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" />
                  </AlertLink>
                </td>
                <td>{cat.catName}</td>
                <td>{cat.catParentName ?? "Không"}</td>
                <td>{cat.isActivated ? "Kích hoạt" : "Ẩn"}</td>
                <td>
                  <Dropdown data-bs-theme="dark">
                    <Dropdown.Toggle variant="dark bg-gradient">
                      Hành động
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        as={Link}
                        to={`/admin/categories/${cat.id}/edit`}
                      >
                        Xem/Sửa
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDelete(cat.id)}>
                        Xóa
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
