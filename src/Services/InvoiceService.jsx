import { apiPrivate } from '../Ultils/AxiosCustomize';

export const getAllInvoice = async (searchParams, accountId) => {
    const response = await apiPrivate.get(
        'invoices', accountId !== "-1" ? null : accountId,
        {
            params: {
                keyword: searchParams.get('keyword'),
                page: searchParams.get('page'),
                limit: searchParams.get('limit'),
            },
        }
    );
    return response;
};
