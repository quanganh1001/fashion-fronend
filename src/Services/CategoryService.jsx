import { apiPrivate } from "../Ultils/AxiosCustomize";

const getAllCategories = async () => {
    const response = await apiPrivate.get("categories");
    return response;
};

const getChildCategories = async (catParentId) => {
  const response = await apiPrivate.get("categories/childCategories", {
    params: { catParentId: catParentId },
  });
    return response;
};

const getCategory = async (id) => {
  const response = await apiPrivate.get("categories/"+id);
  return response;
};

const createCategory = async (category) => {
  const response = await apiPrivate.post("categories", category);
  return response;
}

const deleteCategory = async (id) => {
  const response = await apiPrivate.delete("categories/" + id);
  return response;
};

export {
  getAllCategories,
  getChildCategories,
  getCategory,
  deleteCategory,
  createCategory,
};
