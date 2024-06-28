import { apiPrivate } from "../Ultils/AxiosCustomize"

export const getCart = ()=> {
    return apiPrivate.get('/carts/get')
}

export const addCart = (productDetailId) => {
    return apiPrivate.get('/carts/add', {
        params: {
            productDetailId: productDetailId,
        },
    });
};

export const updateCart = (productDetailId, quantity) => {
    return apiPrivate.put('/carts/update',null, {
        params: {
            productDetailId: productDetailId,
            quantity: quantity,
        },
    });
};

export const removeCart = (productDetailId) => {
    return apiPrivate.delete('/carts/remove', {
        params: { productDetailId: productDetailId },
    });
};

export const clearCart = () => {
    return apiPrivate.delete('/carts/clear');
};

export const getTotalItems = () => {
    return apiPrivate.get('/carts/getTotal');
};