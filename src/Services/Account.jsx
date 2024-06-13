import { apiPrivate } from '../Ultils/AxiosCustomize';

export const getAllAccount = async () => {
    return await apiPrivate.get('accounts');
};

export const activation = async (id) => {
    return await apiPrivate.put('accounts/'+id+'/activated');
};

export const deleteAccount = async (id) => {
    return await apiPrivate.delete('accounts/'+id);
};
