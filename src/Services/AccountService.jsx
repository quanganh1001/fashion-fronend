import { apiPrivate } from '../Ultils/AxiosCustomize';

export const getAllAccount = (searchParams, selectRole) => {
    return apiPrivate.get('accounts', {
        params: {
            keyword: searchParams.get('keyword'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
            role: selectRole,
        },
    });
};

export const getAccount = (id) => {
    return  apiPrivate.get('accounts/' + id);
};

export const getCurrentAccount = () => {
    return  apiPrivate.get('accounts/current');
};

export const updateAccount = (accountUpdateDto) => {
    return  apiPrivate.put('accounts/edit', accountUpdateDto);
};

export const updateRole =  (id, role) => {
    return  apiPrivate.put('accounts/' + id + '/updateRole', role);
};

export const createAccount =  (account) => {
    return  apiPrivate.post('accounts', account);
};

export const activation =  (id) => {
    return  apiPrivate.put('accounts/' + id + '/activated');
};

export const deleteAccount =  (id) => {
    return  apiPrivate.delete('accounts/' + id);
};

export const getAllEmployees =  () => {
    return  apiPrivate.get('accounts/getAllEmployees');
};

export const changePass = (id,currentPass,newPass) => {
    return apiPrivate.put('accounts/' + id + '/changePass', {
        currentPass: currentPass,
        newPass: newPass,
    });
};
