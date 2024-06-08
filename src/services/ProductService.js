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
  return apiPrivate.delete(`/products/${productId}`).then((res) => {
    console.log(`Đã xóa thành công`);
    
  });
}

export {getAllProducts,createProduct, deleteProduct};