import { apiPublic, apiPrivate } from "../Ultils/AxiosCustomize";

const getAllProductsDetails = async (productId) => {
  const response = await apiPublic.get(
    "products/" + productId + "/productsDetail"
  );
  return response;
};

const deleteProductDetail = async (id) => {
  const response = await apiPrivate.delete("productsDetail/" + id);
  return response;
};

export { getAllProductsDetails, deleteProductDetail };