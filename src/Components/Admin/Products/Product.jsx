import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CustomPagination from "../../Fragments/CustomPagination";
import usePagination from "../../../CustomHooks/userPagination";
import SearchForm from "../../Fragments/SearchForm";
import { deleteProduct, getAllProducts } from "../../../Services/ProductService";
import useModal from "../../../CustomHooks/useModal";
import { toast } from "react-toastify";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState();
  const [currentPage, setCurrentPage] = useState();
  const { searchParams } = usePagination();
  const { openModal, closeModal } = useModal();
  
  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts(searchParams);
      setProducts(response.data.productsRes);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setTotalProducts(response.data.totalProduct);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = (productId) => {
      openModal(
          'Xóa sản phẩm',
          `Bạn có chắc muốn xóa sản phẩm này?`,
          () => {
              deleteProduct(productId)
                .then(() => {
                    toast.success("Xóa sản phẩm thành công!")
                    fetchProducts();
                  })
                  .catch((err => {
                      toast.error("Xảy ra lỗi!");
                  }));
              closeModal();
          },
      );
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <h1 className="">Sản phẩm</h1>
      </div>
      <hr />

      <div className="d-flex flex-wrap my-5 justify-content-between align-items-center">
        <div className="col">
          <Link to="/admin/products/add">
            <button className="btn btn-dark bg-gradient">Thêm sản phẩm</button>
          </Link>
        </div>

        <div className="col-5">
          <SearchForm placeholder={"Nhập tên sản phẩm hoặc mã sản phẩm"} />
        </div>
      </div>

      <table className="table table-striped table-hover table-bordered border">
        <thead>
          <tr>
            <th>Mã sản phẩm</th>
            <th>Tên sản phâm</th>
            <th>Danh mục</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="align-middle">
              <td>{p.productCode}</td>
              <td>{p.productName}</td>
              <td>{p.catName}</td>
              <td>{p.isActivated ? "Kích hoạt" : "Ẩn"}</td>
              <td>
                <Dropdown data-bs-theme="dark">
                  <Dropdown.Toggle variant="dark bg-gradient">
                    Hành động
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      as={Link}
                      to={`/admin/products/${p.id}/edit`}
                    >
                      Xem/Sửa
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(p.id)}>
                      Xóa
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CustomPagination
        totalPages={totalPages}
        currentPage={currentPage}
        totalProducts={totalProducts}
      />
    </>
  );
}