import { apiPublic, apiPrivate } from '../Ultils/AxiosCustomize';

export const getAllProducts = async (searchParams) => {
    const response = await apiPublic.get('products', {
        params: {
            keyword: searchParams.get('keyword'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        },
    });

    return response;
};

export const createProduct = async (data) => {
    return await apiPrivate.post('products', data);
};

export const deleteProduct = async (productId) => {
    return await apiPrivate.delete(`/products/${productId}`);
};

export const getProduct = async (id) => {
    return await apiPublic.get('/products/' + id);
};

export const updateProduct = async (id, product) => {
    return await apiPrivate.put('/products/' + id, product);
};

export const getAllImageProducts = async (id) => {
    return await apiPublic.get('products/' + id + '/images');
};

export const createImage = async (productId, formData) => {
    return await apiPrivate.post(
        `products/${productId}/createImage`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
   
};

export const updateImageBackground = async (productId, imageUrl) => {
    return await apiPrivate.put(
        `products/${productId}/updateProductBackground`,
        imageUrl,
        {
            headers: {
                'Content-Type': 'text/plain',
            },
        }
    );
    
};

export const getAllProductByCategory = async (catId) => {
    return await apiPublic.get(`products/getByCategory/`+catId);
    
};

