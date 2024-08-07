import { apiPublic, apiPrivate } from '../Ultils/AxiosCustomize';

export const getAllProducts =  (searchParams) => {
    const response =  apiPrivate.get('products', {
        params: {
            keyword: searchParams.get('keyword'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        },
    });

    return response;
};

export const createProduct =  (data) => {
    return  apiPrivate.post('products', data);
};

export const deleteProduct =  (productId) => {
    return  apiPrivate.delete(`/products/${productId}`);
};

export const getProductForAdminPage =  (id) => {
    return  apiPublic.get('/products/' + id);
};

export const getProductForClientPage = (id) => {
    return apiPublic.get('/products/client/' + id);
};

export const updateProduct =  (id, product) => {
    return  apiPrivate.put('/products/' + id, product);
};

export const getAllImageProducts =  (id) => {
    return  apiPublic.get('products/' + id + '/images');
};

export const createImage =  (productId, formData) => {
    return  apiPrivate.post(
        `products/${productId}/createImage`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
   
};

export const updateImageBackground =  (productId, imageUrl) => {
    return  apiPrivate.put(
        `products/${productId}/updateProductBackground`,
        imageUrl,
        {
            headers: {
                'Content-Type': 'text/plain',
            },
        }
    );
    
};

export const getAllProductByCategory =  (catId, key) => {
    return  apiPublic.get(`products/getByCategory/` + catId, {
        params: {
            keyword: key,
        },
    });
};

export const getSelectedListProducts = (selected) => {
    return apiPublic.get(`products/selectListProducts`, {
        params: {
            selected: selected,
        },
    });
};

export const getTopProduct = (startDate, endDate) => {
    console.log(
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD')
    );
        
    return apiPrivate.get(`products/selectByDate`, {
        params: {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
        },
    });
};