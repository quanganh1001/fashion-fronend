import { apiPrivate } from "../Ultils/AxiosCustomize";

const getAllCategories = async () => {
    return await apiPrivate.get("categories");
};

const getChildCategories = async (catParentId) => {
  return await apiPrivate.get("categories/childCategories", {
    params: { catParentId: catParentId },
  });
    
};

const getCategory = async (id) => {
  return await apiPrivate.get("categories/" + id);

};

const createCategory = async (category) => {
  return await apiPrivate.post("categories", category);
  
}

const deleteCategory = async (id) => {
  return await apiPrivate.delete("categories/" + id);
  
};

const updateCategory = async (id, category) => {
  return await apiPrivate.put("categories/" + id, category);
}

const updateBackgroundCategory = async (id, formData) => {
  return await apiPrivate.post(
    "categories/upBackgroundImgCategory/" + id,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export {
  getAllCategories,
  getChildCategories,
  getCategory,
  deleteCategory,
  createCategory,
  updateCategory,
  updateBackgroundCategory,
};
