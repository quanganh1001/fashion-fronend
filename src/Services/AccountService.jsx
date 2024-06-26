import { apiPrivate } from '../Ultils/AxiosCustomize';

export const getAllAccount = async (searchParams) => {
    return await apiPrivate.get('accounts', {
        params: {
            keyword: searchParams.get('keyword'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        },
    });
};

export const getAccount = async (id) => {
    return await apiPrivate.get('accounts/' + id);
};

export const getCurrentAccount = async () => {
    return await apiPrivate.get('accounts/current');
};

export const updateAccount = async (accountUpdateDto) => {
    return await apiPrivate.put('accounts/edit', accountUpdateDto);
};

export const updateRole = async (id, role) => {
    return await apiPrivate.put('accounts/' + id + '/updateRole', role);
};

export const createAccount = async (account) => {
    return await apiPrivate.post('accounts', account);
};

export const activation = async (id) => {
    return await apiPrivate.put('accounts/' + id + '/activated');
};

export const deleteAccount = async (id) => {
    return await apiPrivate.delete('accounts/' + id);
};

export const getAllEmployees = async () => {
    return await apiPrivate.get('accounts/getAllEmployees');
};
