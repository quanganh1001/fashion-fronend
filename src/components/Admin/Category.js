import { Dropdown, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import useModal from "../../CustomHooks/useModal";
import { deleteProduct } from "../../Services/ProductSerivce";
import React, { useEffect, useState } from "react";
import api from "../../Ultils/AxiosCustomize";
import CustomPagination from "../Fragments/CustomPagination";
import usePagination from "../../CustomHooks/userPagination";
import SearchForm from "../Fragments/SearchForm";

export default function Category() {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState();
  const [currenPage, setCurrenPage] = useState();
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
      setCurrenPage(response.data.currenPage);
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
      <h1>Sản phẩm</h1>
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <Link to="/admin/products/add">
            <i className="bi bi-plus-circle-fill btn btn-link fs-1"></i>
          </Link>
        </div>

        <SearchForm placeholder={"Nhập tên sản phẩm hoặc mã sản phẩm"} />
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá tiền </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="align-middle">
              <td>{p.id}</td>
              <td>{p.productName}</td>
              <td>{p.price} $</td>
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
        currenPage={currenPage}
        totalProducts={totalProducts}
      />
    </>
  );
}
