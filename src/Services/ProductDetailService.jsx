import { apiPublic, apiPrivate } from '../Ultils/AxiosCustomize';

export const getAllProductsDetails = async (productId) => {
    return await apiPublic.get('products/' + productId + '/productsDetail');
};

export const addProductDetail = async (data) => {
    return await apiPrivate.post('productsDetail', data);
};

export const updateProductDetail = async (id, data) => {
    return await apiPrivate.put('productsDetail/' + id, data);
};

export const deleteProductDetail = async (id) => {
    return await apiPrivate.delete('productsDetail/' + id);
};

export const getProductDetail = async (id) => {
    return await apiPrivate.get('productsDetail/' + id);
};



export const findAllProductsDetailByKey = async (key) => {
    return await apiPrivate.get('productsDetail', {
        params: {
            key: key,
        },
    });
}