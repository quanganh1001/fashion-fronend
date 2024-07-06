import { apiPrivate, apiPublic } from '../Ultils/AxiosCustomize';

const getAllCategories =  () => {
    return  apiPublic.get('categories');
};

const getChildCategories =  (catParentId) => {
    return  apiPrivate.get('categories/childCategories', {
        params: { catParentId: catParentId },
    });
};

const getCategory =  (id) => {
    return  apiPrivate.get('/categories/' + id);
};

const createCategory =  (category) => {
    return  apiPrivate.post('categories', category);
};

const deleteCategory = (id) => {
    return  apiPrivate.delete('categories/' + id);
};

const updateCategory =  (id, category) => {
    return  apiPrivate.put('categories/' + id, category);
};

const updateBackgroundCategory =  (id, formData) => {
    return  apiPrivate.post(
        'categories/upBackgroundImgCategory/' + id,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
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
