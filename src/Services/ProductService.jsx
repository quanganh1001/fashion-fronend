import { apiPublic, apiPrivate } from "../Ultils/AxiosCustomize"

const getAllProducts = async (searchParams) => {
    const response = await apiPublic.get("products", {
      params: {
        keyword: searchParams.get("keyword"),
        page: searchParams.get("page"),
        limit: searchParams.get("limit"),
      },
    });

    return response;
};

const createProduct = async (data) => {
  return await apiPrivate.post("products", data)
}

 const deleteProduct = async (productId) => {
  return await apiPrivate.delete(`/products/${productId}`)
}

const getProduct = async (id) => {
  return await apiPublic.get('/products/'+id)
}

const updateProduct = async (id, product) => {
  console.log(product);
  return await apiPrivate.put("/products/" + id, product);
};

export {
  getAllProducts,
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
};