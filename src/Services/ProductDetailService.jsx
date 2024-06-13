import { apiPublic, apiPrivate } from '../Ultils/AxiosCustomize';

const getAllProductsDetails = async (productId) => {
    return await apiPublic.get('products/' + productId + '/productsDetail');
};

const addProductDetail = async (data) => {
    return await apiPrivate.post('productsDetail', data);
};

const updateProductDetail = async (id, data) => {
    return await apiPrivate.put('productsDetail/' + id, data);
};

const deleteProductDetail = async (id) => {
    return await apiPrivate.delete('productsDetail/' + id);
};

const getProductDetail = async (id) => {
    return await apiPrivate.get('productsDetail/' + id);
};

export {
    getAllProductsDetails,
    deleteProductDetail,
    addProductDetail,
    updateProductDetail,
    getProductDetail,
};
