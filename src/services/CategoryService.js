import { apiPrivate } from "../Ultils/AxiosCustomize";

const getAllCategories = async () => {
    const response = await apiPrivate.get("categories");
    return response;
};


export { getAllCategories };
