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

export const updateInvoice = async (id, invoice) => {
    return await apiPrivate.put('invoices/' + id, invoice);
};

export const updateStatusInvoice = async (id, invoiceStatus) => {
    console.log(invoiceStatus);
    return await apiPrivate.put(
        'invoices/' + id + '/updateStatus',
        invoiceStatus
    );
};

export const getAllInvoicesDetail = async (id) => {
    return await apiPrivate.get('invoices/'+id + '/invoicesDetail');
};
