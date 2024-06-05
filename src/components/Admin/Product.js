import React, { useEffect, useState } from "react";
import api from "../../ultils/axiosCustomize";
import { Table, InputGroup, FormControl, Button, Form } from 'react-bootstrap';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(1);
 
  useEffect(() => {
    fetchProducts();
  }, [page, keyword]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products", {
        params: {
          keyword: keyword,
          page: page,
        }
      });
      console.log(response.data);
      setProducts(response.data.productsRes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  const handlePageChange = (e) => {
    setPage(parseInt(e.target.value));
  };

  const renderPageOptions = () => {
    const options = [];
    for (let i = 1; i <= totalPages; i++) {
      options.push(
        <option key={i} value={i}>Page {i}</option>
      );
    }
    return options;
  };

  return (
    <>
      <h1>Product Page</h1>
      <div>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search products..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={() => setPage(1)}>Search</Button>
        </InputGroup>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.productName}</td>
              <td>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Form.Select value={page} onChange={handlePageChange}>
        {renderPageOptions()}
      </Form.Select>
    </>
  );
};

export default Product;