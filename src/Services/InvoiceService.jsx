import { apiPrivate, apiPublic } from '../Ultils/AxiosCustomize';

export const getAllInvoice =  (searchParams, accountId, invoiceStatus) => {
    return  apiPrivate.get('invoices', {
        params: {
            invoiceStatus: invoiceStatus,
            keyword: searchParams.get('keyword'),
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
            accountId: accountId,
        },
    });
};

export const getInvoice =  (id) => {
    return  apiPrivate.get('invoices/'+id)
}

export const updateInvoice =  (id, invoice) => {
    return  apiPrivate.put('invoices/' + id, invoice);
};

export const updateStatusInvoice =  (id, invoiceStatus) => {
    return  apiPrivate.put(
        'invoices/' + id + '/updateStatus',
        invoiceStatus
    );
};

export const getAllInvoicesDetail =  (id) => {
    return  apiPrivate.get('invoices/'+id + '/invoicesDetail');
};

export const addInvoiceDetail =  (invoiceId, productDetailId) => {
    return  apiPrivate.post(
        'invoices/' + invoiceId + '/createInvoiceDetail',null,
        {
            params: { productDetailId: productDetailId },
        }
    );
};

export const editShippingFee =  (invoiceId, shippingFee) => {
    return  apiPrivate.put(
        'invoices/' + invoiceId + '/updateShippingFee',
        null,
        {
            params: { shippingFee: shippingFee },
        }
    );
};

export const checkoutVnpay =  (checkoutDto) => {
    return  apiPublic.post('/invoices/checkout', checkoutDto);
};

export const checkoutVnpayWithAuth = (checkoutDto) => {
    return apiPrivate.post('/invoices/checkout', checkoutDto);
};

export const checkoutCash = (checkoutDto) => {
    return apiPublic.post('/invoices/checkoutByCash', checkoutDto);
};

export const checkoutCashWithAuth = (checkoutDto) => {
    return apiPrivate.post('/invoices/checkoutByCash', checkoutDto);
};

export const getAllHistory = (id) => {
    return apiPrivate.get('/invoices/history/' + id)
}