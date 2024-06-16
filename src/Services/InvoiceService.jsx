import { apiPrivate } from '../Ultils/AxiosCustomize';

export const getAllInvoice = async (searchParams, accountId, invoiceStatus) => {
    return await apiPrivate.get('invoices', {
        params: {
            invoiceStatus: invoiceStatus,
            keyword: searchParams.get('keyword'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
            accountId: accountId,
        },
    });
};

export const getInvoice = async (id) => {
    return await apiPrivate.get('invoices/'+id)
}