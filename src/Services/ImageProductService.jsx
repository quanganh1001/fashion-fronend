import { apiPrivate } from '../Ultils/AxiosCustomize';

const deleteImage =  (id) => {
    const response =  apiPrivate.delete('imgProducts/' + id);
    return response;
};

export { deleteImage };
