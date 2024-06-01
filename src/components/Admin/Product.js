import { useEffect,useState } from "react";
import { getAllProducts } from "../../services/apiService";

const Product = (props) => {
  const [listProducts, setListProducts] = useState([])

  useEffect(() => {
    fetchListProduct();
  }, []);

  const fetchListProduct = async () => {
    let res = await getAllProducts();
    if (res.EC === 0) {
      setListProducts(res.data);
    }
  };

  return (
    <div>
      <div>Product</div>
      <table>
        <thead>
          <tr key="">
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {listProducts &&
            listProducts.length > 0 &&
            listProducts.map((item, index) => {
              return (
                <tr>
                  <td>{item.productsRes.productName}</td>
                  <td>{item.productsRes.price}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};
export default Product;
