import instance from "../ultils/axiosCustomize"

const getAllProducts = async () => {
    try {
      
      const response = await instance.get('products');
      
      return response;
    } catch (error) {
      console.log("Error fetching products:", error);
      return { EC: 1, data: [] };
    }
}

export {getAllProducts};