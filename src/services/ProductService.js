import api from "../Ultils/AxiosCustomize"

const getAllProducts = async () => {
    try {
      
      const response = await api.get('products');
      
      return response;
    } catch (error) {
      console.log("Error fetching products:", error);
      return { EC: 1, data: [] };
    }
}


 const deleteProduct = async (productId) => {
  return api.delete(`/products/${productId}`)
      .then(res => {
          console.log(`Đã xóa thành công`);
          console.log(res);
      });
}

export {getAllProducts, deleteProduct};