import { apiPrivate } from '../Ultils/AxiosCustomize';

const deleteImage = async (id) => {
    const response = await apiPrivate.delete('imgProducts/' + id);
    return response;
};

export { deleteImage };
