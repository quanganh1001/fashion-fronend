import axiosInstance from "../ultils/axiosCustomize"



const getAllProducts = async () => {
    try {
      const response = await axiosInstance.get('products');
      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      return { EC: 1, data: [] };
    }
}

export {getAllProducts}