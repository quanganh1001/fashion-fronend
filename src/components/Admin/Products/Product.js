import { Dropdown, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../../../Ultils/AxiosCustomize";
import CustomPagination from "../../Fragments/CustomPagination";
import usePagination from "../../../CustomHooks/userPagination";
import SearchForm from "../../Fragments/SearchForm";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState();
  const [currentPage, setCurrentPage] = useState();
  const { searchParams } = usePagination();

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products", {
        params: {
          keyword: searchParams.get("search"),
          page: searchParams.get("page"),
          limit: searchParams.get("size"),
        },
      });

      setProducts(response.data.productsRes);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setTotalProducts(response.data.totalProduct);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = (productId, productTitle) => {
    //   openModal(
    //       'Xóa sản phẩm',
    //       `Bạn có chắc muốn xóa ${productTitle}?`,
    //       () => {
    //           deleteProduct(productId)
    //               .then(() => {
    //                 fetchProducts();
    //               })
    //               .catch((err => {
    //                   console.log(err.response.data);
    //               }));
    //           closeModal();
    //       },
    //   );
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
            <button className="btn btn-dark">Thêm sản phẩm</button>
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
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="align-middle">
              <td>{p.productCode}</td>
              <td>{p.productName}</td>
              <td>{p.catName}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="dark">Hành động</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      as={Link}
                      to={`/admin/products/${p.id}/edit`}
                    >
                      Xem/Sửa
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(p.id, p.title)}>
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
        currenPage={currentPage}
        totalProducts={totalProducts}
      />
    </>
  );
}
