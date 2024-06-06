import { Dropdown, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import useModal from "../../CustomHooks/useModal";
import { deleteProduct } from "../../Services/ProductSerivce";
import React, { useEffect, useState } from "react";
import api from "../../Ultils/AxiosCustomize";
import { useMemo } from "react";


export default function Product() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalProduct, setTotalProduct] = useState();
  const [currenPage, setCurrenPage] = useState();



  useEffect(() => {
    fetchProducts();
  }, [page, keyword, pageSize]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products", {
        params: {
          keyword: keyword,
          page: page,
          limit: pageSize
        },
      });

      setProducts(response.data.productsRes);
      setTotalPages(response.data.totalPages);
      setCurrenPage(response.data.currenPage);
      setTotalProduct(response.data.totalProduct);

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const pageList = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i);
  }, [totalPages]);

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

    const searchForm = (e) => {
        e.preventDefault(); 
        const searchValue = e.target.elements.search.value; 
        setKeyword(searchValue)
    }


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

        <form className="d-flex" onSubmit={searchForm}>
          <input
            name="search"
            type="search"
            placeholder="Nhập tên sản phẩm hoặc mã sản phẩm"
            className="form-control me-2"
          />
          <button className="btn btn-dark col-5">Tìm kiếm</button>
        </form>

      </div>
      <div>
        <div className="table-responsive">
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
                      <Dropdown.Toggle variant="dark">
                        Action
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          as={Link}
                          to={`/admin/products/${p.id}/edit`}
                        >
                          View/Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDelete(p.id, p.title)}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="my-4 d-flex justify-content-between">
          <div>
            <select
              className="form-select"
              id="page-size"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
            >
              <option value="10">10 items</option>
              <option value="15">15 items</option>
              <option value="20">20 items</option>
              <option value="25">25 items</option>
            </select>
          </div>

          <Pagination>
            <Pagination.First onClick={() => setPage(0)} />
            <Pagination.Prev
              onClick={() => setPage(currenPage - 1)}
              disabled={currenPage === 0}
            />
            {pageList?.map((pageNo, i) => (
              <Pagination.Item
                key={i}
                onClick={() => setPage(pageNo)}
                active={currenPage === pageNo}
              >
                {pageNo + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setPage(currenPage + 1)}
              disabled={currenPage === pageList.length - 1}
            />
            <Pagination.Last onClick={() => setPage(pageList.length)} />
          </Pagination>
        </div>
      </div>
    </>
  );
}
