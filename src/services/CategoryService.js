import api from "../Ultils/AxiosCustomize";

const getAllCategories = async () => {
  try {
    const response = await api.get("categories");

    return response;
  } catch (error) {
    console.log("Error fetching categories:", error);
  }
};


export { getAllCategories };
