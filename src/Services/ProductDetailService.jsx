import { apiPublic, apiPrivate } from '../Ultils/AxiosCustomize';

export const getAllProductsDetails =  (productId) => {
    return  apiPublic.get('products/' + productId + '/productsDetail');
};

export const addProductDetail =  (data) => {
    return  apiPrivate.post('productsDetail', data);
};

export const updateProductDetail = (id, data) => {
    console.log(data);
    
    return  apiPrivate.put('productsDetail/' + id, data);
};

export const deleteProductDetail =  (id) => {
    return  apiPrivate.delete('productsDetail/' + id);
};

export const getProductDetail =  (id) => {
    return  apiPrivate.get('productsDetail/' + id);
};



export const findAllProductsDetailByKey =  (key,options) => {
    return  apiPrivate.get('productsDetail', {
        params: {
            key: key,
        },
        ...options,
    });
}